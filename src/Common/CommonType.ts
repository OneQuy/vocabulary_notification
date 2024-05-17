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

    // specific

    currentLifetimeId: string,
}

export type SplashScreenLoaderResult = {
    someVariable?: number,
}