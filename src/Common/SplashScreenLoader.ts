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
        // remote config & alert
        GetRemoteConfigWithCheckFetchAsync(false, true), // alert_priority_1 (doc)

        // user id (for trackings)
        InitUserIDAsync(), // ND

        // // cheat clear all local file
        // CheckAndClearAllLocalFileBeforeLoadApp(), // ND
    ])

    await Promise.all([
        // check is dev (for initting PostHogProvider, trackings)
        CheckIsDevAsync(), // (must after GetRemoteConfigWithCheckFetchAsync)
    ])

    return {
        // someVariable: 7,
    } as SplashScreenLoaderResult
}