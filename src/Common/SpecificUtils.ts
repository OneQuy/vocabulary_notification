// NUMBER OF [CHANGE HERE] 5
//
// Created on 17 may 2024 (Coding Vocaby)

import { Linking, Platform, Share } from "react-native"
import { AndroidLink, AppName, ShareAppContent, iOSLink } from "./SpecificConstants"
import { Event, EventType } from "@notifee/react-native"
import { AppDirName, DelayAsync, SafeValue, ToCanPrint } from "./UtilsTS"
import { NotificationExtraDataKey_IsLastPush, NotificationExtraDataKey_Mode, NotificationExtraDataKey_PushIndex } from "../App/Handles/SetupNotification"
import { GenerateNotificationTrackDataAsync } from "./Nofitication"
import { OnSetSubcribeDataAsyncFunc, VocabyNotificationTrackData } from "./SpecificType"
import { AppendArrayAsync, GetArrayAsync_PickAndRemoveFirstOne } from "./AsyncStorageUtils"
import { StorageKey_CacheEventNotification } from "../App/Constants/StorageKey"
import { HandleError, TrackEventNotificationAsync, TrackSimpleWithParam } from "./Tracking"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DeleteFileAsync, DeleteTempDirAsync } from "./FileUtils"
import { Cheat } from "./Cheat"
import { PurchaseAsync } from "./IAP/IAP"

const IsLog = __DEV__

export async function OpenStoreAsync() {
    const link = Platform.OS === 'android' ? AndroidLink : iOSLink
    await Linking.openURL(link)
}

export const ShareAppAsync = async () => {
    await Share.share({
        title: AppName,
        message: ShareAppContent,
    })
}

export async function ClearAllFilesAndStorageAsync(onlyWhenCheatOrForceClear: boolean): Promise<void> {
    if (onlyWhenCheatOrForceClear) {
        if (!Cheat('clear_all_file_and_data'))
            return
    }

    // clear storage

    await AsyncStorage.clear()

    // clear temp dir files

    await DeleteTempDirAsync()

    // clear app dir files

    await DeleteFileAsync(AppDirName, true);

    if (IsLog) {
        console.log('[ClearAllFilesAndStorageAsync] DID CLEAR ALL FILES AND STORAGE!')
    }
}

export const OnEventNotification = async (isBackgroundOrForeground: boolean, event: Event): Promise<void> => {
    if (event.type === EventType.TRIGGER_NOTIFICATION_CREATED)
        return

    // setup data (common, not need change)

    const baseData = await GenerateNotificationTrackDataAsync(isBackgroundOrForeground, event)

    // setup data (specific) // CHANGE HERE 1

    let setOrTestMode = 'no_data'
    let word = 'no_data'
    let pushIdx = -1
    let isLast = 0

    if (event.detail.notification) {
        // pushIdx

        pushIdx = SafeValue(event.detail.notification.data?.[NotificationExtraDataKey_PushIndex], -1)

        // is last word push

        isLast = SafeValue(event.detail.notification.data?.[NotificationExtraDataKey_IsLastPush], 0)

        // setOrTestMode

        setOrTestMode = SafeValue(event.detail.notification.data?.[NotificationExtraDataKey_Mode], 'unknown')

        // word

        const fullTitle = SafeValue(event.detail.notification.title, '')
        const titleSplitArr = fullTitle.split(' ')

        word = titleSplitArr.length >= 1 && titleSplitArr[0].length >= 1 ?
            titleSplitArr[0] :
            'unknown'
    }

    const objTrack: VocabyNotificationTrackData = {
        ...baseData,
        [NotificationExtraDataKey_Mode]: setOrTestMode,
        [NotificationExtraDataKey_PushIndex]: pushIdx,
        [NotificationExtraDataKey_IsLastPush]: isLast,
        word,
    }

    // cache to storage // CHANGE HERE 2

    if (setOrTestMode !== 'test') { // may change this condition
        AppendArrayAsync<VocabyNotificationTrackData>(StorageKey_CacheEventNotification, objTrack) // change type
    }

    // track on-event // CHANGE HERE 4

    await TrackEventNotificationAsync(
        objTrack,
        true,
        setOrTestMode // my change here
    )

    console.log('[OnEventNotification]', 'tracked and cached (on event):', ToCanPrint(objTrack))
}

/**
 * tracked on CheckFireOnActiveOrUseEffectOnceWithGapAsync
 * #### note: this may a lot events so not call with [`await`]
 */
export const CheckTrackCachedNotification = async (): Promise<void> => {
    // cache to storage (not need change)

    const saved = await GetArrayAsync_PickAndRemoveFirstOne<VocabyNotificationTrackData>(StorageKey_CacheEventNotification) // CHANGE HERE 3 (change type)

    if (!saved) {
        // if (IsLog)
        //     console.log('[CheckTrackCachedNotificationAsync] no events to track from cache more')

        return
    }

    // track on event // CHANGE HERE 5

    const firstEvent = saved.firstElement

    await TrackEventNotificationAsync(
        firstEvent,
        false,
        firstEvent[NotificationExtraDataKey_Mode] // may change here
    )

    if (IsLog)
        console.log('[CheckTrackCachedNotificationAsync] remain cached events', saved.savedArray.length, 'tracked first cached one:', ToCanPrint(firstEvent))

    // continue track next event

    if (saved.savedArray.length >= 1) {
        await DelayAsync(300)

        CheckTrackCachedNotification()
    }
}

/**
 * ### usage:
```tsx
set_isHandling(true)
await UpgradeAsync(sku, onSetSubcribeDataAsync)
set_isHandling(false)
```
 */
export const PurchaseAndTrackingAsync = async (sku: string, onSetSubcribeDataAsync: OnSetSubcribeDataAsyncFunc) => {
    let valueTracking = ''

    const res = await PurchaseAsync(sku)

    // success

    if (res === undefined) {

        await onSetSubcribeDataAsync({
            id: sku,
            purchasedTick: Date.now()
        })

        valueTracking = 'success_' + sku
    }

    // cancel

    else if (res === null) {
        valueTracking = 'cancel'
    }

    // error

    else {
        HandleError(res, 'BuyLifetime', true)
        valueTracking = 'error'
    }

    TrackSimpleWithParam('purchase', valueTracking)
}