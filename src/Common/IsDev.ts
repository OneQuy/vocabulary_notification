// NUMBER [CHANGE HERE]: 0

import { StorageKey_ForceDev } from "../App/Constants/StorageKey"
import { GetBooleanAsync, SetBooleanAsync } from "./AsyncStorageUtils"
import { GetRemoteConfigWithCheckFetchAsync } from "./RemoteConfig"

var isDev = false
var inited = false
var tapSetDevPersistenceCount = 0

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

    if (__DEV__ || isDevSaved)
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