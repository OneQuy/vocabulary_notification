// NUMBER OF [CHANGE HERE]: 2

import { View, Text, Image, StatusBar, StatusBarStyle, ColorValue } from 'react-native'
import React from 'react'
import { WindowSize_Max } from '../CommonConstants';
import { Color_Logo, Color_Text } from '../../App/Hooks/useTheme';

// CHANGE HERE 1 (just need add logo.png to folder)
export const logoScr = require('../../../assets/images/logo.png')

const logoSize = WindowSize_Max * 0.13

const SplashScreen = (
    // { theme }: { theme: ThemeColor }
) => {
    // CHANGE HERE 2

    const bgColor: ColorValue = Color_Logo
    const textColor: ColorValue = Color_Text
    const barStyle: StatusBarStyle = 'light-content'
    const appName: string | undefined = undefined
    const slogan: string | undefined = undefined

    // render

    return (
        <View style={{ backgroundColor: bgColor, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <StatusBar backgroundColor={bgColor} barStyle={barStyle} />

            <Image source={logoScr} resizeMode='contain' style={{ height: logoSize, aspectRatio: 1 }} />

            {
                appName &&
                <Text style={{ color: textColor, fontWeight: 'bold', marginTop: 10, fontSize: 20 }}>{appName}</Text>
            }

            {
                slogan &&
                <Text style={{ color: textColor, fontSize: 15 }}>{slogan}</Text>
            }
        </View>
    )
}

export default SplashScreen