// NUMBER OF [CHANGE HERE]: 2

import { FirebaseInit } from "./Firebase/Firebase";
import { initNotificationAsync } from "./Nofitication";

export type SplashScreenLoaderResult = { // CHANGE HERE 1
    someVariable?: number,
}

export async function SplashScreenLoader(): Promise<SplashScreenLoaderResult> {
    // firebase init

    FirebaseInit();

    // init notifee

    initNotificationAsync()  // ND

    // awaits // CHANGE HERE 2 (ALL BELOW)

    const [
    ] = await Promise.all([
        // // cheat clear all local file
        // CheckAndClearAllLocalFileBeforeLoadApp(), // no depended

        // // user id
        // InitUserIDAsync(), // no depended
    ])

    // // check is dev 

    // await CheckIsDevAsync() // (must after HandleAppConfigAsync)

    // // init aptabase tracking

    // InitAptabase() // (must after HandleAppConfigAsync & CheckIsDevAsync)

    // // handl startup alert (must after HandleAppConfigAsync)

    // await HandleStartupAlertAsync() // alert_priority 1 (doc) // (must after HandleAppConfigAsync)

    // // handle alert update

    // await HandldAlertUpdateAppAsync() // alert_priority 2 (doc) // (must after HandleAppConfigAsync)

    // // init admob

    // await CheckAndInitAdmobAsync() // alert_priority 4 (doc) // no depended

    // // teleletry

    // const telemetryDeckClient = createTelemetryDeckClient(TELEMETRY_DECK_KEY, UserID(), IsDev())

    // return

    return {
        // someVariable: 7,
    } as SplashScreenLoaderResult
}