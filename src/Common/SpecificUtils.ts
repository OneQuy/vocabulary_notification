// NUMBER OF [CHANGE HERE] 1
//
// Created on 17 may 2024 (Coding Vocaby)

import { Linking, Platform, Share } from "react-native"
import { AndroidLink, AppName, ShareAppContent, iOSLink } from "./SpecificConstants"
import { Event } from "@notifee/react-native"
import { SafeValue, ToCanPrint } from "./UtilsTS"
import { NotificationExtraDataKey_Mode } from "../App/Handles/SetupNotification"
import { GenerateNotificationTrackData } from "./Nofitication"
import { VocabyNotificationTrackData } from "./SpecificType"
import { AppendArrayAsync } from "./AsyncStorageUtils"
import { StorageKey_CacheEventNotification } from "../App/Constants/StorageKey"
import { TrackingAsync } from "./Tracking"

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

    AppendArrayAsync<VocabyNotificationTrackData>(StorageKey_CacheEventNotification, objTrack)

    // track (not need change)

    const eventName = 'on_event_notification'

    TrackingAsync(
        eventName,
        [
            `total/app/${eventName}/${Platform.OS}/${isBackgroundOrForeground ? 'background' : 'foreground'}/` + baseData.eventType
        ],
        objTrack
    )

    console.log('[OnEventNotification]', ToCanPrint(objTrack))
}  