import { Definition, SavedWordData, Word } from "../Types";
import { StorageKey_CurrentAllNotifications, StorageKey_ShowDefinitions, StorageKey_ShowExample, StorageKey_ShowPartOfSpeech, StorageKey_ShowPhonetic, StorageKey_ShowRankOfWord } from "../Constants/StorageKey";
import { GetArrayAsync, GetBooleanAsync, SetArrayAsync } from "../../Common/AsyncStorageUtils";
import { BridgeTranslateMultiWordAsync } from "./TranslateBridge";
import { LocalText, NoPermissionText, PleaseSelectTargetLangText } from "../Hooks/useLocalText";
import { TranslatedResult } from "../../Common/TranslationApis/DeepTranslateApi";
import { AddOrUpdateLocalizedWordsToDbAsync, GetLocalizedWordFromDbAsync, GetLocalizedWordsFromDbIfAvailableAsync } from "./LocalizedWordsTable";
import { CalcNotiTimeListPerDay, CheckDeserializeLocalizedData, ExtractWordFromWordLang, SavedWordToTranslatedResult, TimePickerResultToTimestamp, ToWordLangString, TranslatedResultToSavedWord } from "./AppUtils";
import { CapitalizeFirstLetter, PickRandomElement, SafeArrayLength, SafeGetArrayElement } from "../../Common/UtilsTS";
import { GetExcludeTimesAsync, GetIntervalMinAsync, GetLimitWordsPerDayAsync, GetNumDaysToPushAsync, GetTargetLangAsync } from "./Settings";
import { GetNextWordsDataCurrentLevelForNotiAsync, GetWordsDataCurrentLevelAsync, SetUsedWordIndexCurrentLevelAsync } from "./WordsData";
import { DisplayNotificationAsync, NotificationOption, cancelAllLocalNotificationsAsync, requestPermissionNotificationAsync, setNotification } from "../../Common/Nofitication";
import { AuthorizationStatus } from "@notifee/react-native";
import { HandlingType } from "../Screens/SetupScreen";
import { HandleError } from "../../Common/Tracking";

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

/**
 * 
 * @param toLang undefined means get current target lang.
 */
const GetAlreadyFetchedWordsDataCurrentLevelAsync = async (
    targetLang: string | undefined,
    pushed: boolean | undefined,
): Promise<SavedAndWordData[] | Error> => {
    let fetchedWordsInDbOrError = await GetLocalizedWordFromDbAsync(targetLang, pushed)

    if (fetchedWordsInDbOrError instanceof Error)
        return fetchedWordsInDbOrError

    const dataOfFetchedWordsCurrentLevelOrError = await GetWordsDataCurrentLevelAsync(
        fetchedWordsInDbOrError.map(word => ExtractWordFromWordLang(word.wordAndLang)))

    if (dataOfFetchedWordsCurrentLevelOrError instanceof Error)
        return dataOfFetchedWordsCurrentLevelOrError

    const arr: SavedAndWordData[] = []

    for (let word of dataOfFetchedWordsCurrentLevelOrError) {
        const saved = fetchedWordsInDbOrError.find(saved => ExtractWordFromWordLang(saved.wordAndLang) === word.word)

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

    await UpdatePushedWordsAndRefreshCurrentNotiWordsAsync()

    // get not pushed words (already have fetched data)

    const alreadyFetchedAndNotPushedWordsOfCurrentLevel = await GetAlreadyFetchedWordsDataCurrentLevelAsync(targetLang, false)

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

export const UpdatePushedWordsAndRefreshCurrentNotiWordsAsync = async (): Promise<void> => {
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

/**
 * 
 * @returns undefined means success
 */
export const TestNotificationAsync = async (setHandling: (type: HandlingType) => void): Promise<Error | undefined> => {
    // check permission

    const resPermission = await requestPermissionNotificationAsync()

    if (resPermission.authorizationStatus === AuthorizationStatus.DENIED) {
        return new Error(NoPermissionText)
    }

    // get target lang

    const targetLang = await GetTargetLangAsync()

    if (!targetLang) {
        return new Error(PleaseSelectTargetLangText)
    }

    // get already fetch words

    const fetchedWords = await GetAlreadyFetchedWordsDataCurrentLevelAsync(undefined, undefined)

    if (fetchedWords instanceof Error) {
        return fetchedWords
    }

    const word = PickRandomElement(fetchedWords)

    if (IsLog)
        console.log('[TestNotificationAsync] picked', word?.wordData.word,
            'GetAlreadyFetchedWordsDataCurrentLevelAsync', fetchedWords.length)

    // not fetched any word => need to fetch some

    if (!word) {
        setHandling('downloading')

        const words = await GetNextWordsDataCurrentLevelForNotiAsync(50)

        if (words instanceof Error)
            return words

        const translatedArrOrError = await BridgeTranslateMultiWordAsync(
            words.words.map(i => i.word),
            targetLang)

        // error overall

        if (translatedArrOrError instanceof Error) {
            return translatedArrOrError
        }

        // success all

        setHandling(undefined)

        return await TestNotificationAsync(setHandling)
    }

    // get display setting

    const settingShowPhonetic = await GetBooleanAsync(StorageKey_ShowPhonetic)
    const settingRankOfWord = await GetBooleanAsync(StorageKey_ShowRankOfWord)
    const settingDefinitions = await GetBooleanAsync(StorageKey_ShowDefinitions)
    const settingExample = await GetBooleanAsync(StorageKey_ShowExample)
    const settingShowPartOfSpeech = await GetBooleanAsync(StorageKey_ShowPartOfSpeech)

    // push

    const noti = DataToNotification(
        word,
        0,
        settingRankOfWord,
        settingDefinitions,
        settingShowPartOfSpeech,
        settingExample,
        settingShowPhonetic)

    DisplayNotificationAsync(noti)

    return undefined
}

const ToDisplayPartOfSpeech = (s: string) => {
    if (s === 'j')
        return 'adj'

    else if (s === 'v')
        return 'adv'

    else if (s === 've')
        return 'verb'

    else if (s === 'n')
        return 'noun'

    else if (s === 'p')
        return 'pronoun'

    else if (s === 'pr')
        return 'preposition'

    else if (s === 'c')
        return 'conjunction'

    else if (s === 'nu')
        return 'numeral'

    else if (s === 'i')
        return 'interjection'

    else if (s === 'pn')
        return 'proper noun'

    else
        return s
}

const DataToNotification = (
    data: SavedAndWordData,
    timestamp: number,
    showRank: boolean,
    showDefinitions: boolean,
    showPartOfSpeech: boolean,
    showExample: boolean,
    showPhonetic: boolean
): NotificationOption => {
    if (!data ||
        !data.savedData ||
        !data.wordData
    ) {
        HandleError(data, 'DataToNotification', false)

        return {
            title: '',
            message: ''
        }
    }

    // word

    let title = CapitalizeFirstLetter(ExtractWordFromWordLang(data.savedData.wordAndLang))

    const titleExtraInfoArr: string[] = []

    // phonetic

    if (showPhonetic && data.wordData.phonetics) {
        const phoneticsWithText = data.wordData.phonetics.filter(ph => ph.text !== undefined)
        const phonetic = PickRandomElement(phoneticsWithText)

        if (phonetic && phonetic.text)
            titleExtraInfoArr.push(phonetic.text)
    }

    // // showPartOfSpeech

    // if (showPartOfSpeech) {
    //     const partOrUndefineds = data.wordData.meanings.map(i => i.partOfSpeech)
    //     const parts = partOrUndefineds.filter(p => p !== undefined) as string[]

    //     if (parts.length > 0) {
    //         titleExtraInfoArr.push(parts.map(i => ToDisplayPartOfSpeech(i)).join(', '))
    //     }
    // }

    // showRank

    if (showRank)
        titleExtraInfoArr.push(`#${data.wordData.idx}`)

    // titleExtraInfoArr

    if (titleExtraInfoArr.length > 0)
        title = `${title} (${titleExtraInfoArr.join(', ')})`

    // translated

    const translated = CheckDeserializeLocalizedData(data.savedData).translated
    let message = CapitalizeFirstLetter(translated)

    // showDefinitions, showExample, showPartOfSpeech

    if (showDefinitions || showExample || showPartOfSpeech) {
        const arr: string[] = []

        for (let meaning of data.wordData.meanings) {
            let def: Definition | undefined

            if (showExample) {
                def = meaning.definitions.find(i => i.example !== undefined)
            }

            if (!def)
                def = meaning.definitions[0]

            arr.push(
                `[${ToDisplayPartOfSpeech(meaning.partOfSpeech ?? '')}]` +
                (showDefinitions ? ` ${def.definition}` : '') +
                (showExample && def.example ? ` (Ex: ${def.example})` : '')
            )
        }

        message = `${message}. ${arr.join(' | ')}`
    }

    // return

    const noti: NotificationOption = {
        title,
        message,
        timestamp,
    }

    if (IsLog)
        console.log(`${noti.title}: ${noti.message} (${new Date(timestamp).toLocaleString()})`)

    return noti
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
        HandleError('what? can not fetch enough words', 'SetNotificationAsync', false)

        return {
            error: new Error('[SetNotificationAsync] what? can not fetch enough words')
        }
    }

    const uniqueWordsOfAllDay = setupWordsResult.words

    // get display setting

    const settingShowPhonetic = await GetBooleanAsync(StorageKey_ShowPhonetic)
    const settingRankOfWord = await GetBooleanAsync(StorageKey_ShowRankOfWord)
    const settingDefinitions = await GetBooleanAsync(StorageKey_ShowDefinitions)
    const settingExample = await GetBooleanAsync(StorageKey_ShowExample)
    const settingShowPartOfSpeech = await GetBooleanAsync(StorageKey_ShowPartOfSpeech)

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

            const noti = DataToNotification(
                wordToPush,
                timestamp,
                settingRankOfWord,
                settingDefinitions,
                settingShowPartOfSpeech,
                settingExample,
                settingShowPhonetic)

            setNotification(noti)

            if (IsLog)
                console.log(`${noti.title}: ${noti.message} (${new Date(timestamp).toLocaleString()})`)

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