import AsyncStorage from "@react-native-async-storage/async-storage"
import { StorageKey_TargetLang } from "../Constants/StorageKey"

export const GetTargetLangAsync = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(StorageKey_TargetLang)
}