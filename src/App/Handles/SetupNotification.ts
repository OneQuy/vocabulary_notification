import { Definition, SavedWordData, Word } from "../Types";
import { StorageKey_CurrentAllNotifications, StorageKey_ShowDefinitions, StorageKey_ShowExample, StorageKey_ShowPartOfSpeech, StorageKey_ShowPhonetic, StorageKey_ShowRankOfWord } from "../Constants/StorageKey";
import { GetArrayAsync, GetBooleanAsync, SetArrayAsync } from "../../Common/AsyncStorageUtils";
import { BridgeTranslateMultiWordAsync } from "./TranslateBridge";
import { LocalText, NoNotificationPermissionLocalKey, NoPermissionText, PleaseSelectTargetLangText } from "../Hooks/useLocalText";
import { AddOrUpdateLocalizedWordsToDbAsync, GetLocalizedWordFromDbAsync, GetLocalizedWordsFromDbIfAvailableAsync } from "./LocalizedWordsTable";
import { CalcNotiTimeListPerDay, CheckDeserializeLocalizedData, ExtractWordFromWordLang, SavedWordToTranslatedResult, TimePickerResultToTimestamp, ToWordLangString, TranslatedResultToSavedWord } from "./AppUtils";
import { CapitalizeFirstLetter, Clamp, IsNumType, PickRandomElement, SafeArrayLength, SafeGetArrayElement, SafeGetArrayLastElement, SafeValue } from "../../Common/UtilsTS";
import { GetExcludeTimesAsync, GetIntervalMinAsync, GetLimitWordsPerDayAsync, GetSourceLangAsync, GetTargetLangAsync } from "./Settings";
import { GetNextWordsDataCurrentLevelForNotiAsync, GetWordsDataCurrentLevelAsync, SetUsedWordIndexCurrentLevelAsync } from "./WordsData";
import { DisplayNotificationAsync, NotificationOption, SetNotificationAsync, CancelAllLocalNotificationsAsync, RequestPermissionNotificationAsync } from "../../Common/Nofitication";
import { HandlingType } from "../Screens/SetupScreen";
import { HandleError } from "../../Common/Tracking";
import { TranslatedResult } from "../../Common/TranslationApis/TranslationLanguages";
import { GetAlternativeConfig } from "../../Common/RemoteConfig";
import { Platform } from "react-native";

const IsLog = __DEV__

export const NotificationExtraDataKey_Mode = 'mode'
export const NotificationExtraDataKey_PushIndex = 'pushIdx'

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
    process?: (process: number) => void
): Promise<TranslatedResult[] | Error> => {
    const alreadySavedWords = await GetLocalizedWordsFromDbIfAvailableAsync(toLang, words)

    const needFetchWords = words.filter(wordToCheck => {
        if (!Array.isArray(alreadySavedWords))
            return true

        const seen = alreadySavedWords.find(seen => seen.wordAndLang === ToWordLangString(wordToCheck, toLang))

        return seen === undefined
    })

    if (IsLog)
        console.log('[LoadFromLocalizedDbOrTranslateWordsAsync] alreadySavedWords', SafeArrayLength(alreadySavedWords),
            'needFetchWords', needFetchWords.length)

    // already fetched all, did not fetch anymore

    if (Array.isArray(alreadySavedWords) && needFetchWords.length <= 0) {
        return alreadySavedWords.map(saved => {
            return SavedWordToTranslatedResult(saved)
        })
    }

    // fetch

    const translatedArrOrError = await BridgeTranslateMultiWordAsync(
        needFetchWords,
        toLang,
        fromLang,
        undefined,
        undefined,
        process
    )

    // error overall

    if (!Array.isArray(translatedArrOrError)) {
        return translatedArrOrError
    }

    // success all

    else {
        if (IsLog)
            console.log('[LoadFromLocalizedDbOrTranslateWordsAsync] translated success all', translatedArrOrError.length)

        const alreadyArr = !Array.isArray(alreadySavedWords) ? [] : alreadySavedWords.map(word => SavedWordToTranslatedResult(word))
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

    if (!Array.isArray(fetchedWordsInDbOrError))
        return fetchedWordsInDbOrError

    const dataOfFetchedWordsCurrentLevelOrError = await GetWordsDataCurrentLevelAsync(
        fetchedWordsInDbOrError.map(word => ExtractWordFromWordLang(word.wordAndLang)))

    if (!Array.isArray(dataOfFetchedWordsCurrentLevelOrError))
        return dataOfFetchedWordsCurrentLevelOrError

    const arr: SavedAndWordData[] = []

    for (let word of dataOfFetchedWordsCurrentLevelOrError) {
        const saved = fetchedWordsInDbOrError.find(saved => ExtractWordFromWordLang(saved.wordAndLang).toUpperCase() === word.word)

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
const SetupWordsForSetNotiAsync = async (
    numRequired: number,
    process?: (process: number) => void
): Promise<SetupWordsForSetNotiResult> => {
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

    if (Array.isArray(alreadyFetchedAndNotPushedWordsOfCurrentLevel) && alreadyFetchedAndNotPushedWordsOfCurrentLevel.length >= numRequired) {
        if (IsLog)
            console.log('[SetupWordsForSetNotiAsync] alreadyFetchedAndNotPushedWordsOfCurrentLevel is enough required (not need to fetch any)', SafeArrayLength(alreadyFetchedAndNotPushedWordsOfCurrentLevel))

        return {
            words: alreadyFetchedAndNotPushedWordsOfCurrentLevel.slice(0, numRequired),
        } as SetupWordsForSetNotiResult
    }

    // get new words count from data file for enough 'count'

    const neededFetchWordsCount = numRequired - SafeArrayLength(alreadyFetchedAndNotPushedWordsOfCurrentLevel)

    const getNextWordsDataForNotiResult = await GetNextWordsDataCurrentLevelForNotiAsync(neededFetchWordsCount)

    if (getNextWordsDataForNotiResult instanceof Error || !Array.isArray(getNextWordsDataForNotiResult.words)) {
        return {
            error: getNextWordsDataForNotiResult
        } as SetupWordsForSetNotiResult
    }

    let nextWordsToFetch = getNextWordsDataForNotiResult.words

    // fetch data for new words

    const translatedResultArrOrError = await LoadFromLocalizedDbOrTranslateWordsAsync(
        nextWordsToFetch.map(word => word.word),
        targetLang,
        undefined,
        process
    )

    // error overall

    if (!Array.isArray(translatedResultArrOrError)) {
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
            const word = nextWordsToFetch.find(w => w.word === translatedResult.text.toUpperCase())

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
            words: !Array.isArray(alreadyFetchedAndNotPushedWordsOfCurrentLevel) ?
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
    if (IsLog) {
        console.log('[SetCurrentAllNotificationsAsync] set length', currentAllNotifications.length)
    }

    await SetArrayAsync(StorageKey_CurrentAllNotifications, currentAllNotifications)
}

/**
 * 
 * @returns undefined means success
 */
export const TestNotificationAsync = async (setHandling: (type: HandlingType) => void): Promise<Error | undefined> => {
    // check permission

    const resPermission = await RequestPermissionNotificationAsync(true)

    if (!resPermission) {
        return new Error(NoPermissionText)
    }

    // get target lang

    const targetLang = await GetTargetLangAsync()

    if (!targetLang) {
        return new Error(PleaseSelectTargetLangText)
    }

    // get already fetch words

    const fetchedWords = await GetAlreadyFetchedWordsDataCurrentLevelAsync(targetLang, undefined)

    if (!Array.isArray(fetchedWords)) {
        return fetchedWords
    }

    const word = PickRandomElement(fetchedWords)

    if (IsLog)
        console.log('[TestNotificationAsync] picked', word?.wordData.word,
            'GetAlreadyFetchedWordsDataCurrentLevelAsync', fetchedWords.length)

    // not fetched any word => need to fetch some

    if (!word) {
        setHandling('downloading')

        const wordsResultOrError = await GetNextWordsDataCurrentLevelForNotiAsync(10)

        if (wordsResultOrError instanceof Error || !Array.isArray(wordsResultOrError.words)) {
            setHandling(undefined)

            return wordsResultOrError as Error
        }

        const translatedArrOrError = await BridgeTranslateMultiWordAsync(
            wordsResultOrError.words.map(i => i.word),
            targetLang,
            await GetSourceLangAsync())

        setHandling(undefined)

        // error overall

        if (!Array.isArray(translatedArrOrError)) {
            return translatedArrOrError
        }

        // success all

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
        undefined,
        settingRankOfWord,
        settingDefinitions,
        settingShowPartOfSpeech,
        settingExample,
        settingShowPhonetic,
        false,
    )

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

const CalcNumDaysToPush = (totalPushsPerDay: number) => {
    const LimitPushes = 64

    const MinDays = 1

    const MaxDays = Platform.OS === 'android' ?
        GetAlternativeConfig('maxDaysToPushAndroid', 10) :
        GetAlternativeConfig('maxDaysToPushiOS', 10)

    let numDays = 0

    if (!IsNumType(totalPushsPerDay) || totalPushsPerDay <= 0)
        numDays = MaxDays
    else {
        numDays = Math.floor(LimitPushes / totalPushsPerDay)
        numDays = Clamp(numDays, MinDays, MaxDays)
    }

    if (IsLog) {
        console.log('[CalcNumDaysToPush]', 'num days to push', numDays)
    }

    return numDays
}

const DataToNotification = (
    data: SavedAndWordData,
    timestamp: number | undefined,
    showRank: boolean,
    showDefinitions: boolean,
    showPartOfSpeech: boolean,
    showExample: boolean,
    showPhonetic: boolean,
    isSetOrTest: boolean,
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

        message = `${message}. ${arr.join(' ')}`
    }

    // return

    const noti: NotificationOption = {
        title,
        message,
        timestamp,

        data: {
            [NotificationExtraDataKey_Mode]: isSetOrTest ? 'set' : 'test'
        }
    }

    // if (IsLog)
    //     console.log(`${noti.title}: ${noti.message} (${new Date(timestamp).toLocaleString()})`)

    return noti
}

const SortTimestampAndSetNotificationsAsync = async (
    notifications: NotificationOption[]
): Promise<number> => {
    notifications.sort((a, b) => {
        if (!IsNumType(a.timestamp) || !IsNumType(b.timestamp))
            return 0
        else
            return a.timestamp - b.timestamp
    })

    let previousDay = 0
    let idx = 0

    for (let push of notifications) {
        // timestamp

        let timestamp = push.timestamp

        if (!IsNumType(timestamp)) {
            HandleError('what? timestamp is not number', 'SortTimestampAndSetNotificationsAsync')
            continue
        }

        const day = new Date(timestamp)

        if (day.getDate() !== previousDay) {
            previousDay = day.getDate()
            console.log() // new day, break line
        }

        // set idx

        if (push.data)
            push.data[NotificationExtraDataKey_PushIndex] = idx

        // set !

        await SetNotificationAsync(push)

        // log

        const log = `${++idx}. (${day.toLocaleString()}) ${push.title}`

        if (IsLog)
            console.log(log)
    }

    const lastPush = SafeGetArrayLastElement<NotificationOption>(notifications)

    return SafeValue(lastPush?.timestamp, 0)
}

export const SetupNotificationAsync = async (
    texts: LocalText,
    process?: (process: number) => void
): Promise<number | SetupNotificationError> => {
    const resPermission = await RequestPermissionNotificationAsync(true)

    if (!resPermission) {
        return {
            errorText: NoNotificationPermissionLocalKey
        }
    }

    const intervalInMin = await GetIntervalMinAsync()
    const limitWordsPerDay = await GetLimitWordsPerDayAsync()
    const excludedTimePairs = await GetExcludeTimesAsync()

    // numPushesPerDay

    const pushTimesPerDay = CalcNotiTimeListPerDay(intervalInMin, excludedTimePairs)

    if (IsLog) {
        console.log('[SetNotificationAsync]',
            'pushTimesPerDay', pushTimesPerDay.length,
            'intervalInMin', intervalInMin)
    }

    // num Unique Words Per Day

    const numUniqueWordsPerDay = limitWordsPerDay > 0 ?
        Math.min(pushTimesPerDay.length, limitWordsPerDay) : // limit
        pushTimesPerDay.length // no limit

    if (IsLog) {
        console.log('[SetNotificationAsync]',
            'numUniqueWordsPerDay', numUniqueWordsPerDay,
            'limitWordsPerDay', limitWordsPerDay)
    }

    // num Unique Words Of All Day

    const numDaysToPush = CalcNumDaysToPush(pushTimesPerDay.length)

    const numUniqueWordsOfAllDay = numUniqueWordsPerDay * numDaysToPush

    if (IsLog) {
        console.log('[SetNotificationAsync] numUniqueWordsOfAllDay', numUniqueWordsOfAllDay)
    }

    // unique Words Of All Day

    const setupWordsResult = await SetupWordsForSetNotiAsync(numUniqueWordsOfAllDay, process)

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

    // setup each noti

    await CancelAllLocalNotificationsAsync()

    if (IsLog) {
        console.log('[SetNotificationAsync] Canceled All Local Notifications')
    }

    const didSetNotiList: SavedWordData[] = []
    const notifications: NotificationOption[] = []

    for (let iday = 0; iday < numDaysToPush; iday++) { // day by day
        const wordsOfDay = uniqueWordsOfAllDay.slice(iday * numUniqueWordsPerDay, iday * numUniqueWordsPerDay + numUniqueWordsPerDay)

        for (let iPushOfDay = 0; iPushOfDay < pushTimesPerDay.length; iPushOfDay++) { // pushes of day
            let timestamp = TimePickerResultToTimestamp(iday, pushTimesPerDay[iPushOfDay])

            // check these pushes are passed of today, so let push at the end day

            if (timestamp <= Date.now()) {
                // if (IsLog)
                //     console.log(`(${new Date(timestamp).toLocaleString()}) skipped today`)

                // continue

                timestamp = TimePickerResultToTimestamp(numDaysToPush, pushTimesPerDay[iPushOfDay])
            }

            // get word 

            const wordToPush = SafeGetArrayElement<SavedAndWordData>(wordsOfDay, undefined, iPushOfDay, true)

            if (!wordToPush ||
                !CheckDeserializeLocalizedData(wordToPush.savedData).translated
            ) {
                return {
                    error: new Error('[SetNotificationAsync] what? wordToPush === undefined OR CheckDeserializeLocalizedData(wordToPush).translated === undefinded')
                }
            }

            // generate noti data

            const notiData = DataToNotification(
                wordToPush,
                timestamp,
                settingRankOfWord,
                settingDefinitions,
                settingShowPartOfSpeech,
                settingExample,
                settingShowPhonetic,
                true
            )

            // add to list

            notifications.push(notiData)

            // add to push list

            didSetNotiList.push({
                wordAndLang: wordToPush.savedData.wordAndLang,
                localizedData: wordToPush.savedData.localizedData,
                lastNotiTick: timestamp,
            })
        }
    }

    // cache list

    SetCurrentAllNotificationsAsync(didSetNotiList)

    // sort time and set push

    const timestampLastPush = await SortTimestampAndSetNotificationsAsync(notifications)

    // set remind push

    const remindTimestamp = TimePickerResultToTimestamp(numDaysToPush + 1, pushTimesPerDay[0])

    const remindPush: NotificationOption = {
        title: texts.congrats,
        message: texts.run_out_push,
        timestamp: remindTimestamp,
        data: {
            [NotificationExtraDataKey_PushIndex]: notifications.length,
        }
    }

    await SetNotificationAsync(remindPush)

    if (IsLog) {
        console.log()
        console.log(`${notifications.length + 1}.`, `(${new Date(remindTimestamp).toLocaleString()}) REMIND PUSH`, remindPush);
    }

    // return 

    return timestampLastPush
}