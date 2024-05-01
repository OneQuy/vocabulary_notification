import { SavedWordData } from "../Types";
import { StorageKey_CurrentAllNotifications } from "../Constants/StorageKey";
import { GetArrayAsync, SetArrayAsync } from "../../Common/AsyncStorageUtils";
import { BridgeTranslateMultiWordAsync } from "./TranslateBridge";
import { LocalText } from "../Hooks/useLocalText";
import { TranslatedResult } from "../../Common/DeepTranslateApi";
import { GetLocalizedWordFromDbAsync } from "./LocalizedWordsTable";
import { SavedWordToTranslatedResult } from "./AppUtils";

export type SetupWordsForSetNotiResult = {
    words?: SavedWordData[],
    errorText?: keyof LocalText,
    error?: Error,
}

export const LoadFromSeenWordsOrTranslateAsync = async (
    words: string[],
    toLang: string,
    fromLang?: string,
): Promise<TranslatedResult[] | Error> => {
    const seenWords = await GetLocalizedWordFromDbAsync()

    const alreadyFetchedWords: SavedWordData[] = []

    const needFetchWords = words.filter(word => {
        if (seenWords instanceof Error)
            return true

        const seen = seenWords.find(seen => seen.wordAndLang)

        if (seen)
            alreadyFetchedWords.push(seen)

        return seen === undefined
    })

    // already fetched all, did not fetch anymore

    if (needFetchWords.length <= 0) {
        return alreadyFetchedWords.map(saved => {
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
        const alreadyArr = alreadyFetchedWords.map(word => SavedWordToTranslatedResult(word))

        return translatedArrOrError.concat(alreadyArr)
    }
}

/**
 * do call: AddSeenWordsAndRefreshCurrentNotiWordsAsync
 * 
 * ### note:
 * @returns words.length must === numUniqueWordsOfAllDay
 */
export const SetupWordsForSetNotiAsync = async (numUniqueWordsOfAllDay: number): Promise<SetupWordsForSetNotiResult> => {
    return {}

    // const targetLang = await GetTargetLangAsync()

    // // error not set lang yet

    // if (!targetLang) {
    //     return {
    //         errorText: 'pls_set_target_lang',
    //     } as SetupWordsForSetNotiResult
    // }

    // // get not seen words (already have saved data)

    // let alreadyFetchedAndNotSeenWords = await AddSeenWordsAndRefreshCurrentNotiWordsAsync()

    // // if not seen words not match current lang => need to refetch

    // let alreadyFetchedAndNotSeenWords_ButNotMatchLang: Word[] | undefined

    // if (alreadyFetchedAndNotSeenWords && alreadyFetchedAndNotSeenWords.findIndex(i => i.localizedData.lang !== targetLang) >= 0) {
    //     const wordsDataOrError = await GetWordsDataAsync(alreadyFetchedAndNotSeenWords.map(i => i.word))

    //     if (wordsDataOrError instanceof Error) {
    //         return {
    //             error: wordsDataOrError
    //         } as SetupWordsForSetNotiResult
    //     }

    //     alreadyFetchedAndNotSeenWords_ButNotMatchLang = wordsDataOrError
    //     alreadyFetchedAndNotSeenWords = undefined
    // }

    // // enough fetched words, not need fetch more.

    // if (alreadyFetchedAndNotSeenWords && alreadyFetchedAndNotSeenWords.length >= numUniqueWordsOfAllDay) {
    //     return {
    //         words: alreadyFetchedAndNotSeenWords,
    //     } as SetupWordsForSetNotiResult
    // }

    // // get new words count from data file for enough 'count'

    // const neededNextWordsCount = numUniqueWordsOfAllDay - SafeArrayLength(alreadyFetchedAndNotSeenWords) - SafeArrayLength(alreadyFetchedAndNotSeenWords_ButNotMatchLang)

    // const getNextWordsDataForNotiResult = await GetNextWordsDataForNotiAsync(neededNextWordsCount)

    // if (getNextWordsDataForNotiResult instanceof Error) {
    //     return {
    //         error: getNextWordsDataForNotiResult
    //     } as SetupWordsForSetNotiResult
    // }

    // let nextWordsToFetch = getNextWordsDataForNotiResult.words

    // // add not seen words but not match lang to refetch

    // if (alreadyFetchedAndNotSeenWords_ButNotMatchLang)
    //     nextWordsToFetch = nextWordsToFetch.concat(alreadyFetchedAndNotSeenWords_ButNotMatchLang)

    // // fetch data for new words

    // const translatedResultArrOrError = await LoadFromSeenWordsOrTranslateAsync(
    //     nextWordsToFetch.map(word => word.word),
    //     targetLang)

    // // error overall

    // if (translatedResultArrOrError instanceof Error) {
    //     return {
    //         errorText: 'fail_translate',
    //         error: translatedResultArrOrError,
    //     } as SetupWordsForSetNotiResult
    // }

    // // success all

    // else {
    //     SetUsedWordIndexAsync(getNextWordsDataForNotiResult.usedWordIndex)

    //     const translatedWords: SavedWordData[] = translatedResultArrOrError.map(translatedResult => {
    //         return TranslatedResultToSavedWord(translatedResult, targetLang, -1)
    //     })

    //     return {
    //         words: alreadyFetchedAndNotSeenWords ?
    //             translatedWords.concat(alreadyFetchedAndNotSeenWords) :
    //             translatedWords
    //     } as SetupWordsForSetNotiResult
    // }
}

// Current Noti Words --------------------------------

const AddSeenWordsAndRefreshCurrentNotiWordsAsync = async (): Promise<SavedWordData[] | undefined> => {
    const arr = await GetCurrentAllNotificationsAsync()

    if (arr === undefined)
        return undefined

    const now = Date.now()

    const seenArr: SavedWordData[] = []
    const notSeenArr: SavedWordData[] = []

    for (let word of arr) {
        if (word.lastNotiTick > now)
            notSeenArr.push(word)
        else
            seenArr.push(word)
    }

    // handle seens => save to db

    if (seenArr.length > 0)
        await AddOrUpdateLocalizedWordsAsync(seenArr)

    // handle not seens => save back to SetCurrentNotiWordsAsync

    await SetCurrentAllNotificationsAsync(notSeenArr)

    return notSeenArr
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