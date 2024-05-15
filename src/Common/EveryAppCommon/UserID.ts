import AsyncStorage from "@react-native-async-storage/async-storage"
import { StorageKey_UserID } from "../constants/AppConstants"
import { randomUUID } from "expo-crypto"

var userID: string
var inited = false

/**
 * @usage: can call this after handle app config.
 */
export const UserID = () => {
    if (!inited)
        throw new Error('[IsDev] not inited yet.')

    return userID
}

export const GenID = () => {
    let s1 = Math.random().toString(36).substring(2)

    if (s1.length > 4)
        s1 = s1.substring(0, 4)

    let s2 = Math.random().toString(36).substring(2)

    if (s2.length > 4)
        s2 = s2.substring(0, 4)

    return Date.now() + '_' + s1 + '_' + s2
}

export const InitUserIDAsync = async (): Promise<void> => {
    if (inited)
        return

    inited = true

    let s = await AsyncStorage.getItem(StorageKey_UserID)

    if (!s) {
        s = GenID()

        AsyncStorage.setItem(StorageKey_UserID, s)
        console.log('init new user id', s);
    }

    userID = s
}
