import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useMemo } from 'react'
import { SettingItemPanelStyle } from '../Components/SettingItemPanel'
import useLocalText from '../Hooks/useLocalText'
import { Gap, Outline } from '../Constants/Constants_Outline'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { Color_BG, Color_Text } from '../Hooks/useTheme'
import { FontSize } from '../Constants/Constants_FontSize'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import usePremium, { AllIAPProducts } from '../Hooks/usePremium'
import { useMyIAP } from '../../Common/IAP/useMyIAP'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StorageKey_CachedIAP } from '../Constants/StorageKey'

const About = () => {
    const texts = useLocalText()
    const { isLifetime, set_lifetimeID } = usePremium()

    const { isReadyPurchase, localPrice } = useMyIAP(
        AllIAPProducts,
        async (s: string) => AsyncStorage.setItem(StorageKey_CachedIAP, s),
        async () => AsyncStorage.getItem(StorageKey_CachedIAP),
        AllIAPProducts[0]
    )

    console.log(localPrice, isReadyPurchase);

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { flex: 1 },
            scrollView: { gap: Gap.Normal, padding: Outline.Normal, },
            normalBtnTxt: { fontSize: FontSize.Normal, },

            normalBtn: {
                borderWidth: 0,
                borderRadius: BorderRadius.Small,
                maxWidth: '50%',
                alignSelf: 'center',
                padding: Outline.Normal,
            },
        })
    }, [])

    return (
        <View style={style.master}>
            <ScrollView style={style.scrollView}>
                {/* lifetime upgrade */}
                {
                    !isLifetime &&
                    <View style={SettingItemPanelStyle.master_Column}>
                        {/* title */}
                        <Text style={SettingItemPanelStyle.titleTxt}>{texts.vocaby_lifetime}</Text>

                        {/* explain */}
                        <Text style={SettingItemPanelStyle.explainTxt}>{texts.vocaby_lifetime_explain}</Text>

                        {/* btn */}
                        <LucideIconTextEffectButton
                            selectedBackgroundColor={Color_Text}
                            selectedColorOfTextAndIcon={Color_BG}

                            notChangeToSelected
                            manuallySelected={true}
                            canHandlePressWhenSelected

                            style={style.normalBtn}

                            title={texts.upgrade}
                            titleProps={{ style: style.normalBtnTxt }}

                        // onPress={() => set_handlingType(undefined)}
                        />
                    </View>
                }
            </ScrollView>
        </View>
    )
}

export default About