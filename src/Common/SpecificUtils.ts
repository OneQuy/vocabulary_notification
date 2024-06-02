// NUMBER OF [CHANGE HERE] 3
//
// Created on 17 may 2024 (Coding Vocaby)

import { Linking, Platform, Share } from "react-native"
import { AndroidLink, AppName, ShareAppContent, iOSLink } from "./SpecificConstants"
import { Event } from "@notifee/react-native"
import { DelayAsync, SafeValue, ToCanPrint } from "./UtilsTS"
import { NotificationExtraDataKey_Mode } from "../App/Handles/SetupNotification"
import { GenerateNotificationTrackData } from "./Nofitication"
import { VocabyNotificationTrackData } from "./SpecificType"
import { AppendArrayAsync, GetArrayAsync_PickAndRemoveFirstOne } from "./AsyncStorageUtils"
import { StorageKey_CacheEventNotification } from "../App/Constants/StorageKey"
import { TrackEventNotificationAsync } from "./Tracking"

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

export const OnEventNotification = async (isBackgroundOrForeground: boolean, event: Event): Promise<void> => {
    // setup data (common, not need change)

    const baseData = GenerateNotificationTrackData(isBackgroundOrForeground, event)

    // setup data (specific) // CHANGE HERE 1

    const setOrTestMode = SafeValue(event.detail.notification?.data?.[NotificationExtraDataKey_Mode], 'unknown')

    const fullTitle = SafeValue(event.detail.notification?.title, '')
    const titleSplitArr = fullTitle.split(' ')
    const word = titleSplitArr.length >= 1 ? titleSplitArr[0] : 'unknown'

    const objTrack: VocabyNotificationTrackData = {
        ...baseData,
        [NotificationExtraDataKey_Mode]: setOrTestMode,
        word,
    }

    // cache to storage (not need change)

    AppendArrayAsync<VocabyNotificationTrackData>(StorageKey_CacheEventNotification, objTrack) // // CHANGE HERE 2 (change type)

    // track on event (not need change)

    await TrackEventNotificationAsync(objTrack, true)

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
        if (IsLog)
            console.log('[CheckTrackCachedNotificationAsync] no events to track from cache more')

        return
    }

    // track on event (not need change)

    const firstEvent = saved.firstElement

    await TrackEventNotificationAsync(firstEvent, false)

    if (IsLog)
        console.log('[CheckTrackCachedNotificationAsync] remain cached events', saved.savedArray.length, 'tracked first cached one:', ToCanPrint(firstEvent))

    // continue track next event

    if (saved.savedArray.length >= 1) {
        await DelayAsync(300)

        CheckTrackCachedNotification()
    }
}