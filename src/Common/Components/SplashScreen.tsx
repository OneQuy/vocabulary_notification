// NUMBER OF [CHANGE HERE]: 1

import { View, Text, Image, StatusBar, StatusBarStyle, ColorValue } from 'react-native'
import React, { useEffect } from 'react'
import { LogoScr, WindowSize_Max } from '../CommonConstants';
import { Color_Logo, Color_Text } from '../../App/Hooks/useTheme';
import HoldOn from './HoldOn';

const logoSize = WindowSize_Max * 0.13

var splashTime = 0
var showedAlertStartup = false

export const SetShowedAlertStartupOnSplashScreen = () => {
    showedAlertStartup = true
}

export const GetSplashTime = () => showedAlertStartup ? undefined : splashTime

const SplashScreen = (
    // { theme }: { theme: ThemeColor }
) => {
    // CHANGE HERE 1

    const bgColor: ColorValue = Color_Logo
    const textColor: ColorValue = Color_Text
    const holdOnColor: ColorValue = Color_Text
    const barStyle: StatusBarStyle = 'light-content'
    const appName: string | undefined = undefined
    const slogan: string | undefined = undefined

    useEffect(() => {
        const now = Date.now()

        return () => {
            splashTime = Date.now() - now
        }
    }, [])

    // render

    return (
        <View style={{ backgroundColor: bgColor, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <StatusBar backgroundColor={bgColor} barStyle={barStyle} />

            <Image source={LogoScr} resizeMode='contain' style={{ height: logoSize, aspectRatio: 1 }} />

            {
                appName &&
                <Text style={{ color: textColor, fontWeight: 'bold', marginTop: 10, fontSize: 20 }}>{appName}</Text>
            }

            {
                slogan &&
                <Text style={{ color: textColor, fontSize: 15 }}>{slogan}</Text>
            }

            <HoldOn color={holdOnColor} />
        </View>
    )
}

export default SplashScreen