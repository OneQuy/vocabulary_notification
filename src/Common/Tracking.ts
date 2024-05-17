
// NUMBER [CHANGE HERE]: 0
//
// Install:
// npm i -s @aptabase/react-native posthog-react-native @react-native-async-storage/async-storage react-native-device-info
//
// Usage:
// 1. InitTrackingAsync() (Must after: IsDev, GetRemoteConfigWithCheckFetchAsync)
// 2. Only should start tracking everything after init.
// 
// Doc for Posthog: https://posthog.com/docs/libraries/react-native#without-the-posthogprovider
// 
// How it works:
// [Aptabase]
//      + IsDev === false => prodution mode
//      + IsDev === true:
//          * __DEV__ === true => production mode            
//          * __DEV__ === false => dev mode            

import { Alert } from "react-native"
import Aptabase, { trackEvent } from "@aptabase/react-native";
import { IsDev } from "./IsDev";
import { GetRemoteConfigWithCheckFetchAsync } from "./RemoteConfig";
import { ApatabaseKey_Dev, ApatabaseKey_Production } from "../../Keys"
import { GetTodayStringUnderscore, IsValuableArrayOrString, SafeValue, ToCanPrint } from "./UtilsTS";
import { FirebaseDatabase_IncreaseNumberAsync } from "./Firebase/FirebaseDatabase";
import PostHog from "posthog-react-native";

const IsLog = true

const AptabaseIgnoredEventNamesDefault: string[] = [
] as const

var posthog: PostHog | undefined = undefined

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

var inited = false
var cachedFinalAptabaseIgnoredEventNames: string[] | undefined = undefined

const GetPrefixFbTrackPath = () => IsDev() ? 'tracking/dev/' : 'tracking/production/'

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

/**
 * must be called after
 * 
 *      + GetRemoteConfigWithCheckFetchAsync()
 *      + IsDev()
 */
export const InitTrackingAsync = async (instancePosthog: PostHog) => {
    if (inited)
        return

    inited = true

    if (IsLog)
        console.log('[InitTrackingAsync] initting...');

    // post hog

    posthog = instancePosthog

    // aptabase

    const appConfig = await GetRemoteConfigWithCheckFetchAsync()

    const productionKey = SafeValue(appConfig?.tracking?.aptabaseProductionKey, ApatabaseKey_Production)

    Aptabase.init(
        (IsDev() && !__DEV__) ? // mobile (release) dev
            ApatabaseKey_Dev : // dev
            productionKey // prodution
    )
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

    const shouldTrackAptabase = inited &&
        // (!__DEV__ || NetLord.IsAvailableLatestCheck()) &&
        (!appConfig || !appConfig.tracking || appConfig.tracking.enableAptabase !== false) &&
        (!finalAptabaseIgnoredEventNames.includes(eventName))

    console.log(shouldTrackAptabase, inited, finalAptabaseIgnoredEventNames);

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
            path = path.replaceAll('#d', GetTodayStringUnderscore())

            if (IsLog) {
                console.log('tracking [FIREBASE]: ', path);
            }

            FirebaseDatabase_IncreaseNumberAsync(path, 0)
        }
    }


    // track posthog

    const shouldTrackPosthog =
        !appConfig ||
        !appConfig.tracking ||
        appConfig.tracking.enablePosthog !== false

    if (shouldTrackPosthog && posthog) {
        posthog.capture(eventName, trackingValuesObject)

        if (IsLog) {
            console.log('tracking [POSTHOG]: ', eventName, JSON.stringify(trackingValuesObject))
        }
    }

    if (IsLog)
        console.log('****************')
}