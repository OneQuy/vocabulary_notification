import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { PurchaseAsync, RestorePurchaseAsync } from '../../Common/IAP/IAP'
import { LogStringify, SafeGetArrayElement, ToCanPrintError } from '../../Common/UtilsTS'
import { HandleError } from '../../Common/Tracking'
import { Purchase } from 'react-native-iap'
import { GetRemoteConfigWithCheckFetchAsync } from '../../Common/RemoteConfig'

const About = () => {
    const texts = useLocalText()
    const { isLifetime, set_lifetimeID } = usePremium()
    const [isHandling, set_isHandling] = useState(false)

    const [currentLifetimeProduct, set_currentLifetimeProduct] = useState(
        (AllIAPProducts && AllIAPProducts.length > 1) ?
            AllIAPProducts[1] :
            AllIAPProducts[0]
    )

    const { isReadyPurchase, localPrice, initErrorObj } = useMyIAP(
        AllIAPProducts,
        async (s: string) => AsyncStorage.setItem(StorageKey_CachedIAP, s),
        async () => AsyncStorage.getItem(StorageKey_CachedIAP),
        currentLifetimeProduct
    )

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { flex: 1, },
            scrollView: { gap: Gap.Normal, padding: Outline.Normal, },

            normalBtnTxt: { fontSize: FontSize.Normal, },

            purchaseBtn: {
                borderWidth: 0,
                borderRadius: BorderRadius.Small,
                maxWidth: '50%',
                alignSelf: 'center',
                padding: Outline.Normal,
            },

            restoreBtn: {
                borderWidth: 0,
                borderRadius: BorderRadius.Small,
                padding: Outline.Small,
            },
        })
    }, [])

    const onPurchasedSuccess = useCallback(async (sku: string) => {
        set_lifetimeID(sku)
        Alert.alert('Woohooo!', texts.purchase_success)
    }, [texts, set_lifetimeID])

    const onPressRestorePurchaseAsync = useCallback(async () => {
        set_isHandling(true)

        const products = await RestorePurchaseAsync()

        // LogStringify(products)

        if (Array.isArray(products)) { // available products to restore
            const firstProduct = SafeGetArrayElement<Purchase>(products)

            if (firstProduct)
                onPurchasedSuccess(firstProduct.productId)
            else
                Alert.alert(
                    texts.popup_error,
                    texts.restore_purchase_no_products +
                    (products.length > 0 ? '\n\n' + ToCanPrintError(products) : ''))
        }
        else if (products !== null) {
            Alert.alert(texts.popup_error, texts.restore_purchase_no_products + '\n\n' + ToCanPrintError(products))
        }

        set_isHandling(false)
    }, [texts, onPurchasedSuccess])

    const onPressUpgradeAsync = useCallback(async () => {
        if (isHandling || !isReadyPurchase)
            return

        set_isHandling(true)

        const res = await PurchaseAsync(currentLifetimeProduct.sku)

        // LogStringify(res)

        if (res === undefined) { // success
            onPurchasedSuccess(currentLifetimeProduct.sku)
        }

        else if (res === null) { } // user canceled

        else { // error
            HandleError(res, 'BuyLifetime', true)
        }

        set_isHandling(false)
    }, [
        onPurchasedSuccess,
        isHandling,
        isReadyPurchase,
        currentLifetimeProduct,
    ])

    useEffect(() => {
        (async () => {
            // fetch premium product id

            const config = await GetRemoteConfigWithCheckFetchAsync(false)

            if (!config)
                return

            const premiumProduct = AllIAPProducts.find(i => i.sku === config.currentLifetimeId)

            if (!premiumProduct)
                return

            set_currentLifetimeProduct(premiumProduct)
        })()
    }, [])

    return (
        <View style={style.master}>
            <ScrollView contentContainerStyle={style.scrollView}>
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

                                style={style.purchaseBtn}

                                title={texts.upgrade}
                                titleProps={{ style: style.normalBtnTxt }}

                                onPress={onPressUpgradeAsync}
                            />
                        }
                    </View>
                }

                {/* restore purchase */}
                {
                    !isLifetime &&
                    <View style={SettingItemPanelStyle.master}>
                        {/* title */}
                        <Text style={SettingItemPanelStyle.titleTxt}>{texts.restore_purchase}</Text>

                        {/* isHandling */}
                        {
                            isHandling &&
                            <ActivityIndicator color={Color_Text} />
                        }

                        {/* btn restore */}
                        {
                            !isHandling &&
                            <LucideIconTextEffectButton
                                unselectedColorOfTextAndIcon={Color_Text}

                                notChangeToSelected
                                manuallySelected={false}

                                style={style.restoreBtn}

                                title={texts.restore}
                                titleProps={{ style: style.normalBtnTxt }}

                                onPress={onPressRestorePurchaseAsync}
                            />
                        }
                    </View>
                }
            </ScrollView>
        </View>
    )
}

export default About