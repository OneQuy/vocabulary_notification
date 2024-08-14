// NUMBER [CHANGE HERE]: 0

import { StorageKey_ForceDev } from "../App/Constants/StorageKey"
import { GetBooleanAsync, SetBooleanAsync } from "./AsyncStorageUtils"
import { GetRemoteConfigWithCheckFetchAsync } from "./RemoteConfig"
import { UserID } from "./UserID"

var isDev = false
var inited = false
var tapSetDevPersistenceCount = 0

const DevDevices = [
    // '05073BCD-4B4A-4CF9-B4ED-055241D45573', // emulator iphone SE
    
    '2BD27B3C-F044-4AB6-A2F1-15F9F5172C7E', // iphone 6 timo
    '8E3C624D-FD5F-4AF3-9DA7-F0D95C11DA98', // ip 15
    
    '0ea1c473e9c9535d', // samsung s8
]

/**
 * @usage: can call this after handle app config.
 */
export const IsDev = () => {
    if (!inited) {
        console.error('[IsDev] not inited yet.')
        return false
    }

    return isDev
}

export const CheckIsDevAsync = async (forceReload?: boolean): Promise<void> => {
    if (inited && forceReload !== true)
        return

    inited = true

    const isDevSaved = await GetBooleanAsync(StorageKey_ForceDev)

    if (__DEV__ ||
        DevDevices.includes(UserID()) ||
        isDevSaved)
        isDev = true
    else {
        const config = await GetRemoteConfigWithCheckFetchAsync()

        if (!config) {
            isDev = false
        }
        else {
            isDev = config.forceDev === 1
        }
    }
}

/**
 * @return true if did set dev success
 */
export const CheckTapSetDevPersistence = (): boolean => {
    if (!IsDev) {
        return false
    }

    tapSetDevPersistenceCount++

    if (tapSetDevPersistenceCount < 20)
        return false

    tapSetDevPersistenceCount = 0

    SetBooleanAsync(StorageKey_ForceDev, true)

    return true
}