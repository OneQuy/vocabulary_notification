// NUMBER OF [CHANGE HERE]: 0
//
// Created 2023 (Coding Gooday)

import { StorageKey_LastAskForUpdateApp, StorageKey_PressUpdateObject } from '../App/Constants/StorageKey'
import { Alert, AlertButton, Platform } from "react-native"
import { GetDateAsync_IsValueNotExistedOrEqualOverDayFromNow, SetDateAsync_Now } from "./AsyncStorageUtils"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { RemoteConfig } from './SpecificType'
import { VersionAsNumber } from './CommonConstants'
import { OpenStoreAsync } from './SpecificUtils'
import { SetShowedAlertStartupOnSplashScreen } from './Components/SplashScreen'

const IsLog = false

export const HandleAlertUpdateAppAsync = async (config?: RemoteConfig) => {
    if (!config || !config.latestVersion) {
        if (IsLog)
            console.log('[AlertUpdate] NOT show cuz app config null')

        return
    }

    const data = Platform.OS === 'android' ? config.latestVersion.android : config.latestVersion.ios

    if (data.version <= VersionAsNumber) {
        if (IsLog)
            console.log('[AlertUpdate] NOT show cuz now is latest version', VersionAsNumber, 'config ver', data.version)

        return
    }

    if (data.required > VersionAsNumber) {
        data.forceUpdate = true
    }

    if (!data.forceUpdate) {
        const isValueNotExistedOrEqualOverDayFromNow = await GetDateAsync_IsValueNotExistedOrEqualOverDayFromNow(StorageKey_LastAskForUpdateApp, data.dayDiffToAsk)

        if (!isValueNotExistedOrEqualOverDayFromNow) {
            if (IsLog)
                console.log('[AlertUpdate] NOT show cuz aksed recently')

            return
        }

        SetDateAsync_Now(StorageKey_LastAskForUpdateApp)
    }

    // show!

    SetShowedAlertStartupOnSplashScreen()

    let releaseNote = data.releaseNote

    if (releaseNote) {
        releaseNote = releaseNote.replaceAll('@', '\n')
    }

    await new Promise((resolve) => {
        const arrBtn: AlertButton[] = []

        if (!data.forceUpdate) {
            arrBtn.push({ // later btn
                text: 'Later',
                onPress: () => {
                    AsyncStorage.setItem(StorageKey_PressUpdateObject, JSON.stringify({
                        last_alert_tick: Date.now(),
                        last_alert_pressed: 'later',
                        last_alert_current: VersionAsNumber,
                        last_alert_config: data.version
                    }))

                    resolve(true)
                }
            })
        }

        arrBtn.push({ // update btn
            text: 'Update',
            onPress: () => {
                OpenStoreAsync()

                AsyncStorage.setItem(StorageKey_PressUpdateObject, JSON.stringify({
                    last_alert_tick: Date.now(),
                    last_alert_pressed: 'update',
                    last_alert_current: VersionAsNumber,
                    last_alert_config: data.version
                }))

                if (!data.forceUpdate)
                    resolve(true)
            }
        })

        const content =
            '\n' +
            releaseNote +
            '\n' +
            "Please update the app to the latest version for the best experience."

        Alert.alert(
            "New version is available!" + ' (v' + data.version + ')',
            content,
            arrBtn,
            {
                cancelable: false, // android
            }
        )
    })
}