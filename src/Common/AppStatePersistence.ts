// Created May 2024 (coding Vocaby)
//
// USAGE:
// 1. Simply just need to call this in the first appear screen: SetupAppStateAndStartTrackingAsync(...)


import AsyncStorage from "@react-native-async-storage/async-storage"
import { GetBooleanAsync, GetDateAsync, GetDateAsync_IsValueExistedAndIsToday, GetNumberIntAsync, GetPairNumberIntAndDateAsync, IncreaseNumberAsync, SetBooleanAsync, SetDateAsync_Now, SetNumberAsync, SetPairNumberIntAndDateAsync_Now } from "./AsyncStorageUtils"
import { VersionAsNumber } from "./CommonConstants"
import { StorageKey_FirstTimeInstallTick, StorageKey_LastCheckFirstOpenOfTheDay, StorageKey_LastFreshlyOpenApp, StorageKey_LastInstalledVersion, StorageKey_OpenAppOfDayCount, StorageKey_OpenAppOfDayCountForDate, StorageKey_OpenAppTotalCount, StorageKey_OpenAt, StorageKey_PressUpdateObject, StorageKey_TrackedNewlyInstall } from "../App/Constants/StorageKey"
import PostHog from "posthog-react-native"
import { InitTrackingAsync, TrackFirstOpenOfDayOldUserAsync, TrackOnNewlyInstallAsync, TrackOnUseEffectOnceEnterAppAsync, TrackOpenOfDayCount, TrackSimpleWithParam } from "./Tracking"
import { DateDiff_InHour_WithNow, DateDiff_WithNow, GetDayHourMinSecFromMs_ToString, IsToday, IsValuableArrayOrString } from "./UtilsTS"
import { ClearUserForcePremiumDataAsync, GetUserForcePremiumDataAsync } from "./UserMan"
import { SubscribedData } from "./SpecificType"
import { UserID } from "./UserID"
import { AppStateStatus } from "react-native"
import { RegisterOnChangedState } from "./AppStateMan"
import { GetLastTimeFetchedSuccessAndHandledAlerts, GetRemoteConfigWithCheckFetchAsync } from "./RemoteConfig"

type SetupAppStateAndStartTrackingParams = {
    posthog: PostHog,
    subscribedData: SubscribedData | undefined,
    forceSetPremiumAsync: (setOrReset: SubscribedData | undefined) => Promise<void>,
}

const HowLongInMinutesToCount2TimesUseAppSeparately = 60 // minute
const HowLongToReloadRemoteConfigInHour = 6 // hour

var inited = false
var isHandling_CheckAndTriggerFirstOpenAppOfTheDayAsync = false
var lastFireOnActiveOrOnceUseEffectWithCheckDuplicate = 0
var isNewlyInstallFirstOpenOrAcitveState = false
var setupParamsInternal: SetupAppStateAndStartTrackingParams | undefined = undefined

export const IsNewlyInstallFirstOpenOrAcitveState = () => isNewlyInstallFirstOpenOrAcitveState


/**
 * MAIN
 * freshly open app (can multiple times per day, but once per app open)
 */
export const SetupAppStateAndStartTrackingAsync = async (setupParams: SetupAppStateAndStartTrackingParams): Promise<void> => {
    if (inited)
        return

    inited = true
    setupParamsInternal = setupParams

    RegisterOnChangedState(OnStateChanged)

    await InitTrackingAsync(setupParams.posthog)

    await OnUseEffectOnceEnterAppAsync(setupParams)
}

/**
 * freshly open app (can multiple times per day, but once per app open)
 */
export const OnUseEffectOnceEnterAppAsync = async (setupParams: SetupAppStateAndStartTrackingParams) => {
    await TrackOnUseEffectOnceEnterAppAsync()

    await CheckFirstOpenAppOfTheDayAsync(setupParams)

    await OnActiveOrOnceUseEffectAsync()
}


/**
 * first open of the day
 * (on first freshly open app or first active of the day)
 */
export const CheckFirstOpenAppOfTheDayAsync = async (setupParams: SetupAppStateAndStartTrackingParams) => {
    if (isHandling_CheckAndTriggerFirstOpenAppOfTheDayAsync) {
        return
    }

    isHandling_CheckAndTriggerFirstOpenAppOfTheDayAsync = true

    const checkedToday = await GetDateAsync_IsValueExistedAndIsToday(StorageKey_LastCheckFirstOpenOfTheDay)

    if (checkedToday) {
        isHandling_CheckAndTriggerFirstOpenAppOfTheDayAsync = false
        return
    }

    await SetDateAsync_Now(StorageKey_LastCheckFirstOpenOfTheDay)
    isHandling_CheckAndTriggerFirstOpenAppOfTheDayAsync = false

    //////////////////////////////////////
    // HANDLES HERE: FIRST OPEN OF THE DAY 
    //////////////////////////////////////

    // newly_install

    if (await GetBooleanAsync(StorageKey_TrackedNewlyInstall, false)) {
        SetBooleanAsync(StorageKey_TrackedNewlyInstall, true)
        isNewlyInstallFirstOpenOrAcitveState = true
        await TrackOnNewlyInstallAsync()
    }

    // old_user

    else {
        await TrackFirstOpenOfDayOldUserAsync()

        // CheckForcePremiumDataAsync

        CheckForcePremiumDataAsync(setupParams)
    }

}

export const GetAndClearPressUpdateObjectAsync = async (): Promise<string | null> => {
    const objLastAlertText = await AsyncStorage.getItem(StorageKey_PressUpdateObject)

    if (objLastAlertText)
        AsyncStorage.removeItem(StorageKey_PressUpdateObject)

    return objLastAlertText
}

/**
 * 
 * @return number or NaN
 */
export const GetAndSetLastInstalledVersionAsync = async (): Promise<number> => {
    const lastInstalledVersion = await GetNumberIntAsync(StorageKey_LastInstalledVersion)
    SetNumberAsync(StorageKey_LastInstalledVersion, VersionAsNumber)

    return lastInstalledVersion
}

export const GetAndSetLastFreshlyOpenAppToNowAsync = async (): Promise<string> => {
    const lastFreshlyOpenAppTick = await GetDateAsync(StorageKey_LastFreshlyOpenApp)
    SetDateAsync_Now(StorageKey_LastFreshlyOpenApp)

    let lastFreshlyOpenAppToNowMs = 0

    if (lastFreshlyOpenAppTick !== undefined) {
        lastFreshlyOpenAppToNowMs = Date.now() - lastFreshlyOpenAppTick.getTime()
    }

    let lastFreshlyOpenAppToNowText = GetDayHourMinSecFromMs_ToString(lastFreshlyOpenAppToNowMs)

    if (!IsValuableArrayOrString(lastFreshlyOpenAppToNowText))
        lastFreshlyOpenAppToNowText = 'no_data'

    return lastFreshlyOpenAppToNowText
}

export const GetAndSetInstalledDaysCountAsync = async () => {
    const installedDate = await GetDateAsync(StorageKey_FirstTimeInstallTick)

    if (installedDate !== undefined)
        return Math.floor(DateDiff_WithNow(installedDate))
    else {
        SetDateAsync_Now(StorageKey_FirstTimeInstallTick)
        return 0
    }
}

export const GetOpenAppCountTodaySoFarCountAsync = async () => {
    return await GetNumberIntAsync(StorageKey_OpenAppOfDayCount, 0)
}

export const GetTotalOpenAppCountAsync = async () => {
    return await GetNumberIntAsync(StorageKey_OpenAppTotalCount, 0)
}

const CheckForcePremiumDataAsync = async (setupParams: SetupAppStateAndStartTrackingParams) => {
    const data = await GetUserForcePremiumDataAsync()

    console.log('[CheckForcePremiumDataAsync] data', data);

    if (!data)
        return

    await ClearUserForcePremiumDataAsync()

    // reset

    if (data.id === 'reset') {
        await setupParams.forceSetPremiumAsync(undefined)
        TrackSimpleWithParam('forced_premium_reset', UserID())
    }

    // force set

    else {
        await setupParams.forceSetPremiumAsync(data)
        TrackSimpleWithParam('forced_premium_set', UserID() + '__' + data.id + '__' + data.purchasedTick)

        // Alert.alert('Wohoo!', 'You granted: ' + data.id + '. Really thanks for your support!')
    }
}

const OnStateChanged = (state: AppStateStatus) => {
    if (state === 'active') {
        if (setupParamsInternal) {
            OnActiveAsync(setupParamsInternal)
        }
    }
    else if (state === 'background') {
        OnBackgroundAsync()
    }
}

/** reload (app remote config + alerts) if app re-active after a period `HowLongToReloadRemoteConfigInHour` */
const CheckReloadRemoteConfigAsync = async () => {
    ////////////////////////
    // CHECK
    ////////////////////////

    const loadedConfigLastTimeInHour = DateDiff_InHour_WithNow(GetLastTimeFetchedSuccessAndHandledAlerts())

    if (loadedConfigLastTimeInHour < HowLongToReloadRemoteConfigInHour) {
        console.log('[CheckReloadRemoteConfigAsync] no check reload cuz checked recently');
        return // no need to reload
    }

    ////////////////////////
    // RELOAD HERE!
    ////////////////////////

    TrackSimpleWithParam('reloaded_remote_config', loadedConfigLastTimeInHour.toFixed(1))

    await GetRemoteConfigWithCheckFetchAsync(false, true)
}

/**
 * will be called at 2 cases:
 * 1. whenever freshly open app
 * 2. whenever onAppActive
 */
const OnActiveOrOnceUseEffectAsync = async () => {
    CheckFireOnActiveOrOnceUseEffectWithCheckDuplicateAsync()
}

/**
 * use to count open app times
 * will be called at 2 cases:
 * 1. whenever freshly open app
 * 2. onAppActive (but at least `HowLongInMinutesToCount2TimesUseAppSeparately` after the last call this method)
 */
const CheckFireOnActiveOrOnceUseEffectWithCheckDuplicateAsync = async () => {
    ///////////////////////////////
    // CHECK
    ///////////////////////////////

    const distanceMs = Date.now() - lastFireOnActiveOrOnceUseEffectWithCheckDuplicate

    const minFromLastCall = distanceMs / 1000 / 60

    if (minFromLastCall < HowLongInMinutesToCount2TimesUseAppSeparately)
        return

    lastFireOnActiveOrOnceUseEffectWithCheckDuplicate = Date.now()

    ///////////////////////////////
    // HANDLE HERE
    ///////////////////////////////

    // open of day count

    const count = await GetNumberIntAsync(StorageKey_OpenAppOfDayCount, 0)

    if (await GetDateAsync_IsValueExistedAndIsToday(StorageKey_OpenAppOfDayCountForDate)) { // already tracked yesterday, just inc today
        SetNumberAsync(StorageKey_OpenAppOfDayCount, count + 1)
    }
    else { // need to track for yesterday
        if (count > 0) {
            TrackOpenOfDayCount(count)
        }

        SetDateAsync_Now(StorageKey_OpenAppOfDayCountForDate)
        SetNumberAsync(StorageKey_OpenAppOfDayCount, 1)
    }

    // total open count

    await IncreaseNumberAsync(StorageKey_OpenAppTotalCount)

    // track current time (hour)

    const { date, number } = await GetPairNumberIntAndDateAsync(StorageKey_OpenAt, -1)
    const currentHour = new Date().getHours()

    if (number !== currentHour || !date || !IsToday(date)) {
        TrackSimpleWithParam('open_at', currentHour + 'h')
        SetPairNumberIntAndDateAsync_Now(StorageKey_OpenAt, currentHour)
    }
}

const OnActiveAsync = async (setupParams: SetupAppStateAndStartTrackingParams) => {
    // check to show warning alert

    CheckReloadRemoteConfigAsync()

    // first Open App Of The Day

    CheckFirstOpenAppOfTheDayAsync(setupParams)

    // onActiveOrOnceUseEffectAsync

    OnActiveOrOnceUseEffectAsync()
}

const OnBackgroundAsync = async () => {
}

// export const CheckAndShowAlertWhatsNewAsync = async (fromVer: number) => {
//     if (!Number.isNaN(fromVer))
//         await SetNumberAsync(StorageKey_NeedToShowWhatsNewFromVer, fromVer)
//     else
//         fromVer = await GetNumberIntAsync(StorageKey_NeedToShowWhatsNewFromVer)

//     if (Number.isNaN(fromVer))
//         return

//     const configFromFb = await FirebaseDatabase_GetValueAsyncWithTimeOut('app/whats_new', FirebaseDatabaseTimeOutMs)

//     if (!configFromFb.value)
//         return

//     const entries = Object.entries(configFromFb.value)
//     let s = ''
//     let versionsToTrack = ''

//     for (let i = 0; i < entries.length; i++) {
//         var key = entries[i][0]

//         if (!key.startsWith('v') || key.length < 4)
//             continue

//         const configVerNum = Number.parseInt(key.substring(1))

//         if (Number.isNaN(configVerNum))
//             continue

//         if (configVerNum <= fromVer || configVerNum > versionAsNumber)
//             continue

//         versionsToTrack += ('v' + configVerNum)

//         if (s === '')
//             s = entries[i][1] as string
//         else
//             s += '\n' + entries[i][1]
//     }

//     AsyncStorage.removeItem(StorageKey_NeedToShowWhatsNewFromVer)

//     if (s === '') {
//         return
//     }

//     s = s.replaceAll('@', '\n')

//     Alert.alert(
//         LocalText.update_updated,
//         `${LocalText.whats_new} v${versionAsNumber}:\n\n ${s}`)

//     track_SimpleWithParam('show_whats_new', versionsToTrack)
// }