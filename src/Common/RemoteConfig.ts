// NUMBER OF [CHANGE HERE]: 1

import { ExecuteWithTimeoutAsync, ToCanPrint, ToCanPrintError } from './UtilsTS'
import { FirebaseDatabaseTimeOutMs, FirebaseDatabase_GetValueAsync } from "./Firebase/FirebaseDatabase"


type RemoteConfig = { // CHANGE HERE 1
    // common

    remote_files?: object,

    // specific

    currentLifetimeId: string,
}

const IsLog = true

const FirebaseDBPath = 'app/config';

var remoteConfig: RemoteConfig | undefined

// export const GetRemoteConfig = () => remoteConfig

/**
 * ### notice:
 * it can take a while (5s) if the config currently not available.
 */
export async function GetRemoteConfigWithCheckFetchAsync(): Promise<RemoteConfig | undefined> {
    if (remoteConfig) {
        return remoteConfig
    }

    await FetchRemoteConfigAsync()

    return remoteConfig
}

/**
 * 
 * @returns version or NaN if fail to get config
 */
export function GetRemoteFileConfigVersion(file: string) {
    if (!remoteConfig || !remoteConfig.remote_files)
        return Number.NaN

    // @ts-ignore
    const version = remoteConfig.remote_files[file]

    if (typeof version === 'number')
        return version as number
    else
        return Number.NaN
}

/**
 * 
 * @returns true if download success
 */
export async function FetchRemoteConfigAsync(): Promise<boolean> {
    if (IsLog)
        console.log('[FetchRemoteConfigAsync] fetching...')

    // already fetched

    if (remoteConfig) {
        if (IsLog)
            console.log('[FetchRemoteConfigAsync] success (already fetched)')

        return true
    }

    // start fetch

    const res = await ExecuteWithTimeoutAsync(
        async () => await FirebaseDatabase_GetValueAsync(FirebaseDBPath),
        FirebaseDatabaseTimeOutMs
    )

    // fail time out

    if (res.isTimeOut || res.result === undefined) {
        if (IsLog)
            console.log('[FetchRemoteConfigAsync] fail timeout')

        return false
    }

    const result = res.result

    // fail firebase

    if (result.error) {
        console.error('[FetchRemoteConfigAsync] error fetch', ToCanPrintError(result.error))
        return false
    }

    // success

    remoteConfig = result.value as RemoteConfig

    if (IsLog)
        console.log('[FetchRemoteConfigAsync] fetched success', ToCanPrint(remoteConfig))

    return true
}