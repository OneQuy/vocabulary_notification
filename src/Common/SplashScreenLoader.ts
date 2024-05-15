// NUMBER OF [CHANGE HERE]: 1

import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseInit } from "./Firebase/Firebase";

export type SplashScreenLoaderResult = { // CHANGE HERE 1
    someVariable?: number,
}

export async function SplashScreenLoader(): Promise<SplashScreenLoaderResult> {
    // firebase init

    FirebaseInit();

    // awaits

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

    // // init notifee

    // await initNotificationAsync() // alert_priority 3 (doc) // no depended

    // // init admob

    // await CheckAndInitAdmobAsync() // alert_priority 4 (doc) // no depended

    // // teleletry

    // const telemetryDeckClient = createTelemetryDeckClient(TELEMETRY_DECK_KEY, UserID(), IsDev())

    // return

    return {
        // someVariable: 7,
    } as SplashScreenLoaderResult
}