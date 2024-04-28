import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedWordData, Word } from "../Types";
import { StorageKey_CurrentNotiWords, StorageKey_SeenWords, StorageKey_TargetLang } from "../Constants/StorageKey";
import { GetArrayAsync, SetArrayAsync } from "../../Common/AsyncStorageUtils";
import { PickRandomElement, SafeArrayLength } from "../../Common/UtilsTS";
import { BridgeTranslateMultiWordAsync } from "./TranslateBridge";
import { LocalText } from "../Hooks/useLocalText";

const arrWords: Word[] = require('./../../../data.json') as Word[] // tmp

// settings

const GetTargetLangAsync = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(StorageKey_TargetLang)
}

// Set Noti --------------------------------

export type SetupWordsForSetNotiResult = {
    words?: SavedWordData[],
    errorText?: keyof LocalText,
}

const GetWordsFromDataAsync = async (words: string[]): Promise<Word[]> => {
    return arrWords.filter(word => words.includes(word.word))
}

const GetNextWordsFromDataAsync = async (count: number): Promise<Word[]> => {
    const arr: Word[] = []

    for (let i = 0; i < count; i++)
        arr.push(PickRandomElement(arrWords))

    return arr
}

/**
 * 
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

    let notSeenWords_NotMatchLang: string[] | undefined

    if (notSeenWords && notSeenWords.findIndex(i =>i.targetLang !== targetLang) >= 0) {
        notSeenWords_NotMatchLang = notSeenWords.map(i => i.word)
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


    // fetch data for new words

    const translateRes = await BridgeTranslateMultiWordAsync(
        nextWords.map(word => word.word),
        'en')

    // if success return []

    // if fail, LoadSeenWordsAsync
}

// Seen Words --------------------------------

const AddSeenWordsAsync = async (words: SavedWordData[]): Promise<void> => {
    let arr = await GetArrayAsync<SavedWordData>(StorageKey_SeenWords)

    if (arr === undefined)
        arr = words
    else
        arr = words.concat(arr)

    await SetArrayAsync(StorageKey_SeenWords, arr)
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