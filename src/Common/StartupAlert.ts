import AsyncStorage from "@react-native-async-storage/async-storage"
import { GetAppConfig } from "./AppConfigHandler"
import { OpenStore, versionAsNumber } from "./AppUtils"
import { LocalText, StorageKey_StartupAlertID } from "../constants/AppConstants"
import { Alert, AlertButton, Linking } from "react-native"
import { RegexUrl } from "./UtilsTS"

const isLog = false

export const HandleStartupAlertAsync = async () => {
    const config = GetAppConfig()

    if (!config) {
        if (isLog)
            console.log('[HandleStartupAlert] NOT show cuz app config null')

        return
    }

    const data = config.startup_alert

    if (!data) {
        if (isLog)
            console.log('[HandleStartupAlert] NOT show cuz config alert null')

        return
    }

    const maxVersion = typeof data.max_version === 'number' ? data.max_version : 0

    if (versionAsNumber > maxVersion) {
        if (isLog)
            console.log('[HandleStartupAlert] NOT show cuz version above config')

        return
    }

    const lastShowId = await AsyncStorage.getItem(StorageKey_StartupAlertID)

    if (lastShowId === data.id && data.allow_enter_app) {
        if (isLog)
            console.log('[HandleStartupAlert] NOT show cuz same ID')

        return
    }

    if (!data.content || data.content.trim().length <= 0) {
        if (isLog)
            console.log('[HandleStartupAlert] NOT show cuz no content')

        return
    }

    // show!

    AsyncStorage.setItem(StorageKey_StartupAlertID, data.id)

    const hasLinkBtn = RegexUrl(data.button_link)
    const hasUpdateBtn = data.show_update_button

    await new Promise((resolve) => {
        const arrBtn: AlertButton[] = []

        if (hasLinkBtn) {
            arrBtn.push({
                text: data.button_link_title && data.button_link_title.length > 0 ? data.button_link_title : LocalText.learn_more,
                onPress: () => {
                    Linking.openURL(data.button_link)

                    if (data.allow_enter_app)
                        resolve(true)
                }
            })
        }

        if (hasUpdateBtn) {
            arrBtn.push({
                text: LocalText.update,
                onPress: () => {
                    OpenStore()

                    if (data.allow_enter_app)
                        resolve(true)
                }
            })
        }

        if (arrBtn.length < 2 && data.allow_enter_app) {
            const subBtn = {
                text: data.ok_title && data.ok_title.length > 0 ? data.ok_title : 'Later',
                onPress: () => resolve(true)
            }

            if (hasUpdateBtn)
                arrBtn.unshift(subBtn)
            else
                arrBtn.push(subBtn)
        }

        Alert.alert(
            data.title && data.title.length > 0 ? data.title : 'Gooday',
            data.content,
            arrBtn,
            {
                cancelable: false, // android
            }
        );
    })
}