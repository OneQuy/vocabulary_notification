
// NUMBER [CHANGE HERE]: 1
//
// Install:
// npm i -s @aptabase/react-native posthog-react-native @react-native-async-storage/async-storage react-native-device-info
//
// Usage:
// InitAptabase()
//
// Note:
// Must after: IsDev, GetRemoteConfigWithCheckFetchAsync


import { Alert } from "react-native"
import Aptabase, { trackEvent } from "@aptabase/react-native";
import { IsDev } from "./IsDev";
import { GetRemoteConfigWithCheckFetchAsync } from "./RemoteConfig";
import { ApatabaseKey_Dev, ApatabaseKey_Production } from "../../Keys"; // CHANGE HERE 1
import { IsValuableArrayOrString, SafeValue, ToCanPrint } from "./UtilsTS";

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

// const aptabaseIgnoredEventNamesDefault: string[] = [
// ] as const

// const IsLog = true

// var initedAptabase = false
// var finalAptabaseIgnoredEventNames: string[] | undefined = undefined

// const prefixFbTrackPath = () => IsDev() ? 'tracking/dev/' : 'tracking/production/'

// /**
//  * please call after GetRemoteConfigWithCheckFetchAsync(), IsDev()
//  */
// export const InitAptabaseAsync = async () => {
//     if (initedAptabase)
//         return

//     initedAptabase = true

//     const appConfig = await GetRemoteConfigWithCheckFetchAsync()

//     const productionKey = SafeValue(appConfig?.tracking?.aptabaseProductionKey, ApatabaseKey_Production)

//     Aptabase.init(IsDev() ? ApatabaseKey_Dev : productionKey)
// }

// export const GetFinalAptabaseIgnoredEventNames = () => {
//     if (finalAptabaseIgnoredEventNames)
//         return finalAptabaseIgnoredEventNames

//     const appConfig = GetAppConfig()

//     if (!appConfig)
//         return aptabaseIgnoredEventNamesDefault

//     let finalArr: string[]

//     const additions = appConfig.tracking.aptabaseIgnores

//     if (!IsValuableArrayOrString(additions))
//         finalArr = aptabaseIgnoredEventNamesDefault
//     else {
//         const arr = additions?.split(',')

//         if (!IsValuableArrayOrString(arr) || !arr)
//             finalArr = aptabaseIgnoredEventNamesDefault
//         else
//             finalArr = arr.concat(aptabaseIgnoredEventNamesDefault)
//     }

//     const removeIgnoredListText = appConfig.tracking.aptabaseRemoveIgnores

//     const removeIgnoredList = removeIgnoredListText?.split(',')

//     if (!IsValuableArrayOrString(removeIgnoredList) || !removeIgnoredList)
//         finalAptabaseIgnoredEventNames = finalArr
//     else
//         finalAptabaseIgnoredEventNames = finalArr.filter(i => !removeIgnoredList.includes(i))

//     return finalAptabaseIgnoredEventNames
// }

// export const TrackErrorOnFirebase = (error: string, subpath?: string) => {
//     const path = prefixFbTrackPath() + 'errors/' + (subpath ? (subpath + '/') : '') + Date.now()
//     FirebaseDatabase_SetValueAsync(path, error)
//     console.log('track error firebase: ', path, ', ' + error);
// }

// export const MainTrack = (
//     eventName: string,
//     fbPaths: (string | undefined)[],
//     trackingValuesObject?: Record<string, string | number | boolean>) => {
//     const appConfig = GetAppConfig()

//     const shouldTrackAptabase = initedAptabase &&
//         (!__DEV__ || NetLord.IsAvailableLatestCheck()) &&
//         (!appConfig || appConfig.tracking.enableAptabase) &&
//         (!GetFinalAptabaseIgnoredEventNames().includes(eventName))

//     const shouldTrackFirebase = !appConfig || appConfig.tracking.enableFirebase
//     const shouldTrackTelemetry = !appConfig || appConfig.tracking.enableTelemetry

//     // console.log(shouldTrackAptabase, shouldTrackFirebase, shouldTrackTelemetry);

//     if (IsDev())
//         eventName = 'dev__' + eventName

//     if (IsLog)
//         console.log('------------------------')

//     // track aptabase

//     if (shouldTrackAptabase) {
//         trackEvent(eventName, trackingValuesObject)

//         if (IsLog) {
//             console.log('tracking aptabase: ', eventName, JSON.stringify(trackingValuesObject));
//         }
//     }

//     // track firebase

//     if (shouldTrackFirebase) {
//         for (let i = 0; i < fbPaths.length; i++) {
//             let path = prefixFbTrackPath() + fbPaths[i]
//             path = path.replaceAll('#d', todayString)

//             if (IsLog) {
//                 console.log('tracking on firebase: ', path);
//             }

//             FirebaseDatabase_IncreaseNumberAsync(path, 0)
//         }
//     }

//     // track telemetry

//     if (signal && shouldTrackTelemetry) {
//         signal(eventName, trackingValuesObject)

//         if (IsLog) {
//             console.log('tracking telemetry: ', eventName, JSON.stringify(trackingValuesObject))
//         }
//     }

//     if (IsLog)
//         console.log('****************')
// }