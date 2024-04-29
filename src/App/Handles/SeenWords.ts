import { GetArrayAsync, SetArrayAsync } from "../../Common/AsyncStorageUtils"
import { StorageKey_SeenWords } from "../Constants/StorageKey"
import { SavedWordData } from "../Types"
import { IsSameSavedWord } from "./AppUtils"

export const AddSeenWordsAsync = async (addWords: SavedWordData[]): Promise<void> => {
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