import { SavedWordData } from "../Types";
import { StorageKey_CurrentAllNotifications } from "../Constants/StorageKey";
import { GetArrayAsync, SetArrayAsync } from "../../Common/AsyncStorageUtils";
import { BridgeTranslateMultiWordAsync } from "./TranslateBridge";
import { LocalText } from "../Hooks/useLocalText";
import { TranslatedResult } from "../../Common/DeepTranslateApi";
import { AddOrUpdateLocalizedWordsToDbAsync, GetLocalizedWordFromDbAsync, GetLocalizedWordsFromDbIfAvailableAsync } from "./LocalizedWordsTable";
import { SavedWordToTranslatedResult, ToWordLangString, TranslatedResultToSavedWord } from "./AppUtils";
import { SafeArrayLength } from "../../Common/UtilsTS";
import { GetTargetLangAsync } from "./Settings";
import { GetNextWordsDataForNotiAsync, SetUsedWordIndexAsync } from "./WordsData";

const IsLog = true

export type SetupWordsForSetNotiResult = {
    words?: SavedWordData[],
    errorText?: keyof LocalText,
    error?: Error,
}

export const LoadFromLocalizedDbOrTranslateWordsAsync = async (
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
            'needFetchWords', needFetchWords)

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
            console.log('[LoadFromLocalizedDbOrTranslateWordsAsync] fetched (translated) success all')

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
export const SetupWordsForSetNotiAsync = async (numRequired: number): Promise<SetupWordsForSetNotiResult> => {
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
            console.log('[SetupWordsForSetNotiAsync] translated success all')

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

// Current Noti Words --------------------------------

const UpdateSeenWordsAndRefreshCurrentNotiWordsAsync = async (): Promise<void> => {
    const arr = await GetCurrentAllNotificationsAsync()

    if (arr === undefined)
        return

    const now = Date.now()

    const seenArr: SavedWordData[] = []
    const notSeenArr: SavedWordData[] = []

    for (let word of arr) {
        if (word.lastNotiTick > now)
            notSeenArr.push(word)
        else
            seenArr.push(word)
    }

    if (IsLog)
        console.log('[UpdateSeenWordsAndRefreshCurrentNotiWordsAsync] seen words', SafeArrayLength(seenArr),
            'not seen words', notSeenArr.length)

    // handle seens => save last noti tick to db

    if (seenArr.length > 0)
        await AddOrUpdateLocalizedWordsToDbAsync(seenArr)

    // update SetCurrentAllNotificationsAsync

    await SetCurrentAllNotificationsAsync(notSeenArr)
}

const GetCurrentAllNotificationsAsync = async (): Promise<SavedWordData[] | undefined> => {
    return await GetArrayAsync<SavedWordData>(StorageKey_CurrentAllNotifications)
}

export const SetCurrentAllNotificationsAsync = async (currentAllNotifications: SavedWordData[]) => {
    // const s = await AsyncStorage.getItem(StorageKey_CurrentAllNotifications)

    // if (s) {
    //     console.error('pls handle list before saving');
    //     return
    // }

    await SetArrayAsync(StorageKey_CurrentAllNotifications, currentAllNotifications)
}