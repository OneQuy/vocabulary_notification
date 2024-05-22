// Created May 2024 (coding Vocaby)
//
// USAGE:
// 1. Simply just need to call this in the first appear screen: SetupAppStateAndStartTrackingAsync()
//
//

import AsyncStorage from "@react-native-async-storage/async-storage"
import { GetDateAsync, GetNumberIntAsync, SetDateAsync_Now, SetNumberAsync } from "./AsyncStorageUtils"
import { VersionAsNumber } from "./CommonConstants"
import { StorageKey_FirstTimeInstallTick, StorageKey_LastFreshlyOpenApp, StorageKey_LastInstalledVersion, StorageKey_OpenAppOfDayCount, StorageKey_OpenAppTotalCount, StorageKey_PressUpdateObject } from "../App/Constants/StorageKey"
import PostHog from "posthog-react-native"
import { InitTrackingAsync } from "./Tracking"
import { DateDiff_WithNow, GetDayHourMinSecFromMs_ToString, IsValuableArrayOrString } from "./UtilsTS"

var inited = false

export const SetupAppStateAndStartTrackingAsync = async (posthog: PostHog): Promise<void> => {
    if (inited)
        return

    if (!posthog)
        return

    inited = true

    await InitTrackingAsync(posthog)
}

// var isNewlyInstall: boolean = false

// export const IsNewlyInstall = () => isNewlyInstall

// /**
//  * on first useEffect of the app (freshly open) or first active state of the day
//  * . ONLY track ONCE a day
//  */
// export const track_NewlyInstallOrFirstOpenOfTheDayOldUserAsync = async () => {
//     // newly_install

//     const firstTimeInstallTick = await GetDateAsync(StorageKey_FirstTimeInstallTick)

//     if (firstTimeInstallTick === undefined) {
//         isNewlyInstall = true
//         TrackOnNewlyInstallAsync()
//     }

//     // old user

//     else {
//         TrackFirstOpenOfDayOldUserAsync
//     }
// }

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





// const HowLongInMinutesToCount2TimesUseAppSeparately = 20

// const HowLongToReloadInMinute = 30

// var lastFireOnActiveOrOnceUseEffectWithCheckDuplicate = 0

// var lastActiveTick = Date.now()

// var isHandling_CheckAndTriggerFirstOpenAppOfTheDayAsync = false

// var calledOnUseEffectOnceEnterApp = false

// /** reload (app config + file version) if app re-active after a period 1 HOUR */
// const checkAndReloadAppAsync = async () => {
//     const lastUpdate = await GetDateAsync(StorageKey_LastTimeCheckAndReloadAppConfig)

//     if (!await GetDateAsync_IsValueNotExistedOrEqualOverMinFromNow(
//         StorageKey_LastTimeCheckAndReloadAppConfig,
//         HowLongToReloadInMinute)) {
//         console.log('[checkAndReloadAppAsync] no check reload cuz checked recently');
//         return
//     }

//     // need to reload!

//     const [successDownloadAppConfig, successDownloadFileVersion] = await Promise.all([
//         HandleAppConfigAsync(),
//         HandleVersionsFileAsync()
//     ])

//     console.log('successDownloadAppConfig', successDownloadAppConfig);
//     console.log('successDownloadFileVersion', successDownloadFileVersion);

//     // handle app config

//     if (successDownloadAppConfig)
//         await onAppConfigReloadedAsync()

//     // handle file version

//     if (successDownloadFileVersion) { // reset screen
//         ResetNavigation(lastUpdate)
//     }

//     // set tick

//     if (successDownloadAppConfig && successDownloadFileVersion)
//         SetDateAsync_Now(StorageKey_LastTimeCheckAndReloadAppConfig)
// }

// const onAppConfigReloadedAsync = async () => {
//     console.log('[onAppConfigReloadedAsync]')

//     // startup alert

//     await HandleStartupAlertAsync() // alert_priority 1 (doc)

//     // handle alert update

//     await HandldAlertUpdateAppAsync() // alert_priority 2 (doc)
// }

// /**
//  * will be called at 2 cases:
//  * 1. whenever freshly open app
//  * 2. whenever onAppActive
//  */
// const onActiveOrOnceUseEffectAsync = async () => {
//     checkAndFireOnActiveOrOnceUseEffectWithCheckDuplicateAsync()
// }

// /**
//  * use to count open app times
//  * will be called at 2 cases:
//  * 1. whenever freshly open app
//  * 2. onAppActive (but at least 20p after the last call this method)
//  */
// const checkAndFireOnActiveOrOnceUseEffectWithCheckDuplicateAsync = async () => {
//     const distanceMs = Date.now() - lastFireOnActiveOrOnceUseEffectWithCheckDuplicate

//     const minFromLastCall = distanceMs / 1000 / 60

//     if (minFromLastCall < HowLongInMinutesToCount2TimesUseAppSeparately)
//         return

//     lastFireOnActiveOrOnceUseEffectWithCheckDuplicate = Date.now()

//     // handle here ------------------------------------

//     const count = await GetNumberIntAsync(StorageKey_OpenAppOfDayCount, 0)

//     if (await GetDateAsync_IsValueExistedAndIsToday(StorageKey_OpenAppOfDayCountForDate)) { // already tracked yesterday, just inc today
//         SetNumberAsync(StorageKey_OpenAppOfDayCount, count + 1)
//     }
//     else { // need to track for yesterday
//         if (count > 0)
//             track_OpenAppOfDayCount(count)

//         SetDateAsync_Now(StorageKey_OpenAppOfDayCountForDate)
//         SetNumberAsync(StorageKey_OpenAppOfDayCount, 1)
//     }

//     await IncreaseNumberAsync(StorageKey_OpenAppTotalCount)

//     // track current time (hour) of using Gooday

//     const { date, number } = await GetPairNumberIntAndDateAsync(StorageKey_GoodayAt, -1)
//     const currentHour = new Date().getHours()

//     if (number !== currentHour || !date || !IsToday(date)) {
//         track_SimpleWithParam('gooday_at', currentHour + 'h')
//         SetPairNumberIntAndDateAsync_Now(StorageKey_GoodayAt, currentHour)
//     }
// }

// const onActiveAsync = async () => {
//     lastActiveTick = Date.now()

//     // check to show warning alert

//     checkAndReloadAppAsync()

//     // first Open App Of The Day

//     CheckAndTriggerFirstOpenAppOfTheDayAsync()

//     // onActiveOrOnceUseEffectAsync

//     onActiveOrOnceUseEffectAsync()
// }

// const onBackgroundAsync = async () => {
//     setNotificationAsync()

//     // SaveCachedPressNextPost

//     SaveCachedPressNextPostAsync()
// }

// const onStateChanged = (state: AppStateStatus) => {
//     if (state === 'active') {
//         onActiveAsync()
//     }
//     else if (state === 'background') {
//         onBackgroundAsync()
//     }
// }

// /**
//  * on freshly open app or first active of the day
//  */
// export const CheckAndTriggerFirstOpenAppOfTheDayAsync = async () => {
//     if (isHandling_CheckAndTriggerFirstOpenAppOfTheDayAsync) {
//         return
//     }

//     isHandling_CheckAndTriggerFirstOpenAppOfTheDayAsync = true

//     const lastDateTrack = await GetDateAsync(StorageKey_LastTimeCheckFirstOpenAppOfTheDay)

//     if (lastDateTrack !== undefined && IsToday(lastDateTrack)) {
//         isHandling_CheckAndTriggerFirstOpenAppOfTheDayAsync = false
//         return
//     }

//     await SetDateAsync_Now(StorageKey_LastTimeCheckFirstOpenAppOfTheDay)
//     isHandling_CheckAndTriggerFirstOpenAppOfTheDayAsync = false

//     // handles

//     // console.log('---- handle first open app of the day ------');

//     track_NewlyInstallOrFirstOpenOfTheDayOldUserAsync()

//     // track location

//     checkAndTrackLocation()

//     // gooday streak

//     HandleGoodayStreakAsync()

//     // track day of week

//     track_SimpleWithParam('gooday_week', DayName(undefined, true))

//     // CheckForcePremiumDataAsync

//     CheckForcePremiumDataAsync()
// }

// /**
//  * freshly open app
//  */
// export const OnUseEffectOnceEnterApp = () => {
//     if (calledOnUseEffectOnceEnterApp) {
//         return
//     }

//     calledOnUseEffectOnceEnterApp = true

//     track_OnUseEffectOnceEnterAppAsync(startFreshlyOpenAppTick)

//     CheckAndTriggerFirstOpenAppOfTheDayAsync()
//     CheckAndPrepareDataForNotificationAsync()
//     onActiveOrOnceUseEffectAsync()
//     SetupOneSignal()
// }

// export const RegisterGoodayAppState = (isRegister: boolean) => {
//     if (isRegister)
//         RegisterOnChangedState(onStateChanged)
//     else
//         UnregisterOnChangedState(onStateChanged)
// }

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

// export const HandleGoodayStreakAsync = async (forceShow = false) => {
//     const id = 'gooday'

//     const handled = await SetStreakAsync(id)

//     if (!handled && !forceShow) // already showed
//         return

//     const data = await GetStreakAsync(id)

//     if (!data)
//         return

//     const streakLastTime = await GetNumberIntAsync(StorageKey_StreakLastTime)

//     if (data.currentStreak === streakLastTime && !forceShow)
//         return

//     SetNumberAsync(StorageKey_StreakLastTime, data.currentStreak)

//     if (data.currentStreak > 1)
//         GoodayToast(LocalText.gooday_streak_2.replaceAll('##', data.currentStreak.toString()))
//     else if (data.bestStreak > 1)
//         GoodayToast(Math.random() > 0.5 ? LocalText.gooday_streak_1_welcome : LocalText.gooday_streak_1)
//     else
//         GoodayToast(LocalText.gooday_streak_1)

//     // track

//     if (!forceShow)
//         track_Streak(data.currentStreak, data.bestStreak)
// }

// const CheckForcePremiumDataAsync = async () => {
//     if (!appDispatch)
//         return

//     const data = await GetUserForcePremiumDataAsync()

//     console.log('[CheckForcePremiumDataAsync] data', data);

//     if (!data)
//         return

//     if (data.id === 'reset') {
//         appDispatch(resetSubscribe())
//         track_SimpleWithParam('forced_subscribe', UserID() + '__reset')
//     }
//     else {
//         appDispatch(setForceSubscribe([
//             data.id,
//             data.tick
//         ]))

//         track_SimpleWithParam('forced_subscribe', UserID() + '__' + data.id + '__' + data.tick)

//         Alert.alert('Wohoo!', 'You granted: ' + data.id + '. Really thanks for your support!')
//     }

//     await ClearUserForcePremiumDataAsync()

// }