// NUMBER OF [CHANGE HERE]: 2

import { FirebaseInit } from "./Firebase/Firebase";
import { CheckIsDevAsync } from "./IsDev";
import { initNotificationAsync } from "./Nofitication";
import { GetRemoteConfigWithCheckFetchAsync } from "./RemoteConfig";
import { InitUserIDAsync } from "./UserID";

export type SplashScreenLoaderResult = { // CHANGE HERE 1
    someVariable?: number,
}

export async function SplashScreenLoader(): Promise<SplashScreenLoaderResult> {
    // firebase init

    FirebaseInit();

    // init notifee

    initNotificationAsync()  // ND

    // awaits // CHANGE HERE 2 (ALL BELOW)

    const [] = await Promise.all([
        // remote config
        GetRemoteConfigWithCheckFetchAsync(false),

        // user id
        InitUserIDAsync(), // ND

        // // cheat clear all local file
        // CheckAndClearAllLocalFileBeforeLoadApp(), // no depended
    ])

    // check is dev 

    await CheckIsDevAsync() // (must after GetRemoteConfigWithCheckFetchAsync)

    // init aptabase tracking

    // InitAptabaseAsync() // (must after GetRemoteConfigWithCheckFetchAsync & CheckIsDevAsync)

    // // handl startup alert (must after GetRemoteConfigWithCheckFetchAsync)

    // await HandleStartupAlertAsync() // alert_priority 1 (doc) // (must after GetRemoteConfigWithCheckFetchAsync)

    // // handle alert update

    // await HandldAlertUpdateAppAsync() // alert_priority 2 (doc) // (must after GetRemoteConfigWithCheckFetchAsync)

    // // init admob

    // await CheckAndInitAdmobAsync() // alert_priority 4 (doc) // no depended

    // return

    return {
        // someVariable: 7,
    } as SplashScreenLoaderResult
}