// NUMBER [CHANGE HERE]: 0
//
// Created May 2024 (coding Vocaby)
//
// Install:
// npm i -s @aptabase/react-native posthog-react-native @react-native-async-storage/async-storage react-native-device-info
//
// Usage & Note:
// 1. InitTrackingAsync() (Must after: IsDev, GetRemoteConfigWithCheckFetchAsync)
// 2. Only should start tracking everything after initing
//
//
// Doc for Posthog: https://posthog.com/docs/libraries/react-native#without-the-posthogprovider
// 
// How it works?
// [Aptabase]
//      + IsDev === false => prodution mode
//      + IsDev === true:
//          * __DEV__ === true => production mode            
//          * __DEV__ === false => dev mode            

import { Alert, Platform } from "react-native"
import Aptabase, { trackEvent as AptabaseTrack } from "@aptabase/react-native";
import { IsDev } from "./IsDev";
import { GetRemoteConfigWithCheckFetchAsync } from "./RemoteConfig";
import { ApatabaseKey_Dev, ApatabaseKey_Production } from "../../Keys"
import { DateDiff_WithNow, DayName, FilterOnlyLetterAndNumberFromString, FromMsTo_TodayDays, GetDayHourMinSecFromMs_ToString, GetTodayStringUnderscore, IsValuableArrayOrString, RemoveEmptyAndFalsyFromObject, SafeValue, ToCanPrint } from "./UtilsTS";
import { FirebaseDatabase_IncreaseNumberAsync, FirebaseDatabase_SetValueAsync } from "./Firebase/FirebaseDatabase";
import PostHog from "posthog-react-native";
import { GetAndSetInstalledDaysCountAsync, GetAndSetLastFreshlyOpenAppToNowAsync, GetAndSetLastInstalledVersionAsync, GetAndClearPressUpdateObjectAsync, SetupAppStateAndStartTrackingParams } from "./AppStatePersistence";
import { UserID } from "./UserID";
import { VersionAsNumber } from "./CommonConstants";
import { GetSplashTime } from "./Components/SplashScreen";
import { AppStreakId, SetStreakAsync } from "./Streak";

const IsLog = __DEV__

const FirebaseTrackingProductionPath = 'tracking/production/'

const AptabaseIgnoredEventNamesDefault: string[] = [
] as const

var inited = false
var posthog: PostHog | undefined = undefined
var cachedFinalAptabaseIgnoredEventNames: string[] | undefined = undefined
var cachedFinalFirebaseIgnores: string[] | undefined = undefined

/**
 * must be called after IsDev()
 */
const GetPrefixFbTrackPath = () => IsDev() ? 'tracking/dev/' : FirebaseTrackingProductionPath

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
 * 
 * @returns undefined will not track
 */
const GetFinalFirebaseIgnoresAsync = async (): Promise<string[] | undefined> => {
    if (cachedFinalFirebaseIgnores)
        return cachedFinalFirebaseIgnores

    const appConfig = await GetRemoteConfigWithCheckFetchAsync()

    if (!appConfig)
        return undefined

    let finalArr: string[]

    const additions = appConfig.tracking?.firebaseRootOrErrorIgnores

    if (!IsValuableArrayOrString(additions))
        finalArr = []
    else {
        const arr = additions?.split(',')

        if (!IsValuableArrayOrString(arr) || !arr)
            finalArr = []
        else
            finalArr = arr
    }

    cachedFinalFirebaseIgnores = finalArr

    return cachedFinalFirebaseIgnores
}

const CheckAndTrackErrorOnFirebaseAsync = async (error: string, root: string, subpath?: string): Promise<void> => {
    if (!error || !root)
        return

    const ignores = await GetFinalFirebaseIgnoresAsync()

    if (ignores === undefined)
        return

    const found = ignores.find(ignoreText => root.includes(ignoreText) || error.includes(ignoreText))

    if (found)
        return

    const path = `${FirebaseTrackingProductionPath}errors/${root}/${subpath ? (subpath + '/') : ''}${Date.now()}`
    FirebaseDatabase_SetValueAsync(path, error)
}

/**
 * set instance for Posthog & init Aptabase
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

export const TrackingAsync = async ( // main 
    eventName: string,
    firebasePaths: string[],

    /**
     * aptabase, posthog,... (not firebase)
     */
    trackingValuesObject?: Record<string, string | number | boolean>
): Promise<void> => {
    if (!inited) {
        console.error('[TrackingAsync] not initted yet.');
        return
    }

    const appConfig = await GetRemoteConfigWithCheckFetchAsync()

    if (IsDev())
        eventName = 'dev__' + eventName

    if (IsLog)
        console.log('------------------------')


    // track aptabase

    const finalAptabaseIgnoredEventNames = await GetFinalAptabaseIgnoredEventNamesAsync()

    const shouldTrackAptabase =
        (!appConfig || !appConfig.tracking || appConfig.tracking.enableAptabase !== false) &&
        (!finalAptabaseIgnoredEventNames.includes(eventName))

    // console.log(shouldTrackAptabase, inited, finalAptabaseIgnoredEventNames);

    if (shouldTrackAptabase) {
        AptabaseTrack(eventName, trackingValuesObject)

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

export const TrackSimple = (event: string) => { // sub 
    TrackingAsync(event,
        [
            `total/${event}`,
        ]
    )
}

export const TrackSimpleWithParam = (event: string, value: string) => { // sub 
    TrackingAsync(event,
        [
            `total/${event}/` + value,
        ],
        {
            value,
        }
    )
}

export const TrackOneQuyApps = (eventOneQuyApp: string, currentAppName: string) => {
    const event = 'onequy_apps'

    const firebaseArr = [
        `total/${event}/` + eventOneQuyApp,
    ]

    if (IsValuableArrayOrString(currentAppName))
        firebaseArr.push(`total/${event}/${eventOneQuyApp}/${FilterOnlyLetterAndNumberFromString(currentAppName)}`)

    TrackingAsync(event,
        firebaseArr,
        RemoveEmptyAndFalsyFromObject(
            {
                eventOneQuyApp,
                currentAppName,
            }
        )
    )
}

export const TrackOpenOfDayCount = (count: number) => {
    const event = 'open_of_day_count'

    TrackingAsync(event,
        [
            `total/${event}/${count}_times`,
        ],
        {
            count
        }
    )
}

/**
 * only called once (when freshly open app)
 * 
 * this track: freshly_open_app, last_freshly_open, updated_app
 * 
 * after call this, should call next: CheckAndShowAlertWhatsNewAsync
 * 
 * @returns lastInstalledVersion (number or NaN) to show What's new
 */
export const TrackOnUseEffectOnceEnterAppAsync = async (): Promise<number> => {
    ///////////////////
    // freshly_open_app
    ///////////////////

    const [
        installedDaysCount,
        streakHandle
    ] = await Promise.all([
        GetAndSetInstalledDaysCountAsync(),
        SetStreakAsync(AppStreakId)
    ])

    let event = 'freshly_open_app'

    await TrackingAsync(event,
        [
            `total/${event}`,
        ],
        { // only track numbers, should NOT put string values here.
            splashTime: GetSplashTime(),
            currentStreak: streakHandle.todayStreak.currentStreak,
            bestStreak: streakHandle.todayStreak.bestStreak,
            installedDaysCount,
        } as Record<string, number>
    )

    ///////////////////
    // last_freshly_open
    ///////////////////

    const [
        lastFreshlyOpenAppToNow,
    ] = await Promise.all([
        GetAndSetLastFreshlyOpenAppToNowAsync(),
    ])

    await TrackingAsync('last_freshly_open',
        [],
        { // put string values here
            lastFreshlyOpen: lastFreshlyOpenAppToNow,
            userId: UserID(),
        } as Record<string, string>
    )

    ///////////////////
    // updated_app
    ///////////////////

    const lastInstalledVersion = await GetAndSetLastInstalledVersionAsync()

    let didUpdated = false

    if (!Number.isNaN(lastInstalledVersion) && lastInstalledVersion !== VersionAsNumber) { // just updated
        didUpdated = true
        event = 'updated_app'

        const objLastAlertText = await GetAndClearPressUpdateObjectAsync()
        let lastAlert = 'no_data'
        let obj

        if (objLastAlertText) {
            obj = JSON.parse(objLastAlertText)

            if (obj && typeof obj.last_alert_tick === 'number')
                lastAlert = GetDayHourMinSecFromMs_ToString(Date.now() - obj.last_alert_tick)
        }

        await TrackingAsync(event,
            [
                `total/${event}`,
            ],
            {
                from: 'v' + lastInstalledVersion,
                lastAlert,
                ...obj,
            }
        )

        TrackSimpleWithParam('version', 'v' + VersionAsNumber)
    }

    return didUpdated ? lastInstalledVersion : NaN
}

/**
 * only called once (when install app)
 * this track: newly_install, version, platform
 */
export const TrackOnNewlyInstallAsync = async () => {
    //////////////////////
    // newly_install
    //////////////////////

    const event = 'newly_install'

    await TrackingAsync(event,
        [
            `total/${event}`,
            `date/${event}/#d`,
        ],
        {
            userID: UserID(),
        })

    //////////////////////
    // version
    //////////////////////

    TrackSimpleWithParam('version', 'v' + VersionAsNumber)

    //////////////////////
    // platform
    //////////////////////

    TrackSimpleWithParam('platform', Platform.OS.toString())
}

/**
 * tracks: open_app, open_app_num
 * 
 * used to count open app times
 * 
 * will be called at 2 cases:
 * 1. whenever freshly open app
 * 2. onAppActive (but at least `HowLongInMinutesToCount2TimesUseAppSeparately` after the last call this method)
 */
export const TrackOnActiveOrUseEffectOnceWithGapAsync = async (
    totalOpenApp: number,
    openTodaySoFar: number,
    distanceFromLastFireOnActiveOrOnceUseEffectWithGapInMs: number,
    setupParams: SetupAppStateAndStartTrackingParams
) => {
    /////////////////////
    // open_app (only strings)
    /////////////////////

    const event = 'open_app'

    await TrackingAsync(event,
        [],
        {
            userId: UserID(),
            lastOpenCached: distanceFromLastFireOnActiveOrOnceUseEffectWithGapInMs <= 0 ? '0s' : GetDayHourMinSecFromMs_ToString(distanceFromLastFireOnActiveOrOnceUseEffectWithGapInMs),
            purchased: setupParams.subscribedData?.id ?? 'lol',
            purchasedDays: setupParams.subscribedData ? DateDiff_WithNow(setupParams.subscribedData.purchasedTick).toFixed(1) : 'hmmm',
        } as Record<string, string>
    )

    // /////////////////////
    // open_app_num
    // /////////////////////

    const event2 = 'open_app_num'

    await TrackingAsync(event2,
        [],
        {
            totalOpenApp,
            openTodaySoFar,
            lastOpenCached: FromMsTo_TodayDays(distanceFromLastFireOnActiveOrOnceUseEffectWithGapInMs),
        } as Record<string, number>
    )
}

/**
 * tracks: food_old_user, food_old_user_num
 */
export const TrackFirstOpenOfDayOldUserAsync = async () => {
    /////////////////////
    // food_old_user (only strings)
    /////////////////////

    const event = 'food_old_user'
    const dayName = DayName(undefined, true)

    await TrackingAsync(event,
        [
            `total/open_week/${dayName}`,
        ],
        {
            userId: UserID(),
            dayName,
        } as Record<string, string>
    )

    /////////////////////
    // food_old_user_num
    /////////////////////

    const event2 = 'food_old_user_num'

    const [
        installedDaysCount,
        streakHandle,
    ] = await Promise.all([
        GetAndSetInstalledDaysCountAsync(),
        SetStreakAsync(AppStreakId)
    ])

    await TrackingAsync(event2,
        [
            `total/best_streak/${streakHandle.todayStreak.bestStreak}_day`,
        ],
        {
            installedDaysCount,
            currentStreak: streakHandle.todayStreak.currentStreak,
            bestStreak: streakHandle.todayStreak.bestStreak,
        } as Record<string, number>
    )
}

/**
 * CAN USE ANYWHERE
 * 
 * Usage: HandleError(resOrError, 'DataToNotification', false)
 */
export const HandleError = (error: any, root: string, alert = true) => {
    const sError = SafeValue(error?.message, '' + ToCanPrint(error))

    // tracking firebase

    CheckAndTrackErrorOnFirebaseAsync(sError, root)

    // alert

    if (alert) {
        Alert.alert(
            'Error',
            sError
        )
    }
    else if (__DEV__) {
        const content = `[${root}] ${sError}`
        console.error(content);
    }
}