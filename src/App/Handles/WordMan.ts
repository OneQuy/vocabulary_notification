import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedWordData } from "../Types";
import { StorageKey_CurrentNotiWords } from "../Constants/StorageKey";
import { SaveArrayAsync } from "../../Common/AsyncStorageUtils";

export const SetCurrentNotiWordsAsync = async (savedDatas: SavedWordData[]) => {
    const s = await AsyncStorage.getItem(StorageKey_CurrentNotiWords)

    if (s) {
        console.error('pls handle list before saving');
        return
    }

    await SaveArrayAsync(StorageKey_CurrentNotiWords, savedDatas)
}