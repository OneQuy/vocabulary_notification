import AsyncStorage from "@react-native-async-storage/async-storage"
import { StorageKey_UserID } from "../App/Constants/StorageKey"

var userID: string
var inited = false

/**
 * @usage: can call this after handle app remote config.
 */
export const UserID = () => {
    if (!inited)
        throw new Error('[UserID] not inited yet.')

    return userID
}

export const InitUserIDAsync = async (): Promise<void> => {
    if (inited)
        return

    inited = true

    let s = await AsyncStorage.getItem(StorageKey_UserID)

    if (!s) {
        s = GenID()

        AsyncStorage.setItem(StorageKey_UserID, s)
        console.log('init new UserID', s);
    }

    userID = s
}

const GenID = () => {
    let s1 = Math.random().toString(36).substring(2)

    if (s1.length > 4)
        s1 = s1.substring(0, 4)

    let s2 = Math.random().toString(36).substring(2)

    if (s2.length > 4)
        s2 = s2.substring(0, 4)

    return Date.now() + '_' + s1 + '_' + s2
}