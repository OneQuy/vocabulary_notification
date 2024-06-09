// NUMBER OF [CHANGE HERE]: 1

import { SplashScreenLoaderResult } from "./SpecificType";
import { FirebaseInit } from "./Firebase/Firebase";
import { CheckIsDevAsync } from "./IsDev";
import { GetRemoteConfigWithCheckFetchAsync } from "./RemoteConfig";
import { InitUserIDAsync } from "./UserID";
import { CheckSetStartUsingAppTickAsync } from "../App/Handles/PremiumHandler";

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

    // set start using app

    await CheckSetStartUsingAppTickAsync() // alert_priority_set_start_using_app (doc)

    return {
        // someVariable: 7,
    } as SplashScreenLoaderResult
}