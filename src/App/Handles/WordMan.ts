import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedWordData, Word } from "../Types";
import { StorageKey_CurrentNotiWords } from "../Constants/StorageKey";
import { GetArrayAsync, SetArrayAsync } from "../../Common/AsyncStorageUtils";
import { SafeArrayLength } from "../../Common/UtilsTS";
import { BridgeTranslateMultiWordAsync } from "./TranslateBridge";
import { LocalText } from "../Hooks/useLocalText";
import { TranslatedResult } from "../../Common/DeepTranslateApi";
import { AddSeenWordsAsync, LoadSeenWordsAsync } from "./SeenWords";
import { SavedWordToTranslatedResult, TranslatedResultToSavedWord } from "./AppUtils";
import { GetNextWordsDataForNotiAsync, GetWordsDataAsync, SetUsedWordIndexAsync } from "./WordsData";
import { GetTargetLangAsync } from "./Settings";

// Set Noti --------------------------------

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
    const seenWords = await LoadSeenWordsAsync()

    const alreadyFetchedWords: SavedWordData[] = []

    const needFetchWords = words.filter(word => {
        if (!seenWords)
            return true

        const seen = seenWords.find(seen => seen.word === word && toLang === seen.localized.lang)

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
 * @returns words.length maybe >= count
 */
export const SetupWordsForSetNotiAsync = async (count: number): Promise<SetupWordsForSetNotiResult> => {
    const targetLang = await GetTargetLangAsync()

    // error not set lang yet

    if (!targetLang) {
        return {
            errorText: 'pls_set_target_lang',
        } as SetupWordsForSetNotiResult
    }

    // get not seen words (already have saved data)

    let alreadyFetchedAndNotSeenWords = await AddSeenWordsAndRefreshCurrentNotiWordsAsync()

    // if not seen words not match current lang => need to refetch

    let alreadyFetchedAndNotSeenWords_ButNotMatchLang: Word[] | undefined

    if (alreadyFetchedAndNotSeenWords && alreadyFetchedAndNotSeenWords.findIndex(i => i.localized.lang !== targetLang) >= 0) {
        alreadyFetchedAndNotSeenWords_ButNotMatchLang = await GetWordsDataAsync(alreadyFetchedAndNotSeenWords.map(i => i.word))
        alreadyFetchedAndNotSeenWords = undefined
    }

    // enough fetched words, not need fetch more.

    if (alreadyFetchedAndNotSeenWords && alreadyFetchedAndNotSeenWords.length >= count) {
        return {
            words: alreadyFetchedAndNotSeenWords,
        } as SetupWordsForSetNotiResult
    }

    // get new words count from data file for enough 'count'

    const neededNextWordsCount = count - SafeArrayLength(alreadyFetchedAndNotSeenWords) - SafeArrayLength(alreadyFetchedAndNotSeenWords_ButNotMatchLang)

    let nextWordsToFetch = await GetNextWordsDataForNotiAsync(neededNextWordsCount)

    // add not seen words but not match lang to refetch

    if (alreadyFetchedAndNotSeenWords_ButNotMatchLang)
        nextWordsToFetch = nextWordsToFetch.concat(alreadyFetchedAndNotSeenWords_ButNotMatchLang)

    // fetch data for new words

    const translatedResultArrOrError = await LoadFromSeenWordsOrTranslateAsync(
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
        SetUsedWordIndexAsync(-1)

        const translatedWords: SavedWordData[] = translatedResultArrOrError.map(translatedResult => {
            return TranslatedResultToSavedWord(translatedResult, targetLang, -1)
        })

        return {
            words: alreadyFetchedAndNotSeenWords ?
                translatedWords.concat(alreadyFetchedAndNotSeenWords) :
                translatedWords
        } as SetupWordsForSetNotiResult
    }
}

// Current Noti Words --------------------------------

const AddSeenWordsAndRefreshCurrentNotiWordsAsync = async (): Promise<SavedWordData[] | undefined> => {
    const arr = await GetCurrentNotiWordsAsync()

    if (arr === undefined)
        return undefined

    const now = Date.now()

    const seenArr: SavedWordData[] = []
    const notSeenArr: SavedWordData[] = []

    for (let word of arr) {
        if (word.notiTick > now)
            notSeenArr.push(word)
        else
            seenArr.push(word)
    }

    // handle seens => save to db

    if (seenArr.length > 0)
        await AddSeenWordsAsync(seenArr)

    // handle not seens => save back to SetCurrentNotiWordsAsync

    await SetCurrentNotiWordsAsync(notSeenArr)

    return notSeenArr
}

const GetCurrentNotiWordsAsync = async (): Promise<SavedWordData[] | undefined> => {
    return await GetArrayAsync<SavedWordData>(StorageKey_CurrentNotiWords)
}

export const SetCurrentNotiWordsAsync = async (savedDatas: SavedWordData[]) => {
    const s = await AsyncStorage.getItem(StorageKey_CurrentNotiWords)

    if (s) {
        console.error('pls handle list before saving');
        return
    }

    await SetArrayAsync(StorageKey_CurrentNotiWords, savedDatas)
}