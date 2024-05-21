// NUMBER OF [CHANGE HERE]: 1

import { SplashScreenLoaderResult } from "./SpecificType";
import { FirebaseInit } from "./Firebase/Firebase";
import { CheckIsDevAsync } from "./IsDev";
import { GetRemoteConfigWithCheckFetchAsync } from "./RemoteConfig";
import { HandleAlertUpdateAppAsync } from "./HandleAlertUpdateApp";
import { InitUserIDAsync } from "./UserID";

export async function SplashScreenLoader(): Promise<SplashScreenLoaderResult> {
    // firebase init (for retrieving remote config, firebase db,...)

    FirebaseInit()

    ///////////////////////////
    // CHANGE HERE 1 (ALL BELOW)
    ///////////////////////////

    await Promise.all([
        // remote config
        GetRemoteConfigWithCheckFetchAsync(false),

        // user id (for trackings)
        InitUserIDAsync(), // ND

        // // cheat clear all local file
        // CheckAndClearAllLocalFileBeforeLoadApp(), // no depended
    ])

    await Promise.all([
        // check is dev (for initting PostHogProvider, trackings)
        CheckIsDevAsync(), // (must after GetRemoteConfigWithCheckFetchAsync)

        // handle alert update
        HandleAlertUpdateAppAsync(await GetRemoteConfigWithCheckFetchAsync()) // alert_priority 1 (doc) // (must after GetRemoteConfigWithCheckFetchAsync)
    ])

    // // handl startup alert (must after GetRemoteConfigWithCheckFetchAsync)
    // await HandleStartupAlertAsync() // alert_priority 1 (doc) // (must after GetRemoteConfigWithCheckFetchAsync)

    return {
        // someVariable: 7,
    } as SplashScreenLoaderResult
}