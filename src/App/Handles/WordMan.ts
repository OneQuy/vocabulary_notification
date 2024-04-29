import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedWordData, Word } from "../Types";
import { StorageKey_CurrentNotiWords, StorageKey_SeenWords, StorageKey_TargetLang } from "../Constants/StorageKey";
import { GetArrayAsync, SetArrayAsync } from "../../Common/AsyncStorageUtils";
import { PickRandomElement, SafeArrayLength, SafeGetArrayElement } from "../../Common/UtilsTS";
import { BridgeTranslateMultiWordAsync } from "./TranslateBridge";
import { LocalText } from "../Hooks/useLocalText";
import { Language, TranslatedResult } from "../../Common/DeepTranslateApi";

const arrWords: Word[] = require('./../../../data.json') as Word[] // tmp

// settings

const GetTargetLangAsync = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(StorageKey_TargetLang)
}

// Set Noti --------------------------------

export type SetupWordsForSetNotiResult = {
    words?: SavedWordData[],
    errorText?: keyof LocalText,
    error?: Error,
}

const GetWordsDataAsync = async (words: string[]): Promise<Word[]> => {
    return arrWords.filter(word => words.includes(word.word))
}

const SetReachedWordIndexAsync = async (index: number): Promise<void> => {
}

const GetNextWordsFromDataAsync = async (count: number): Promise<Word[]> => {
    // get cur index
    // return get index

    const arr: Word[] = []

    if (count <= 0)
        return arr

    for (let i = 0; i < count; i++)
        arr.push(PickRandomElement(arrWords))

    return arr
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

    let nextWordsToFetch = await GetNextWordsFromDataAsync(neededNextWordsCount)

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
        SetReachedWordIndexAsync(-1)

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

// Seen Words --------------------------------

const AddSeenWordsAsync = async (addWords: SavedWordData[]): Promise<void> => {
    let savedArr = await GetArrayAsync<SavedWordData>(StorageKey_SeenWords)

    if (savedArr === undefined) // never save seen words before
        savedArr = addWords
    else // append current ones
    {
        for (let add of addWords) {
            const idx = savedArr.findIndex(saved => IsSameSavedWord(saved, add))

            if (idx >= 0) // saved already
                continue

            savedArr.unshift(add)
        }
    }

    await SetArrayAsync(StorageKey_SeenWords, savedArr)
}

export const LoadSeenWordsAsync = async (): Promise<SavedWordData[] | undefined> => {
    return GetArrayAsync(StorageKey_SeenWords)
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

// other

const SavedWordToTranslatedResult = (saved: SavedWordData): TranslatedResult => {
    return {
        text: saved.word,
        translated: saved.localized.translated,
    } as TranslatedResult
}

const TranslatedResultToSavedWord = (translate: TranslatedResult, lang: string, notiTick: number): SavedWordData => {
    return {
        word: translate.text,
        notiTick,

        localized: {
            translated: translate.translated,
            lang,
        },
    } as SavedWordData
}

const IsSameSavedWord = (s1: SavedWordData, s2: SavedWordData) => {
    return (
        s1.word === s2.word &&
        s1.localized.translated === s2.localized.translated &&
        s1.localized.lang === s2.localized.lang
    )
}
