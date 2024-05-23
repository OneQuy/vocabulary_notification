// Created on 17 may 2024 (Coding Vocaby)

export type RemoteConfig = {
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


type LatestVersionConfig = {
    version: number,
    forceUpdate: boolean,
    releaseNote: string,
    dayDiffToAsk: number,
    required: number,
}


export type SplashScreenLoaderResult = {
    someVariable?: number,
}


export type SubscribedData = {
    id: string,
    purchasedTick: number
}


export const UserForcePremiumDataProperty = 'forcePremiumData'

export type User = {
    // common

    [UserForcePremiumDataProperty]: SubscribedData,
}


export type AppContextType = {
    // common

    subscribedData: SubscribedData | undefined,
    onSetSubcribeDataAsync: (subscribedData: SubscribedData | undefined) => Promise<void>,
}