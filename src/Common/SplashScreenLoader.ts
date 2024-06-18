// NUMBER OF [CHANGE HERE]: 1

import { SplashScreenLoaderResult, UserSelectedPopularityIndexProperty } from "./SpecificType";
import { FirebaseInit } from "./Firebase/Firebase";
import { CheckIsDevAsync } from "./IsDev";
import { GetRemoteConfigWithCheckFetchAsync } from "./RemoteConfig";
import { InitUserIDAsync } from "./UserID";
import { CheckSetStartUsingAppTickAsync } from "../App/Handles/PremiumHandler";
import { FetchUserDataOnNewlyInstall } from "./FetchUserDataOnNewlyInstall";
import { StorageKey_PopularityIndex } from "../App/Constants/StorageKey";
import { GetUserPropertyFirebasePath } from "./UserMan";
import { ClearAllFilesAndStorageAsync } from "./SpecificUtils";

export async function SplashScreenLoader(): Promise<SplashScreenLoaderResult> {
    // firebase init (for retrieving remote config, firebase db,...)
    FirebaseInit()

    // cheat clear all files and storage
    await ClearAllFilesAndStorageAsync(true) // ND

    ///////////////////////////
    // CHANGE HERE 1 (ALL BELOW)
    ///////////////////////////

    await Promise.all([
        // remote config & alert
        GetRemoteConfigWithCheckFetchAsync(false, true), // alert_priority_1 (doc)

        // user id (for trackings)
        InitUserIDAsync(), // ND
    ])

    await Promise.all([
        // check is dev (for initting PostHogProvider, trackings)
        CheckIsDevAsync(), // (must after GetRemoteConfigWithCheckFetchAsync)
    ])

    // app specific: fetch newly user data (premium,...)

    await FetchUserDataOnNewlyInstall.CheckFetchAsync([
        {
            storageKey: StorageKey_PopularityIndex,
            firebasePath: GetUserPropertyFirebasePath(UserSelectedPopularityIndexProperty),
        }
    ]) // ND // alert_priority_fetch_error_user_newly_install (doc)

    // app specific: set start using app

    await CheckSetStartUsingAppTickAsync() // alert_priority_set_start_using_app (doc)

    // return

    return {
        // someVariable: 7,
    } as SplashScreenLoaderResult
}