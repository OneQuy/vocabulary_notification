import { SavedWordData, Word } from "../Types";
import { StorageKey_CurrentAllNotifications } from "../Constants/StorageKey";
import { GetArrayAsync, SetArrayAsync } from "../../Common/AsyncStorageUtils";
import { BridgeTranslateMultiWordAsync } from "./TranslateBridge";
import { LocalText } from "../Hooks/useLocalText";
import { TranslatedResult } from "../../Common/DeepTranslateApi";
import { AddOrUpdateLocalizedWordsToDbAsync, GetLocalizedWordFromDbAsync, GetLocalizedWordsFromDbIfAvailableAsync } from "./LocalizedWordsTable";
import { AlertError, CalcNotiTimeListPerDay, CheckDeserializeLocalizedData, ExtractWordFromWordLang, SavedWordToTranslatedResult, TimePickerResultToTimestamp, ToWordLangString, TranslatedResultToSavedWord } from "./AppUtils";
import { SafeArrayLength, SafeGetArrayElement } from "../../Common/UtilsTS";
import { GetExcludeTimesAsync, GetIntervalMinAsync, GetLimitWordsPerDayAsync, GetNumDaysToPushAsync, GetTargetLangAsync } from "./Settings";
import { GetNextWordsDataCurrentLevelForNotiAsync, GetWordsDataCurrentLevelAsync, SetUsedWordIndexCurrentLevelAsync } from "./WordsData";
import { NotificationOption, cancelAllLocalNotificationsAsync, requestPermissionNotificationAsync, setNotification } from "../../Common/Nofitication";
import { AuthorizationStatus } from "@notifee/react-native";

const IsLog = true

type SavedAndWordData = {
    savedData: SavedWordData,
    wordData: Word,
}

type SetupWordsForSetNotiResult = {
    words?: SavedAndWordData[],

    errorText?: keyof LocalText,
    error?: Error,
}

export type SetupNotificationError = {
    errorText?: keyof LocalText,
    error?: Error,
}

const LoadFromLocalizedDbOrTranslateWordsAsync = async (
    words: string[],
    toLang: string,
    fromLang?: string,
): Promise<TranslatedResult[] | Error> => {
    const alreadySavedWords = await GetLocalizedWordsFromDbIfAvailableAsync(toLang, words)

    const needFetchWords = words.filter(wordToCheck => {
        if (alreadySavedWords instanceof Error)
            return true

        const seen = alreadySavedWords.find(seen => seen.wordAndLang === ToWordLangString(wordToCheck, toLang))

        return seen === undefined
    })

    if (IsLog)
        console.log('[LoadFromLocalizedDbOrTranslateWordsAsync] alreadySavedWords', SafeArrayLength(alreadySavedWords),
            'needFetchWords', needFetchWords.length)

    // already fetched all, did not fetch anymore

    if (!(alreadySavedWords instanceof Error) && needFetchWords.length <= 0) {
        return alreadySavedWords.map(saved => {
            return SavedWordToTranslatedResult(saved)
        })
    }

    // fetch

    const translatedArrOrError = await BridgeTranslateMultiWordAsync(
        needFetchWords,
        toLang,
        fromLang)

    // error overall

    if (translatedArrOrError instanceof Error) {
        return translatedArrOrError
    }

    // success all

    else {
        if (IsLog)
            console.log('[LoadFromLocalizedDbOrTranslateWordsAsync] fetched (translated) success all', translatedArrOrError.length)

        const alreadyArr = (alreadySavedWords instanceof Error) ? [] : alreadySavedWords.map(word => SavedWordToTranslatedResult(word))
        return translatedArrOrError.concat(alreadyArr)
    }
}

const GetAlreadyFetchedAndNotPushedWordsCurrentLevelAsync = async (targetLang: string): Promise<SavedAndWordData[] | Error> => {
    let allNotPushedWordsInDbOrError = await GetLocalizedWordFromDbAsync(targetLang, false)

    if (allNotPushedWordsInDbOrError instanceof Error)
        return allNotPushedWordsInDbOrError

    const dataOfNotPushedWordsCurrentLevelOrError = await GetWordsDataCurrentLevelAsync(
        allNotPushedWordsInDbOrError.map(word => ExtractWordFromWordLang(word.wordAndLang)))

    if (dataOfNotPushedWordsCurrentLevelOrError instanceof Error)
        return dataOfNotPushedWordsCurrentLevelOrError

    const arr: SavedAndWordData[] = []

    for (let word of dataOfNotPushedWordsCurrentLevelOrError) {
        const saved = allNotPushedWordsInDbOrError.find(saved => ExtractWordFromWordLang(saved.wordAndLang) === word.word)

        if (!saved)
            continue

        arr.push({
            wordData: word,
            savedData: saved
        })
    }

    return arr
}

/**
 * do call: AddSeenWordsAndRefreshCurrentNotiWordsAsync
 * 
 * ### note:
 * @returns length must === numUniqueWordsOfAllDay
 */
const SetupWordsForSetNotiAsync = async (numRequired: number): Promise<SetupWordsForSetNotiResult> => {
    const targetLang = await GetTargetLangAsync()

    // error not set lang yet

    if (!targetLang) {
        return {
            errorText: 'pls_set_target_lang',
        } as SetupWordsForSetNotiResult
    }

    if (IsLog)
        console.log('[SetupWordsForSetNotiAsync] numRequired', numRequired)

    // UpdateSeenWordsAndRefreshCurrentNotiWordsAsync

    await UpdateSeenWordsAndRefreshCurrentNotiWordsAsync()

    // get not pushed words (already have saved data)

    const alreadyFetchedAndNotPushedWordsOfCurrentLevel = await GetAlreadyFetchedAndNotPushedWordsCurrentLevelAsync(targetLang)

    if (IsLog)
        console.log('[SetupWordsForSetNotiAsync] alreadyFetchedAndNotPushedWordsOfCurrentLevel', SafeArrayLength(alreadyFetchedAndNotPushedWordsOfCurrentLevel))

    // enough fetched words, not need fetch more.

    if (!(alreadyFetchedAndNotPushedWordsOfCurrentLevel instanceof Error) && alreadyFetchedAndNotPushedWordsOfCurrentLevel.length >= numRequired) {
        if (IsLog)
            console.log('[SetupWordsForSetNotiAsync] alreadyFetchedAndNotPushedWordsOfCurrentLevel is enough required (not need to fetch any)', SafeArrayLength(alreadyFetchedAndNotPushedWordsOfCurrentLevel))

        return {
            words: alreadyFetchedAndNotPushedWordsOfCurrentLevel.slice(0, numRequired),
        } as SetupWordsForSetNotiResult
    }

    // get new words count from data file for enough 'count'

    const neededFetchWordsCount = numRequired - SafeArrayLength(alreadyFetchedAndNotPushedWordsOfCurrentLevel)

    const getNextWordsDataForNotiResult = await GetNextWordsDataCurrentLevelForNotiAsync(neededFetchWordsCount)

    if (getNextWordsDataForNotiResult instanceof Error) {
        return {
            error: getNextWordsDataForNotiResult
        } as SetupWordsForSetNotiResult
    }

    let nextWordsToFetch = getNextWordsDataForNotiResult.words

    // fetch data for new words

    const translatedResultArrOrError = await LoadFromLocalizedDbOrTranslateWordsAsync(
        nextWordsToFetch.map(word => word.word),
        targetLang)

    // error overall

    if (translatedResultArrOrError instanceof Error) {
        return {
            errorText: 'fail_translate',
            error: translatedResultArrOrError,
        } as SetupWordsForSetNotiResult
    }

    // success all

    else {
        if (IsLog)
            console.log('[SetupWordsForSetNotiAsync] translated success all', getNextWordsDataForNotiResult.words.length)

        SetUsedWordIndexCurrentLevelAsync(getNextWordsDataForNotiResult.usedWordIndex)

        const translatedWords: SavedAndWordData[] = []

        for (let translatedResult of translatedResultArrOrError) {
            const saved = TranslatedResultToSavedWord(translatedResult, targetLang, -1)
            const word = nextWordsToFetch.find(w => w.word === translatedResult.text)

            if (word === undefined) { // what?
                return {
                    errorText: 'fail_translate',
                } as SetupWordsForSetNotiResult
            }

            translatedWords.push({
                wordData: word,
                savedData: saved
            })
        }

        return {
            words: (alreadyFetchedAndNotPushedWordsOfCurrentLevel instanceof Error) ?
                translatedWords :
                translatedWords.concat(alreadyFetchedAndNotPushedWordsOfCurrentLevel)
        } as SetupWordsForSetNotiResult
    }
}

const UpdateSeenWordsAndRefreshCurrentNotiWordsAsync = async (): Promise<void> => {
    const arr = await GetCurrentAllNotificationsAsync()

    if (arr === undefined)
        return

    const now = Date.now()

    const pushedArr: SavedWordData[] = []
    const notPushedArr: SavedWordData[] = []

    for (let word of arr) {
        if (word.lastNotiTick > now)
            notPushedArr.push(word)
        else {
            // if (IsLog)
            // console.log('[UpdateSeenWordsAndRefreshCurrentNotiWordsAsync] this word is pushed', word.wordAndLang,
            //     'lastNotiTick', word.lastNotiTick,
            //     'now', now)

            pushedArr.push(word)
        }
    }

    if (IsLog)
        console.log('[UpdateSeenWordsAndRefreshCurrentNotiWordsAsync] pushed words', SafeArrayLength(pushedArr),
            'not pushed words', notPushedArr.length,
            '=> update noti tick of pushed words to db:')


    // handle seens => save last noti tick to db

    if (pushedArr.length > 0)
        await AddOrUpdateLocalizedWordsToDbAsync(pushedArr)

    // update SetCurrentAllNotificationsAsync

    await SetCurrentAllNotificationsAsync(notPushedArr)
}

const GetCurrentAllNotificationsAsync = async (): Promise<SavedWordData[] | undefined> => {
    return await GetArrayAsync<SavedWordData>(StorageKey_CurrentAllNotifications)
}

export const SetCurrentAllNotificationsAsync = async (currentAllNotifications: SavedWordData[]) => {
    await SetArrayAsync(StorageKey_CurrentAllNotifications, currentAllNotifications)
}

export const SetNotificationAsync = async (): Promise<undefined | SetupNotificationError> => {
    const resPermission = await requestPermissionNotificationAsync()

    if (resPermission.authorizationStatus === AuthorizationStatus.DENIED) {
        return {
            errorText: 'no_permission'
        }
    }

    const intervalInMin = await GetIntervalMinAsync()
    const limitWordsPerDay = await GetLimitWordsPerDayAsync()
    const numDaysToPush = await GetNumDaysToPushAsync()
    const excludedTimePairs = await GetExcludeTimesAsync()

    // numPushesPerDay

    const pushTimesPerDay = CalcNotiTimeListPerDay(intervalInMin, excludedTimePairs)

    if (IsLog) {
        console.log('[SetNotificationAsync]',
            'pushTimesPerDay', pushTimesPerDay.length,
            'intervalInMin', intervalInMin)
    }

    // numUniqueWordsPerDay

    const numUniqueWordsPerDay = limitWordsPerDay > 0 ?
        Math.min(pushTimesPerDay.length, limitWordsPerDay) : // limit
        pushTimesPerDay.length // no limit

    if (IsLog) {
        console.log('[SetNotificationAsync]',
            'numUniqueWordsPerDay', numUniqueWordsPerDay,
            'limitWordsPerDay', limitWordsPerDay)
    }

    // numUniqueWordsOfAllDay

    const numUniqueWordsOfAllDay = numUniqueWordsPerDay * numDaysToPush

    if (IsLog) {
        console.log('[SetNotificationAsync]',
            'numUniqueWordsOfAllDay', numUniqueWordsOfAllDay,
            'numDaysToPush', numDaysToPush)
    }

    // uniqueWordsOfAllDay

    const setupWordsResult = await SetupWordsForSetNotiAsync(numUniqueWordsOfAllDay)

    if (setupWordsResult.error || setupWordsResult.errorText) {
        return {
            error: setupWordsResult.error,
            errorText: setupWordsResult.errorText
        }
    }

    if (SafeArrayLength(setupWordsResult.words) !== numUniqueWordsOfAllDay ||
        !Array.isArray(setupWordsResult.words)) { // ts
        AlertError('[SetNotificationAsync] what? can not fetch enough words')

        return {
            error: new Error('[SetNotificationAsync] what? can not fetch enough words')
        }
    }

    const uniqueWordsOfAllDay = setupWordsResult.words

    // set noti !

    await cancelAllLocalNotificationsAsync()

    const didSetNotiList: SavedWordData[] = []

    for (let iday = 0; iday < numDaysToPush; iday++) { // day by day
        const wordsOfDay = uniqueWordsOfAllDay.slice(iday * numUniqueWordsPerDay, iday * numUniqueWordsPerDay + numUniqueWordsPerDay)

        for (let iPushOfDay = 0; iPushOfDay < pushTimesPerDay.length; iPushOfDay++) { // pushes of day
            const timestamp = TimePickerResultToTimestamp(iday, pushTimesPerDay[iPushOfDay])

            if (timestamp <= Date.now()) {
                if (IsLog)
                    console.log(`skipped today (${new Date(timestamp).toLocaleString()})`)

                continue
            }

            const wordToPush = SafeGetArrayElement<SavedAndWordData>(wordsOfDay, undefined, iPushOfDay, true)

            if (!wordToPush ||
                !CheckDeserializeLocalizedData(wordToPush.savedData).translated
            ) {
                return {
                    error: new Error('[SetNotificationAsync] what? wordToPush === undefined OR CheckDeserializeLocalizedData(wordToPush).translated === undefinded')
                }
            }

            const title = ExtractWordFromWordLang(wordToPush.savedData.wordAndLang)
            const message = CheckDeserializeLocalizedData(wordToPush.savedData).translated

            const noti: NotificationOption = {
                title,
                message,
                timestamp,
            }

            setNotification(noti)

            if (IsLog)
                console.log(`${title}: ${message} (${new Date(timestamp).toLocaleString()})`)

            didSetNotiList.push({
                wordAndLang: wordToPush.savedData.wordAndLang,
                localizedData: wordToPush.savedData.localizedData,
                lastNotiTick: timestamp,
            })
        }
    }

    if (IsLog) {
        console.log('[SetNotificationAsync]',
            'didSetNotiList', didSetNotiList.length)
    }

    SetCurrentAllNotificationsAsync(didSetNotiList)

    return undefined
}