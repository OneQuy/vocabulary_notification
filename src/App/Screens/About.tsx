import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useMemo } from 'react'
import { SettingItemPanelStyle } from '../Components/SettingItemPanel'
import useLocalText from '../Hooks/useLocalText'
import { Gap, Outline } from '../Constants/Constants_Outline'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { Color_Text } from '../Hooks/useTheme'
import { FontSize } from '../Constants/Constants_FontSize'
import { BorderRadius } from '../Constants/Constants_BorderRadius'

const About = () => {
    const texts = useLocalText()

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { flex: 1 },
            scrollView: { gap: Gap.Normal, padding: Outline.Normal, },
            normalBtnTxt: { fontSize: FontSize.Normal, },

            normalBtn: {
                borderWidth: 0,
                borderRadius: BorderRadius.Medium,
                maxWidth: '50%',
                alignSelf: 'center',
                padding: Outline.Normal,
                flexDirection: 'row',
                gap: Gap.Normal,
                flex: 1,
            },
        })
    }, [])

    return (
        <View style={style.master}>
            <ScrollView style={style.scrollView}>
                {/* lifetime upgrade */}
                {
                    <View style={SettingItemPanelStyle.master_Column}>
                        {/* title */}
                        <Text style={SettingItemPanelStyle.titleTxt}>{texts.vocaby_lifetime}</Text>

                        {/* explain */}
                        <Text style={SettingItemPanelStyle.explainTxt}>{texts.vocaby_lifetime_explain}</Text>

                        {/* btn */}
                        <LucideIconTextEffectButton
                            unselectedColorOfTextAndIcon={Color_Text}

                            // notChangeToSelected
                            // manuallySelected={false}
                            // canHandlePressWhenSelected

                            style={style.normalBtn}

                            title={texts.upgrade}
                            titleProps={{ style: style.normalBtnTxt }}

                            // onPress={() => set_handlingType(undefined)}

                            backgroundImageProps={{ source: { uri: 'https://www.shutterstock.com/image-photo/dark-grainy-color-gradient-wave-600nw-2287686131.jpg'}}}
                        />
                    </View>
                }
            </ScrollView>
        </View>
    )
}

export default About