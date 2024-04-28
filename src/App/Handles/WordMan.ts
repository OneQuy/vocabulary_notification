import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedWordData, Word } from "../Types";
import { StorageKey_CurrentNotiWords, StorageKey_SeenWords, StorageKey_TargetLang } from "../Constants/StorageKey";
import { GetArrayAsync, SetArrayAsync } from "../../Common/AsyncStorageUtils";
import { PickRandomElement, SafeArrayLength } from "../../Common/UtilsTS";
import { BridgeTranslateMultiWordAsync } from "./TranslateBridge";

const arrWords: Word[] = require('./../../../data.json') as Word[] // tmp

// settings

const GetTargetLangAsync = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(StorageKey_TargetLang)
}

// Set Noti --------------------------------

export type SetupWordsForSetNotiResult = {
    words?: SavedWordData[],
    error?: Error,
}

const GetNextWordsFromDataAsync = async (count: number): Promise<Word[]> => {
    const arr: Word[] = []

    for (let i = 0; i < count; i++)
        arr.push(PickRandomElement(arrWords))

    return arr
}

export const SetupWordsForSetNotiAsync = async (count: number): Promise<SetupWordsForSetNotiResult> => {
    const targetLang = await GetTargetLangAsync()

    if (!targetLang) {
        return {
            error: new Error('Please setl')
        } as SetupWordsForSetNotiResult
    }

    // get not seen words (already have saved data)

    const notSeenWords = await AddSeenWordsAndRefreshCurrentNotiWordsAsync()

    // get new word from data file for enough 'count'

    const neededNextWords = count - SafeArrayLength(notSeenWords)

    if (neededNextWords <= 0) { // enough fetched words, not need fetch more.
        return {
            words: notSeenWords,
        } as SetupWordsForSetNotiResult
    }

    const nextWords = await GetNextWordsFromDataAsync(neededNextWords)

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