import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedWordData } from "../Types";
import { StorageKey_CurrentNotiWords, StorageKey_SeenWords } from "../Constants/StorageKey";
import { GetArrayAsync, SetArrayAsync } from "../../Common/AsyncStorageUtils";

export const AddSeenWordsAsync = async (words: SavedWordData[]): Promise<void> => {
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

const CutAndSaveSeenWordsFromCurrentNotiWordsAsync = async (): Promise<void> => {
    const arr = await GetCurrentNotiWordsAsync()

    if (arr === undefined)
        return

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

    await SetCurrentNotiWordsAsync(notSeenArr)
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