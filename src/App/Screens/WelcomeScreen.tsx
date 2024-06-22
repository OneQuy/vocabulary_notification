import { View, Text, StyleSheet } from 'react-native'
import React, { useMemo } from 'react'
import { FontSize } from '../Constants/Constants_FontSize'
import { Color_Text } from '../Hooks/useTheme'
import ScaleUpView from '../../Common/Components/Effects/ScaleUpView'

const WelcomeScreen = () => {

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { flex: 1 },
            welcomeTxt: { fontSize: FontSize.Big, color: Color_Text },
        })
    }, [])

    return (
        <View key={2} style={style.master}>
            <ScaleUpView duration={200}>
                <Text style={style.welcomeTxt}>WelcomeScreen</Text>
            </ScaleUpView>
        </View>
    )
}

export default WelcomeScreen