import { SavedWordData } from "../Types";
import { StorageKey_CurrentAllNotifications } from "../Constants/StorageKey";
import { GetArrayAsync, SetArrayAsync } from "../../Common/AsyncStorageUtils";
import { BridgeTranslateMultiWordAsync } from "./TranslateBridge";
import { LocalText } from "../Hooks/useLocalText";
import { TranslatedResult } from "../../Common/DeepTranslateApi";
import { AddOrUpdateLocalizedWordsToDbAsync, GetLocalizedWordFromDbAsync, GetLocalizedWordsFromDbIfAvailableAsync } from "./LocalizedWordsTable";
import { AlertError, CalcNotiTimeListPerDay, CheckDeserializeLocalizedData, ExtractWordLangString, SavedWordToTranslatedResult, TimePickerResultToTimestamp, ToWordLangString, TranslatedResultToSavedWord } from "./AppUtils";
import { SafeArrayLength, SafeGetArrayElement } from "../../Common/UtilsTS";
import { GetExcludeTimesAsync, GetIntervalMinAsync, GetLimitWordsPerDayAsync, GetNumDaysToPushAsync, GetTargetLangAsync } from "./Settings";
import { GetNextWordsDataForNotiAsync, SetUsedWordIndexAsync } from "./WordsData";
import { NotificationOption, cancelAllLocalNotificationsAsync, requestPermissionNotificationAsync, setNotification } from "../../Common/Nofitication";
import { AuthorizationStatus } from "@notifee/react-native";

const IsLog = true

type SetupWordsForSetNotiResult = {
    words?: SavedWordData[],
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

    // get not seen words (already have saved data)

    const alreadyFetchedAndNotSeenWords = await GetLocalizedWordFromDbAsync(targetLang, false)

    if (IsLog)
        console.log('[SetupWordsForSetNotiAsync] alreadyFetchedAndNotSeenWords', SafeArrayLength(alreadyFetchedAndNotSeenWords))

    // enough fetched words, not need fetch more.

    if (!(alreadyFetchedAndNotSeenWords instanceof Error) && alreadyFetchedAndNotSeenWords.length >= numRequired) {
        if (IsLog)
            console.log('[SetupWordsForSetNotiAsync] alreadyFetchedAndNotSeenWords is enough required, not need to fetch any', SafeArrayLength(alreadyFetchedAndNotSeenWords))

        return {
            words: alreadyFetchedAndNotSeenWords.slice(0, numRequired),
        } as SetupWordsForSetNotiResult
    }

    // get new words count from data file for enough 'count'

    const neededFetchWordsCount = numRequired - SafeArrayLength(alreadyFetchedAndNotSeenWords)

    const getNextWordsDataForNotiResult = await GetNextWordsDataForNotiAsync(neededFetchWordsCount)

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

        SetUsedWordIndexAsync(getNextWordsDataForNotiResult.usedWordIndex)

        const translatedWords: SavedWordData[] = translatedResultArrOrError.map(translatedResult => {
            return TranslatedResultToSavedWord(translatedResult, targetLang, -1)
        })

        return {
            words: (alreadyFetchedAndNotSeenWords instanceof Error) ?
                translatedWords :
                translatedWords.concat(alreadyFetchedAndNotSeenWords)
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
        else
            pushedArr.push(word)
    }

    if (IsLog)
        console.log('[UpdateSeenWordsAndRefreshCurrentNotiWordsAsync] pushed words', SafeArrayLength(pushedArr),
            'not pushed words', notPushedArr.length)

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
            const wordToPush = SafeGetArrayElement<SavedWordData>(wordsOfDay, undefined, iPushOfDay, true)

            if (!wordToPush ||
                !CheckDeserializeLocalizedData(wordToPush).translated
            ) {
                return {
                    error: new Error('[SetNotificationAsync] what? wordToPush === undefined OR CheckDeserializeLocalizedData(wordToPush).translated === undefinded')
                }
            }

            const timestamp = TimePickerResultToTimestamp(iday, pushTimesPerDay[iPushOfDay])

            const title = ExtractWordLangString(wordToPush.wordAndLang)[0]
            const message = CheckDeserializeLocalizedData(wordToPush).translated

            const noti: NotificationOption = {
                title,
                message,
                timestamp,
            }

            setNotification(noti)

            if (IsLog)
                console.log(title, new Date(timestamp).toLocaleString(), message)

            didSetNotiList.push({
                wordAndLang: wordToPush.wordAndLang,
                localizedData: wordToPush.localizedData,
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