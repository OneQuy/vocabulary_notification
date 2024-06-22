import { View, Text, StyleSheet } from 'react-native'
import React, { useMemo } from 'react'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import { Color_Text } from '../Hooks/useTheme'
import ScaleUpView from '../../Common/Components/Effects/ScaleUpView'
import useLocalText from '../Hooks/useLocalText'
import { CommonStyles } from '../../Common/CommonConstants'
import WealthText from '../../Common/Components/WealthText'
import { AppName } from '../../Common/SpecificConstants'

const WelcomeScreen = () => {
    const texts = useLocalText()

    const style = useMemo(() => {
        return StyleSheet.create({
            // master: { flex: 1 },
            row: { flexDirection: 'row' },
            welcomeTxt: { fontSize: FontSize.Big, color: Color_Text },
            appNameTxt: { fontSize: FontSize.Big, color: Color_Text, fontWeight: FontBold.BoldMore, },
        })
    }, [])

    return (
        <View
            key={1}
            style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}
        >
            {/* welcome */}
            <ScaleUpView isSpringOrTiming>
                <WealthText
                    textConfigs={[
                        {
                            text: texts.welcome,
                            textStyle: style.welcomeTxt,
                        },
                        {
                            text: AppName + '!',
                            textStyle: style.appNameTxt,
                        }
                    ]}
                />
            </ScaleUpView>
        </View>
    )
}

export default WelcomeScreen