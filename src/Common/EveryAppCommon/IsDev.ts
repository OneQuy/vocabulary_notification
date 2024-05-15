import { StorageKey_ForceDev } from "../constants/AppConstants"
import { GetAppConfig } from "../RemoteConfig"
import { GetBooleanAsync } from "./AsyncStorageUtils"

var isDev = false
var inited = false

/**
 * @usage: can call this after handle app config.
 */
export const IsDev = () => {
    if (!inited)
        // throw new Error('[IsDev] not inited yet.')
        return false

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
        const config = GetAppConfig()

        if (!config) {
            isDev = false
        }
        else {
            isDev = config.force_dev_01 === 1
        }
    }
}