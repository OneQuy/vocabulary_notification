// NUMBER [CHANGE HERE]: 1

import { StorageKey_ForceDev } from "../App/Constants/StorageKey" // CHANGE HERE 1
import { GetBooleanAsync } from "./AsyncStorageUtils"
import { GetRemoteConfigWithCheckFetchAsync } from "./RemoteConfig"

var isDev = false
var inited = false

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

export const CheckIsDevAsync = async (): Promise<void> => {
    if (inited)
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
            isDev = config.force_dev === 1
        }
    }
}