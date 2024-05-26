// NUMBER OF [CHANGE HERE] 0 (JUST CHANGE DEPENDENCES)
//
// Created May 2024 (coding Vocaby)
//
// USAGE:
// 1. Simply just need to call this in the first appear screen: SetupAppStateAndStartTrackingAsync(...)


import AsyncStorage from "@react-native-async-storage/async-storage"
import { GetBooleanAsync, GetDateAsync, GetDateAsync_IsValueExistedAndIsToday, GetNumberIntAsync, GetPairNumberIntAndDateAsync, IncreaseNumberAsync, SetBooleanAsync, SetDateAsync_Now, SetNumberAsync, SetPairNumberIntAndDateAsync_Now } from "./AsyncStorageUtils"
import { VersionAsNumber } from "./CommonConstants"
import { StorageKey_FirstTimeInstallTick, StorageKey_LastCheckFirstOpenOfTheDay, StorageKey_LastFreshlyOpenApp, StorageKey_LastInstalledVersion, StorageKey_NeedToShowWhatsNewFromVer, StorageKey_OpenAppOfDayCount, StorageKey_OpenAppOfDayCountForDate, StorageKey_OpenAppTotalCount, StorageKey_OpenAt, StorageKey_PressUpdateObject, StorageKey_TrackedNewlyInstall } from "../App/Constants/StorageKey"
import PostHog from "posthog-react-native"
import { InitTrackingAsync, TrackFirstOpenOfDayOldUserAsync, TrackOnActiveOrUseEffectOnceWithGapAsync, TrackOnNewlyInstallAsync, CheckTrackUpdatedAppAsync, TrackSimpleWithParam } from "./Tracking"
import { AlertAsync, DateDiff_InHour_WithNow, DateDiff_WithNow, GetDayHourMinSecFromMs_ToString, IsToday, IsValuableArrayOrString } from "./UtilsTS"
import { ClearUserForcePremiumDataAsync, GetUserForcePremiumDataAsync } from "./UserMan"
import { SubscribedData } from "./SpecificType"
import { UserID } from "./UserID"
import { AppStateStatus } from "react-native"
import { RegisterOnChangedState } from "./AppStateMan"
import { GetLastTimeFetchedRemoteConfigSuccessAndHandledAlerts, GetRemoteConfigWithCheckFetchAsync } from "./RemoteConfig"
import { FirebaseDatabaseTimeOutMs, FirebaseDatabase_GetValueAsyncWithTimeOut } from "./Firebase/FirebaseDatabase"
import { CheckIsDevAsync } from "./IsDev"

export type SetupAppStateAndStartTrackingParams = {
    posthog: PostHog,
    subscribedData: SubscribedData | undefined,
    forceSetPremiumAsync: (setOrReset: SubscribedData | undefined) => Promise<void>,
}

const IsLog = __DEV__

const HowLongInMinutesToCount2TimesUseAppSeparately = 60 // minute
const HowLongToReloadRemoteConfigInHour = 6 // hour

var inited = false
var isHandling_CheckAndTriggerFirstOpenAppOfTheDayAsync = false
var lastFireOnActiveOrOnceUseEffectWithGap = 0
var isNewlyInstallThisOpen = false
var setupParamsInternal: SetupAppStateAndStartTrackingParams | undefined = undefined

export const IsNewlyInstallThisOpen = () => isNewlyInstallThisOpen

/**
 * MAIN
 * 
 * use effect once
 * 
 * 'freshly open app' (can multiple times per day, but once per app open)
 */
export const SetupAppStateAndStartTrackingAsync = async (setupParams: SetupAppStateAndStartTrackingParams): Promise<void> => {
    if (inited)
        return

    inited = true
    setupParamsInternal = setupParams

    // init app state

    RegisterOnChangedState(OnStateChanged)

    // init tracking

    await InitTrackingAsync(setupParams.posthog)

    // tracks: updated_app

    const lastInstalledVersion = await CheckTrackUpdatedAppAsync()

    // what's new

    await CheckShowAlertWhatsNewAsync(lastInstalledVersion)

    // on active or use effect once
    // tracks: 
    //      + newly_install, first open of the day
    //      + current time (hour)
    //      + open_app (open of day count, total open count, last open app, isPremium)
    // force premium

    await OnActiveOrUseEffectOnceAsync(setupParams, true, undefined)
}

const OnActiveAsync = async (setupParams: SetupAppStateAndStartTrackingParams) => {
    // check to show warning alert

    const loadedConfigLastTimeInHour = CheckReloadRemoteConfig()

    // onActive or OnceUseEffect

    await OnActiveOrUseEffectOnceAsync(setupParams, false, loadedConfigLastTimeInHour)
}

const OnBackgroundAsync = async () => {
}

/**
 * first open of the day
 * (on first freshly open app OR first active of the day)
 */
const CheckFirstOpenAppOfTheDayAsync = async (setupParams: SetupAppStateAndStartTrackingParams) => {
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
        isNewlyInstallThisOpen = true
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
const CheckReloadRemoteConfig = (): undefined | number => {
    // CHECK ////////////////

    const loadedConfigLastTimeInHour = DateDiff_InHour_WithNow(GetLastTimeFetchedRemoteConfigSuccessAndHandledAlerts())

    if (loadedConfigLastTimeInHour < HowLongToReloadRemoteConfigInHour) {
        if (IsLog)
            console.log('[CheckReloadRemoteConfigAsync] no check reload cuz checked recently, hour =', loadedConfigLastTimeInHour);

        return undefined // no need to reload
    }

    // RELOAD HERE /////////

    GetRemoteConfigWithCheckFetchAsync(false, true)

    return loadedConfigLastTimeInHour
}

/**
 * will be called at 2 cases:
 * 1. whenever freshly open app
 * 2. whenever onAppActive
 */
const OnActiveOrUseEffectOnceAsync = async (
    setupParams: SetupAppStateAndStartTrackingParams,
    isUseEffectOnce: boolean,
    loadedConfigLastTimeInHour: number | undefined
) => {
    // first Open App Of The Day

    await CheckFirstOpenAppOfTheDayAsync(setupParams)

    // callbacks

    await CheckFireOnActiveOrUseEffectOnceWithGapAsync(setupParams, isUseEffectOnce, loadedConfigLastTimeInHour)
}

/**
 * used to count open app times, track open_app
 * 
 * will be called at 2 cases:
 * 1. whenever freshly open app
 * 2. onAppActive (but at least `HowLongInMinutesToCount2TimesUseAppSeparately` after the last call this method)
 */
const CheckFireOnActiveOrUseEffectOnceWithGapAsync = async (
    setupParams: SetupAppStateAndStartTrackingParams,
    isUseEffectOnce: boolean,
    loadedConfigLastTimeInHour: number | undefined
) => {
    // CHECK /////////////////////////////

    const now = Date.now()
    const distanceMs = now - lastFireOnActiveOrOnceUseEffectWithGap

    const minFromLastCall = distanceMs / 1000 / 60

    if (minFromLastCall < HowLongInMinutesToCount2TimesUseAppSeparately)
        return

    lastFireOnActiveOrOnceUseEffectWithGap = now

    // HANDLE HERE /////////////////////////////

    await CheckIsDevAsync(true) // force reload dev

    // open of day count

    const savedCount = await GetNumberIntAsync(StorageKey_OpenAppOfDayCount, 0)
    let openTodaySoFar = 0
    let openOfLastDayCount: number | undefined = undefined

    if (await GetDateAsync_IsValueExistedAndIsToday(StorageKey_OpenAppOfDayCountForDate)) { // already tracked yesterday, just inc today
        openTodaySoFar = savedCount + 1
    }
    else { // need to track for yesterday
        if (savedCount > 0) {
            openOfLastDayCount = savedCount
        }

        SetDateAsync_Now(StorageKey_OpenAppOfDayCountForDate)

        openTodaySoFar = 1
    }

    await SetNumberAsync(StorageKey_OpenAppOfDayCount, openTodaySoFar)

    // total open count

    const totalOpenApp = await IncreaseNumberAsync(StorageKey_OpenAppTotalCount)

    // get current time (hour)

    const { date, number } = await GetPairNumberIntAndDateAsync(StorageKey_OpenAt, -1)
    const currentHour = new Date().getHours()

    let openAtHour: string | undefined = undefined

    if (number !== currentHour || !date || !IsToday(date)) {
        openAtHour = currentHour + 'h'
        SetPairNumberIntAndDateAsync_Now(StorageKey_OpenAt, currentHour)
    }

    // open app

    await TrackOnActiveOrUseEffectOnceWithGapAsync(
        totalOpenApp,
        openTodaySoFar,
        distanceMs === now ? 0 : distanceMs,
        setupParams,
        isUseEffectOnce,
        openAtHour,
        loadedConfigLastTimeInHour,
        openOfLastDayCount
    )
}

const CheckShowAlertWhatsNewAsync = async (fromVer: number) => {
    if (!Number.isNaN(fromVer))
        await SetNumberAsync(StorageKey_NeedToShowWhatsNewFromVer, fromVer)
    else
        fromVer = await GetNumberIntAsync(StorageKey_NeedToShowWhatsNewFromVer)

    if (Number.isNaN(fromVer))
        return

    const configFromFb = await FirebaseDatabase_GetValueAsyncWithTimeOut('app/whats_new', FirebaseDatabaseTimeOutMs)

    if (!configFromFb.value)
        return

    const entries = Object.entries(configFromFb.value)
    let s = ''
    let versionsToTrack = ''

    for (let i = 0; i < entries.length; i++) {
        var key = entries[i][0]

        if (!key.startsWith('v') || key.length < 4)
            continue

        const configVerNum = Number.parseInt(key.substring(1))

        if (Number.isNaN(configVerNum))
            continue

        if (configVerNum <= fromVer || configVerNum > VersionAsNumber)
            continue

        versionsToTrack += ('v' + configVerNum)

        if (s === '')
            s = entries[i][1] as string
        else
            s += '\n' + entries[i][1]
    }

    AsyncStorage.removeItem(StorageKey_NeedToShowWhatsNewFromVer)

    if (s === '') {
        return
    }

    s = s.replaceAll('@', '\n')

    TrackSimpleWithParam('show_whats_new', versionsToTrack)

    await AlertAsync(
        "Thank you for updating!",
        `What's new in version v${VersionAsNumber}:\n\n${s}`
    ) // alert_priority_whats_new (doc)
}