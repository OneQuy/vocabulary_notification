// NUMBER OF [CHANGE HERE]: 1

import { SplashScreenLoaderResult } from "./SpecificType";
import { FirebaseInit } from "./Firebase/Firebase";
import { CheckIsDevAsync } from "./IsDev";
import { GetRemoteConfigWithCheckFetchAsync } from "./RemoteConfig";
import { HandleAlertUpdateAppAsync } from "./HandleAlertUpdateApp";
// import { InitUserIDAsync } from "./UserID";

export async function SplashScreenLoader(): Promise<SplashScreenLoaderResult> {
    // firebase init (for retrieving remote config, firebase db,...)

    FirebaseInit()

    // awaits // CHANGE HERE 1 (ALL BELOW)

    const [] = await Promise.all([
        // remote config
        GetRemoteConfigWithCheckFetchAsync(false),

        // // user id
        // InitUserIDAsync(), // ND

        // // cheat clear all local file
        // CheckAndClearAllLocalFileBeforeLoadApp(), // no depended
    ])

    // check is dev (for initting PostHogProvider, trackings)

    await CheckIsDevAsync() // (must after GetRemoteConfigWithCheckFetchAsync)

    // // handl startup alert (must after GetRemoteConfigWithCheckFetchAsync)

    // await HandleStartupAlertAsync() // alert_priority 1 (doc) // (must after GetRemoteConfigWithCheckFetchAsync)

    // handle alert update

    await HandleAlertUpdateAppAsync(await GetRemoteConfigWithCheckFetchAsync()) // alert_priority 2 (doc) // (must after GetRemoteConfigWithCheckFetchAsync)

    // return

    return {
        // someVariable: 7,
    } as SplashScreenLoaderResult
}