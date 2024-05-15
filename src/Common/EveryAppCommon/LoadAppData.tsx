import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseInit } from "../firebase/Firebase";
import { CheckAndClearAllLocalFileBeforeLoadApp } from "./AppUtils";
import { HandleVersionsFileAsync } from "./VersionsHandler";
import { DrawerParamList } from "../navigation/Navigator";
import { NetLord } from "./NetLord";
import { FetchRemoteConfigAsync } from "../RemoteConfig";
import { HandleStartupAlertAsync } from "./StartupAlert";
import { StorageKey_LastTimeCheckAndReloadAppConfig, StorageKey_ScreenToInit } from "../constants/AppConstants";
import { InitAptabase } from "./tracking/Tracking";
import { HandldAlertUpdateAppAsync } from "./HandleAlertUpdateApp";
import { initNotificationAsync } from "./Nofitication";
import { CheckIsDevAsync, IsDev } from "./IsDev";
import { InitUserIDAsync, UserID } from "./UserID";
import TelemetryDeck from "@telemetrydeck/sdk";
import { createTelemetryDeckClient } from "./TelemetryDeck/TelemetryDeck";
import { TELEMETRY_DECK_KEY } from "../../keys";
import { SetDateAsync_Now } from "./AsyncStorageUtils";
import { InitOneSignal } from "./OneSignal";
import { CheckAndInitAdmobAsync } from "./ads/Admob";

export type LoadAppDataResult = {
    categoryScreenToOpenFirst: keyof DrawerParamList | null,
    telemetryDeckClient: TelemetryDeck,
}

export async function LoadAppData(): Promise<LoadAppDataResult> {
    // firebase init

    FirebaseInit();

    // init net checker

    NetLord.InitAsync();

    // one signal

    InitOneSignal() // no depended

    // awaits

    const [
        _,
        __,
        successHandleAppConfig,
        successHandleFileVersions,
        categoryScreenToOpenFirst
    ] = await Promise.all([
        // cheat clear all local file
        CheckAndClearAllLocalFileBeforeLoadApp(), // no depended

        // user id
        InitUserIDAsync(), // no depended

        // handle: app config
        FetchRemoteConfigAsync(), // no depended

        // handle: versions file
        HandleVersionsFileAsync(), // no depended

        // load screen to open
        AsyncStorage.getItem(StorageKey_ScreenToInit),
    ])

    // save tick load latest config & version

    if (successHandleAppConfig && successHandleFileVersions) {
        SetDateAsync_Now(StorageKey_LastTimeCheckAndReloadAppConfig)
    }

    // check is dev 

    await CheckIsDevAsync() // (must after HandleAppConfigAsync)

    // init aptabase tracking

    InitAptabase() // (must after HandleAppConfigAsync & CheckIsDevAsync)

    // handl startup alert (must after HandleAppConfigAsync)

    await HandleStartupAlertAsync() // alert_priority 1 (doc) // (must after HandleAppConfigAsync)

    // handle alert update

    await HandldAlertUpdateAppAsync() // alert_priority 2 (doc) // (must after HandleAppConfigAsync)

    // init notifee

    await initNotificationAsync() // alert_priority 3 (doc) // no depended

    // init admob

    await CheckAndInitAdmobAsync() // alert_priority 4 (doc) // no depended

    // teleletry

    const telemetryDeckClient = createTelemetryDeckClient(TELEMETRY_DECK_KEY, UserID(), IsDev())

    // return

    return {
        categoryScreenToOpenFirst,
        telemetryDeckClient
    } as LoadAppDataResult
}