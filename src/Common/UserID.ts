// NUMBER [CHANGE HERE]: 1
// Note:
// If use react-native-device-info, not change anything.
// If not use react-native-device-info, only need to rem at [CHANGE HERE 1]

import AsyncStorage from "@react-native-async-storage/async-storage"
import { StorageKey_UserID } from "../App/Constants/StorageKey"

import DeviceInfo from "react-native-device-info" // can rem this if not use

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

/**
 * ND
 */
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

const GenID = (): string => { // CHANGE HERE 1
    // DeviceInfo WAY ----------------------------

    return DeviceInfo.getUniqueIdSync();

    // NOT DeviceInfo WAY ----------------------------

    // let s1 = Math.random().toString(36).substring(2)

    // if (s1.length > 4)
    //     s1 = s1.substring(0, 4)

    // let s2 = Math.random().toString(36).substring(2)

    // if (s2.length > 4)
    //     s2 = s2.substring(0, 4)

    // return Date.now() + '_' + s1 + '_' + s2

    // NOT DeviceInfo WAY ----------------------------
}