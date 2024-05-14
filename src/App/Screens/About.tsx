import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
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
import { PurchaseAsync } from '../../Common/IAP/IAP'
import { LogStringify, ToCanPrintError } from '../../Common/UtilsTS'
import { HandleError } from '../../Common/Tracking'

const About = () => {
    const texts = useLocalText()
    const { isLifetime, set_lifetimeID } = usePremium()
    const [isHandling, set_isHandling] = useState(false)
    const [currentLifetimeProduct, set_currentLifetimeProduct] = useState(AllIAPProducts[0])

    const { isReadyPurchase, localPrice, initErrorObj } = useMyIAP(
        AllIAPProducts,
        async (s: string) => AsyncStorage.setItem(StorageKey_CachedIAP, s),
        async () => AsyncStorage.getItem(StorageKey_CachedIAP),
        currentLifetimeProduct
    )

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

    const onPressUpgrade = useCallback(async () => {
        if (isHandling || !isReadyPurchase)
            return

        set_isHandling(true)

        const res = await PurchaseAsync(currentLifetimeProduct.sku)

        LogStringify(res)

        if (res === undefined) { // success
            set_lifetimeID(currentLifetimeProduct.sku)

            Alert.alert('Woohooo!', texts.purchase_success)
        }

        else if (res === null) { // user canceled

        }

        else { // error
            HandleError(res, 'BuyLifetime', true)
        }

        set_isHandling(false)
    }, [
        isHandling,
        isReadyPurchase,
        currentLifetimeProduct,
        set_lifetimeID,
        texts
    ])

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
                        <Text style={SettingItemPanelStyle.explainTxt}>{`${texts.current_price}: ${localPrice ?? '...'}`}</Text>

                        {/* isHandling */}
                        {
                            isHandling &&
                            <ActivityIndicator color={Color_Text} />
                        }

                        {/* erroring */}
                        {
                            !isReadyPurchase &&
                            <Text style={SettingItemPanelStyle.explainTxt}>
                                {
                                    '[Not ready to purchase]' +
                                    (initErrorObj === undefined ? '' : ` ${ToCanPrintError(initErrorObj)}`)
                                }
                            </Text>
                        }

                        {/* btn upgrade*/}
                        {
                            !isHandling && isReadyPurchase &&
                            <LucideIconTextEffectButton
                                selectedBackgroundColor={Color_Text}
                                selectedColorOfTextAndIcon={Color_BG}

                                notChangeToSelected
                                manuallySelected={true}
                                canHandlePressWhenSelected

                                style={style.normalBtn}

                                title={texts.upgrade}
                                titleProps={{ style: style.normalBtnTxt }}

                                onPress={onPressUpgrade}
                            />
                        }
                    </View>
                }
            </ScrollView>
        </View>
    )
}

export default About