// CHANGE OPTIONAL TO EACH TYPE
//
// Created on 17 may 2024 (Coding Vocaby)

import { NotificationExtraDataKey_Mode } from "../App/Handles/SetupNotification"
import { TrackingValuesObject } from "./Tracking"

export type RemoteConfig = { // CHANGE OPTIONAL
    // common

    forceDev: number,

    remoteFiles?: object,

    tracking?: {
        aptabaseProductionKey?: string,
        aptabaseIgnores?: string,
        aptabaseRemoveIgnores?: string,

        firebaseRootOrErrorIgnores?: string,

        enableAptabase?: boolean,
        enableFirebase?: boolean,
        enablePosthog?: boolean,
    },

    latestVersion: {
        android: LatestVersionConfig,
        ios: LatestVersionConfig,
    },

    alternativeValue?: Record<string, string>,

    // ads: {
    //     newDayFree: number,
    //     loop: number,
    // },

    // notice?: {
    //     maxVersion: number,
    //     content: string,
    //     link: string,
    //     isPressToOpenStore: boolean,
    // },

    // startupAlert?: {
    //     maxVersion: number,
    //     id: string,
    //     title: string,
    //     content: string,
    //     allowEnterApp: boolean,
    //     buttonLink: string,
    //     buttonLinkTitle: string,
    //     showUpdateButton: boolean,
    //     okTitle: string,
    // },

    // specific

    currentLifetimeId: string,
}


type LatestVersionConfig = { // MAYBE NO CHANGE
    version: number,
    forceUpdate: boolean,
    releaseNote: string,
    dayDiffToAsk: number,
    required: number,
}


export type SplashScreenLoaderResult = { // CHANGE OPTIONAL
    someVariable?: number,
}


export type SubscribedData = { // MAYBE NO CHANGE
    id: string,
    purchasedTick: number
}


export const UserForcePremiumDataProperty = 'forcePremiumData' // NO CHANGE

export type User = { // CHANGE OPTIONAL
    // common

    [UserForcePremiumDataProperty]: SubscribedData,
}


export type AppContextType = { // CHANGE OPTIONAL
    // common

    subscribedData: SubscribedData | undefined,
    onSetSubcribeDataAsync: (subscribedData: SubscribedData | undefined) => Promise<void>,
}


export interface NotificationTrackData extends TrackingValuesObject { // NO CHANGE
    eventType: string;
    status: string,
    background: boolean;
    eventTime: string;

    /**
     * no_data if no notification data
     */
    targetTime: string;

    /**
     * -1 if no notification data
     */
    offsetInSec: number;
}

export interface VocabyNotificationTrackData extends NotificationTrackData { // CHANGE OPTIONAL
    /**
     * 'no_data' if having no notification data
     */
    [NotificationExtraDataKey_Mode]: string;

    /**
     * 'no_data' if having no notification data. 'unknown' if can split vocabulary
     */
    word: string;
}