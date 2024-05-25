import { View, Text, StyleSheet, ColorValue, TouchableOpacity, Dimensions, Linking, Platform, Animated, Share, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DownloadFile_GetJsonAsync, ReadJsonFileAsync } from './../FileUtils'
import { AnimatedSimpleSpring, AnimatedSimpleTiming, ShuffleArray, TempDirName, ToCanPrint } from './../UtilsTS'
import { GetStaticFileUrl } from '../RemoteConfig'
import ImageBackgroundOrView from './ImageBackgroundOrView'

const IsLog = true

const JsonUrl = 'https://firebasestorage.googleapis.com/v0/b/onequyappgeneral.appspot.com/o/onequy_apps.json?alt=media&token=f674f251-106d-45b3-97d9-365f7cd6e6a7'

const Window = Dimensions.get('window')

const BorderRadius = Window.height * 0.02

const Padding = Window.height * 0.008

type OneQuyAppData = {
    appName: string,
    description: string,
    logo: string,
    android: string,
    ios: string,
}

var cachedJson: undefined | OneQuyAppData[] = undefined
var cachedCurrentAppIdx = 0

const OneQuyApp = ({
    excludeAppName,
    primaryColor = '#1c1c1c',
    counterPrimaryColor = '#fafafa',
    counterBackgroundColor = '#C1C1C1',
    backgroundColor = '#fafafa',
    fontSize = 13,
    onEvent = undefined,
}: {
    excludeAppName: string,
    primaryColor?: ColorValue
    counterPrimaryColor?: ColorValue
    counterBackgroundColor?: ColorValue
    backgroundColor?: ColorValue,
    fontSize?: number,
    onEvent?: (event: string, currentApp: string) => void,
}) => {
    const [listApps, set_listApps] = useState<undefined | OneQuyAppData[]>(undefined)

    const [currentAppIdx, set_currentAppIdx] = useState(cachedCurrentAppIdx)
    cachedCurrentAppIdx = currentAppIdx

    const logoAnimated = useRef(new Animated.Value(0)).current
    const titleAnimated = useRef(new Animated.Value(0)).current
    const descriptionAnimated = useRef(new Animated.Value(0)).current

    const currentApp: OneQuyAppData | undefined = useMemo(() => {
        if (!listApps || listApps.length <= 0)
            return undefined

        if (currentAppIdx < listApps.length)
            return listApps[currentAppIdx]
        else {
            cachedCurrentAppIdx = 0
            set_currentAppIdx(0)
            return listApps[0]
        }
    }, [listApps, currentAppIdx])

    const style = useMemo(() => {
        return StyleSheet.create({
            master: {
                width: '100%',
                backgroundColor: backgroundColor,
                gap: Padding,
            },

            titleView: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            },

            titleTxt: {
                // padding: Padding,
                fontSize: fontSize * 1.5,
                color: primaryColor,
                fontWeight: 'bold',
                flex: 1,
            },

            shareTO: {
                flex: 1,
                padding: Padding,
                borderColor: primaryColor,
                borderWidth: StyleSheet.hairlineWidth,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: BorderRadius,
            },

            installTO: {
                flex: 1,
                padding: Padding,
                backgroundColor: primaryColor,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: BorderRadius,
            },

            installTxt: {
                fontSize,
                color: counterPrimaryColor,
            },

            nextTO: {
                padding: Padding,
                // width: '20%',
                borderColor: counterBackgroundColor,
                borderWidth: StyleSheet.hairlineWidth,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: BorderRadius,
            },

            nextTxt: {
                fontSize,
                color: counterBackgroundColor,
            },

            descriptionTxt: {
                fontSize,
                color: counterBackgroundColor,
                // textAlign:'justify'
            },

            descriptionView: {
                flexDirection: 'row',
                gap: Window.height * 0.01,
                justifyContent: 'space-between',
                alignItems: 'center',
            },

            logoImg: {
                height: Window.height * 0.08,
                aspectRatio: 1,
                borderRadius: BorderRadius,
                overflow: 'hidden',
            },

            descriptionTxtView: {
                flex: 1,
                // backgroundColor: '#aaffee',
            },

        })
    }, [
        backgroundColor,
        counterBackgroundColor,
        primaryColor,
        counterPrimaryColor,
        fontSize,
    ])

    const onPressNextApp = useCallback(async () => {
        if (!listApps || listApps.length <= 0)
            return

        set_currentAppIdx(t => (t < listApps.length - 1) ? t + 1 : 0)

        if (onEvent && currentApp)
            onEvent('press_next_app', currentApp.appName)
    }, [listApps, onEvent, currentApp])

    const onPressShare = useCallback(async () => {
        if (!currentApp)
            return

        if (onEvent)
            onEvent('press_share', currentApp.appName)

        Share.share({
            title: `Check out ${currentApp.appName}!`,
            message:
                `⭐️ Check out ${currentApp.appName}!

${currentApp.description}

🔥 Download now!

👉 AppStore: ${currentApp.ios}

👉 GooglePlay: ${currentApp.android}`,
        })
    }, [currentApp, onEvent])

    const onPressInstall = useCallback(async () => {
        if (!currentApp)
            return

        if (onEvent)
            onEvent('press_install', currentApp.appName)

        if (Platform.OS === 'android')
            Linking.openURL(currentApp.android)
        else
            Linking.openURL(currentApp.ios)
    }, [currentApp, onEvent])

    const checkDownloadJson = useCallback(async () => {
        if (cachedJson) {
            if (IsLog)
                console.log('[OneQuyApp-checkDownloadJson] cached');

            set_listApps(cachedJson)

            set_currentAppIdx(t => (cachedJson && t < cachedJson.length - 1) ? t + 1 : 0)

            return
        }

        if (IsLog)
            console.log('[OneQuyApp-checkDownloadJson] downloading...');

        const file = GetStaticFileUrl('onequyApps', JsonUrl)
        // console.log(file);

        const jsonRes = await DownloadFile_GetJsonAsync(
            file,
            TempDirName + '/onequy_apps.json',
            true,
            false
        )

        if (onEvent)
            onEvent('downloaded' + (jsonRes.json !== null ? '_success' : '_fail'), '')

        if (IsLog) {
            console.log(
                '[OneQuyApp-checkDownloadJson] downloaded success:',
                jsonRes.json !== null,
                'error',
                ToCanPrint(jsonRes.error)
            )
        }

        if (!jsonRes.json) {
            const arr = await ReadJsonFileAsync<OneQuyAppData[]>(TempDirName + '/onequy_apps.json', true)
            const isArray = Array.isArray(arr)

            if (IsLog) {
                console.log(
                    '[OneQuyApp-checkDownloadJson] loaded from local success:',
                    isArray
                )
            }

            if (onEvent)
                onEvent('loaded_local' + (isArray ? '_success' : '_fail'), '')

            if (isArray) {
                jsonRes.json = arr
            }
        }

        if (jsonRes.json) {
            // cachedJson = jsonRes.json as OneQuyAppData[]
            cachedJson = (jsonRes.json as OneQuyAppData[]).filter(i => i.appName !== excludeAppName)

            ShuffleArray(cachedJson)
            set_listApps(cachedJson)
        }
    }, [onEvent])

    useEffect(() => {
        if (!currentApp) {
            return
        }

        // title

        AnimatedSimpleTiming(titleAnimated, 700)

        // logo

        AnimatedSimpleSpring(logoAnimated, 0)

        // description

        AnimatedSimpleSpring(descriptionAnimated, 200)
    }, [currentApp])

    useEffect(() => {
        if (onEvent)
            onEvent('appear', '')

        checkDownloadJson()
    }, [])

    if (!currentApp) {
        return (
            <View style={style.master}>
                <ActivityIndicator color={primaryColor} />
            </View>
        )
    }

    return (
        <View style={style.master}>
            {/* title */}
            <View style={style.titleView}>
                <Animated.Text adjustsFontSizeToFit numberOfLines={1} style={[style.titleTxt, { opacity: titleAnimated }]}>{currentApp.appName}</Animated.Text>
                {/* go next btn */}
                {
                    listApps && listApps.length > 1 &&
                    <TouchableOpacity onPress={onPressNextApp} style={style.nextTO}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={style.nextTxt}>{`Next app ${currentAppIdx + 1}/${listApps.length}`}</Text>
                    </TouchableOpacity>
                }
            </View>

            {/* description */}
            <View style={style.descriptionView}>
                {/* logo */}
                <Animated.View style={{ transform: [{ scale: logoAnimated }] }}>
                    <ImageBackgroundOrView
                        source={{ uri: currentApp.logo }}
                        style={style.logoImg}
                    />
                </Animated.View>

                {/* description */}
                <Animated.View style={[style.descriptionTxtView, { transform: [{ scale: descriptionAnimated }] }]}>
                    <Text style={style.descriptionTxt}>{currentApp.description}</Text>
                </Animated.View>
            </View>

            <View style={style.descriptionView}>
                {/* share btn */}
                <TouchableOpacity onPress={onPressShare} style={style.shareTO}>
                    <Text style={style.nextTxt}>{'Share'}</Text>
                </TouchableOpacity>

                {/* install btn */}
                <TouchableOpacity onPress={onPressInstall} style={style.installTO}>
                    <Text style={style.installTxt}>{'Install'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default OneQuyApp