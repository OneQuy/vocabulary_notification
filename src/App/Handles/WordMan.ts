import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedWordData, Word } from "../Types";
import { StorageKey_CurrentNotiWords, StorageKey_SeenWords } from "../Constants/StorageKey";
import { GetArrayAsync, SetArrayAsync } from "../../Common/AsyncStorageUtils";
import { PickRandomElement, SafeArrayLength } from "../../Common/UtilsTS";

const arrWords: Word[] = require('./../../../data.json') as Word[] // tmp

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
    // get not seen words (already have saved data)

    const notSeenWords = await CutAndSaveSeenWordsAndGetNotSeenWordsFromCurrentNotiWordsAsync()

    // get new word from data file for enough 'count'

    const nextWords = await GetNextWordsFromDataAsync(count - SafeArrayLength(notSeenWords))
    
    // fetch data for new words

    // if success return []

    // if fail, LoadSeenWordsAsync
}

// Seen Words --------------------------------

const AddSeenWordsAsync = async (words: SavedWordData[]): Promise<void> => {
    let arr = await GetArrayAsync<SavedWordData>(StorageKey_SeenWords)

    if (arr === undefined)
        arr = words
    else
        arr = arr.concat(words)

    await SetArrayAsync(StorageKey_SeenWords, arr)
}

export const LoadSeenWordsAsync = async (): Promise<SavedWordData[] | undefined> => {
    return GetArrayAsync(StorageKey_SeenWords)
}

// Current Noti Words --------------------------------

const CutAndSaveSeenWordsAndGetNotSeenWordsFromCurrentNotiWordsAsync = async (): Promise<SavedWordData[] | undefined> => {
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
        AddSeenWordsAsync(seenArr)

    // handle not seens => save back to SetCurrentNotiWordsAsync

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