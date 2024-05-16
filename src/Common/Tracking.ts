
// NUMBER [CHANGE HERE]: 1
//
// Install:
// npm i -s @aptabase/react-native posthog-react-native @react-native-async-storage/async-storage react-native-device-info
//
// Usage:
// InitAptabase() (Must after: IsDev, GetRemoteConfigWithCheckFetchAsync)

import { Alert } from "react-native"
import Aptabase, { trackEvent } from "@aptabase/react-native";
import { IsDev } from "./IsDev";
import { GetRemoteConfigWithCheckFetchAsync } from "./RemoteConfig";
import { ApatabaseKey_Dev, ApatabaseKey_Production } from "../../Keys"; // CHANGE HERE 1
import { IsValuableArrayOrString, SafeValue, ToCanPrint } from "./UtilsTS";
import { TodayStringUnderscore } from "./CommonConstants";
import { FirebaseDatabase_IncreaseNumberAsync } from "./Firebase/FirebaseDatabase";

export const startFreshlyOpenAppTick = Date.now()

const IsLog = true

const AptabaseIgnoredEventNamesDefault: string[] = [
] as const

/**
 * HandleError(resOrError, 'DataToNotification', false)
 */
export const HandleError = (error: any, root: string, alert = true) => {
    // todo
    // tracking

    if (true) { // filter content check if need to check

    }

    // alert

    if (alert) {
        const msg = SafeValue(error?.message, '' + ToCanPrint(error))

        Alert.alert(
            'Oooooops',
            msg)
    }
    else if (__DEV__) {
        const content = `[${root}] ${ToCanPrint(error)}`
        console.error(content);
    }
}

// export const TrackErrorOnFirebase = (error: string, subpath?: string) => {
//     const path = prefixFbTrackPath() + 'errors/' + (subpath ? (subpath + '/') : '') + Date.now()
//     FirebaseDatabase_SetValueAsync(path, error)
//     console.log('track error firebase: ', path, ', ' + error);
// }

var initedAptabase = false
var cachedFinalAptabaseIgnoredEventNames: string[] | undefined = undefined

const GetPrefixFbTrackPath = () => IsDev() ? 'tracking/dev/' : 'tracking/production/'

/**
 * please call after GetRemoteConfigWithCheckFetchAsync(), IsDev()
 */
export const InitAptabaseAsync = async () => {
    if (initedAptabase)
        return

    initedAptabase = true

    const appConfig = await GetRemoteConfigWithCheckFetchAsync()

    const productionKey = SafeValue(appConfig?.tracking?.aptabaseProductionKey, ApatabaseKey_Production)

    Aptabase.init(IsDev() ? ApatabaseKey_Dev : productionKey)
}

const GetFinalAptabaseIgnoredEventNamesAsync = async (): Promise<string[]> => {
    if (cachedFinalAptabaseIgnoredEventNames)
        return cachedFinalAptabaseIgnoredEventNames

    const appConfig = await GetRemoteConfigWithCheckFetchAsync()

    if (!appConfig)
        return AptabaseIgnoredEventNamesDefault

    let finalArr: string[]

    const additions = appConfig.tracking?.aptabaseIgnores

    if (!IsValuableArrayOrString(additions))
        finalArr = AptabaseIgnoredEventNamesDefault
    else {
        const arr = additions?.split(',')

        if (!IsValuableArrayOrString(arr) || !arr)
            finalArr = AptabaseIgnoredEventNamesDefault
        else
            finalArr = arr.concat(AptabaseIgnoredEventNamesDefault)
    }

    const removeIgnoredListText = appConfig.tracking?.aptabaseRemoveIgnores

    const removeIgnoredList = removeIgnoredListText?.split(',')

    if (!IsValuableArrayOrString(removeIgnoredList) || !removeIgnoredList)
        cachedFinalAptabaseIgnoredEventNames = finalArr
    else
        cachedFinalAptabaseIgnoredEventNames = finalArr.filter(i => !removeIgnoredList.includes(i))

    return cachedFinalAptabaseIgnoredEventNames
}

export const TrackingAsync = async (
    eventName: string,
    firebasePaths: string[],

    /**
     * aptabase, posthog,... (not firebase)
     */
    trackingValuesObject?: Record<string, string | number | boolean>
): Promise<void> => {
    const appConfig = await GetRemoteConfigWithCheckFetchAsync()

    if (IsDev())
        eventName = 'dev__' + eventName

    if (IsLog)
        console.log('------------------------')


    // track aptabase

    const finalAptabaseIgnoredEventNames = await GetFinalAptabaseIgnoredEventNamesAsync()

    const shouldTrackAptabase = initedAptabase &&
        // (!__DEV__ || NetLord.IsAvailableLatestCheck()) &&
        (!appConfig || !appConfig.tracking || appConfig.tracking.enableAptabase !== false) &&
        (!finalAptabaseIgnoredEventNames.includes(eventName))

    if (shouldTrackAptabase) {
        trackEvent(eventName, trackingValuesObject)

        if (IsLog) {
            console.log('tracking [APTABASE]: ', eventName, JSON.stringify(trackingValuesObject));
        }
    }


    // track firebase

    const shouldTrackFirebase = !appConfig || !appConfig.tracking || appConfig.tracking.enableFirebase !== false

    if (shouldTrackFirebase) {
        for (let i = 0; i < firebasePaths.length; i++) {
            let path = GetPrefixFbTrackPath() + firebasePaths[i]
            path = path.replaceAll('#d', TodayStringUnderscore)

            if (IsLog) {
                console.log('tracking [FIREBASE]: ', path);
            }

            FirebaseDatabase_IncreaseNumberAsync(path, 0)
        }
    }


    // track telemetry

    // const shouldTrackTelemetry = !appConfig || appConfig.tracking.enableTelemetry
    // if (signal && shouldTrackTelemetry) {
    //     signal(eventName, trackingValuesObject)

    //     if (IsLog) {
    //         console.log('tracking telemetry: ', eventName, JSON.stringify(trackingValuesObject))
    //     }
    // }

    if (IsLog)
        console.log('****************')
}