// NUMBER OF [CHANGE HERE]: 0

import { AlertAsync, DateDiff_InHour_WithNow, DateDiff_InMinute_WithNow, ExecuteWithTimeoutAsync, SafeValue, ToCanPrint, ToCanPrintError } from './UtilsTS'
import { FirebaseDatabaseTimeOutMs, FirebaseDatabase_GetValueAsync } from "./Firebase/FirebaseDatabase"
import { RemoteConfig } from './SpecificType';
import { HandleAlertUpdateAppAsync } from './HandleAlertUpdateApp';
import { LocalText, NotLatestConfig } from '../App/Hooks/useLocalText';

// const IsLog = __DEV__
const IsLog = false

const FirebaseDBPath = 'app/config';

export const HowLongToReloadRemoteConfigInHour = 6 // hour

var remoteConfig: RemoteConfig | undefined
var fetchedCount = 0
var lastTimeFetchedSuccessAndHandledAlerts = 0
var lastTimeFetchedSuccess = 0

/**
 * 
 * force fetch
 * @returns true if download success
 */
async function FetchRemoteConfigAsync(): Promise<boolean> {
    if (IsLog)
        console.log('[FetchRemoteConfigAsync] fetching...')

    // // already fetched

    // if (remoteConfig) {
    //     if (IsLog)
    //         console.log('[FetchRemoteConfigAsync] success (already fetched)')

    //     return true
    // }

    // start fetch

    const res = await ExecuteWithTimeoutAsync(
        async () => await FirebaseDatabase_GetValueAsync(FirebaseDBPath),
        FirebaseDatabaseTimeOutMs
    )

    fetchedCount++

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

/**
 * it can take a while (5s) if the config currently not available.
 * 
 * param priority: `forceFetchAndHandleAlerts` > `notFetchFrom2ndTime`
 * 
 * ##### NOTE: if fetch failed it can even return NOT `undefined` when remoteConfig fetched success before
 */
export async function GetRemoteConfigWithCheckFetchAsync(
    notFetchFrom2ndTime = true,
    forceFetchAndHandleAlerts = false
): Promise<RemoteConfig | undefined> {
    // check

    if (!forceFetchAndHandleAlerts) { // no force
        if (remoteConfig || // already fetched
            (notFetchFrom2ndTime === true && fetchedCount >= 1) // not fetch from 2nd times
        ) {
            return remoteConfig
        }
    }

    // fetch

    const success = await FetchRemoteConfigAsync()

    // handle alerts

    if (success) {
        lastTimeFetchedSuccess = Date.now()

        if (forceFetchAndHandleAlerts) {
            lastTimeFetchedSuccessAndHandledAlerts = Date.now()

            // alert update
            await HandleAlertUpdateAppAsync(remoteConfig) // alert_priority_1 (doc)

        } // REMEMER `SetShowedAlertStartupOnSplashScreen` TO EVERY SHOWING ALERT
    }

    // return

    return remoteConfig
}

/**
 * 
 * @returns version or NaN if fail to get config
 */
export function GetRemoteFileConfigVersion(file: string): number {
    if (!remoteConfig || !remoteConfig.remoteFiles)
        return Number.NaN

    // @ts-ignore
    const version = remoteConfig.remoteFiles[file]

    if (typeof version === 'number')
        return version as number
    else
        return Number.NaN
}

export const GetAlternativeConfig = <T>(property: string, defaultValue: T): T => {
    const config = remoteConfig

    if (!config || !config.alternativeValue)
        return defaultValue

    return SafeValue(config.alternativeValue[property], defaultValue)
}

/**
 * 
 * @returns in ms
 */
export const GetLastTimeFetchedRemoteConfigSuccessAndHandledAlerts = () => lastTimeFetchedSuccessAndHandledAlerts

/**
 * 
 * @returns true if hour diff from last loaded config less than (<) **HowLongToReloadRemoteConfigInHour**
 */
export const IsRemoteConfigLoadedRecently = () => {
    const hourDiff = DateDiff_InHour_WithNow(lastTimeFetchedSuccess)

    if (IsLog)
        console.log('[IsRemoteConfigLoadedRecently] ?', hourDiff < HowLongToReloadRemoteConfigInHour)

    return hourDiff < HowLongToReloadRemoteConfigInHour
}

/**
 * ### note: alert if loaded has alert udpate,... and do alert loaded failed
 * @returns true if config ••available** and minute diff from last config less than (<) **1 minute**
 */
export const CheckForceFetchRemoteConfigWithAlertIfFailedAsync = async (texts: LocalText): Promise<boolean> => {
    let minDiff = DateDiff_InMinute_WithNow(lastTimeFetchedSuccessAndHandledAlerts)
    let isLastest = remoteConfig !== undefined && minDiff < 1

    if (isLastest) {
        if (IsLog)
            console.log('[ForceFetchWithAlertIfFailedAsync] isLastest?', isLastest)

        return true
    }

    await GetRemoteConfigWithCheckFetchAsync(false, true)

    minDiff = DateDiff_InMinute_WithNow(lastTimeFetchedSuccessAndHandledAlerts)
    isLastest = remoteConfig !== undefined && minDiff < 1

    if (IsLog)
        console.log('[ForceFetchWithAlertIfFailedAsync] isLastest?', isLastest)

    if (!isLastest) {
        await AlertAsync(texts.popup_error, NotLatestConfig)
    }

    return isLastest
}