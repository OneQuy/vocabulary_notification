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

    const needFetchWords = words.filter(word => !seenWords || seenWords.findIndex(i => i.word === word && toLang === i.localized.lang) < 0)

    const savedWords = seenWords ?
        seenWords.filter(word => words.includes(word.word)) :
        undefined

    if (savedWords && needFetchWords.length <= 0)
        return savedWords.map(saved => {
            return {
                text: saved.word,
                translated?: saved.localized.translated
                error?: Error,
            } as TranslatedResult
        })


    // if (seenWords) {
    //     for (let saved of seenWords) {
    //         if (words.includes(saved.word)) {
    //             savedWords.push(saved)
    //         }
    //     }
    // }
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

    let notSeenWords = await AddSeenWordsAndRefreshCurrentNotiWordsAsync()

    // if not seen words not match current lang => need to refetch

    let notSeenWords_NotMatchLang: Word[] | undefined

    if (notSeenWords && notSeenWords.findIndex(i => i.localized.lang !== targetLang) >= 0) {
        notSeenWords_NotMatchLang = await GetWordsDataAsync(notSeenWords.map(i => i.word))
        notSeenWords = undefined
    }

    // enough fetched words, not need fetch more.

    if (notSeenWords && notSeenWords.length >= count) {
        return {
            words: notSeenWords,
        } as SetupWordsForSetNotiResult
    }

    // get new words count from data file for enough 'count'

    const neededNextWordsCount = count - SafeArrayLength(notSeenWords) - SafeArrayLength(notSeenWords_NotMatchLang)

    let nextWords = await GetNextWordsFromDataAsync(neededNextWordsCount)

    // add not seen words but not match lang to refetch

    if (notSeenWords_NotMatchLang)
        nextWords = nextWords.concat(notSeenWords_NotMatchLang)

    // fetch data for new words

    const translatedApiResultArrOrError = await BridgeTranslateMultiWordAsync(
        nextWords.map(word => word.word),
        targetLang)

    // if fail, random from LoadSeenWordsAsync

    if (translatedApiResultArrOrError instanceof Error) { // error overall
        return {
            errorText: 'fail_translate',
            error: translatedApiResultArrOrError,
        } as SetupWordsForSetNotiResult
    }

    // error each or success all

    else {
        const successAny = translatedApiResultArrOrError.findIndex(t => t.translated !== undefined) >= 0

        // error all

        if (!successAny) {
            const first = SafeGetArrayElement<TranslatedResult>(translatedApiResultArrOrError)

            return {
                errorText: 'fail_translate',
                error: first?.error,
            } as SetupWordsForSetNotiResult
        }

        // success all or some words

        SetReachedWordIndexAsync(-1)

        const words: SavedWordData[] = translatedApiResultArrOrError.map(translate => {
            return {
                word: translate.text,
                notiTick: -1,

                localized: {
                    translated: translate.translated,
                    lang: targetLang,
                },
            } as SavedWordData
        })

        return {
            words: notSeenWords ? words.concat(notSeenWords) : words
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

const IsSameSavedWord = (s1: SavedWordData, s2: SavedWordData) => {
    return (
        s1.word === s2.word &&
        s1.localized.translated === s2.localized.translated &&
        s1.localized.lang === s2.localized.lang
    )
}
