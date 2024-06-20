import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, StyleProp, TextStyle } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SettingItemPanelStyle } from '../Components/SettingItemPanel'
import useLocalText from '../Hooks/useLocalText'
import { Gap, Outline } from '../Constants/Constants_Outline'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { Color_BG, Color_BG2, Color_Text } from '../Hooks/useTheme'
import { FontSize } from '../Constants/Constants_FontSize'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { useMyIAP } from '../../Common/IAP/useMyIAP'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StorageKey_CachedIAP } from '../Constants/StorageKey'
import { IAPProduct, PurchaseAsync, RestorePurchaseAsync } from '../../Common/IAP/IAP'
import { CalculateSalePercentage, IsValuableArrayOrString, SafeGetArrayElement, SafeParseFloat, ToCanPrintError } from '../../Common/UtilsTS'
import { HandleError, TrackOneQuyApps } from '../../Common/Tracking'
import { Purchase } from 'react-native-iap'
import { GetRemoteConfigWithCheckFetchAsync } from '../../Common/RemoteConfig'
import { AllIAPProducts, AppContext, AppName, IapProductMax } from '../../Common/SpecificConstants'
import OneQuyApp from '../../Common/Components/OneQuyApp'
import { CheckTapSetDevPersistence, IsDev } from '../../Common/IsDev'
import { VersionAsNumber } from '../../Common/CommonConstants'
import Clipboard from '@react-native-clipboard/clipboard'
import { UserID } from '../../Common/UserID'
import WealthText, { WealthTextConfig } from '../../Common/Components/WealthText'

const About = () => {
    const texts = useLocalText()
    const [isHandling, set_isHandling] = useState(false)
    const { subscribedData, onSetSubcribeDataAsync } = useContext(AppContext)

    const [currentLifetimeProduct, set_currentLifetimeProduct] = useState<undefined | IAPProduct>(undefined)

    const { isReadyPurchase, localPrice, initErrorObj, fetchedProducts, fetchedTargetProduct } = useMyIAP(
        AllIAPProducts,
        async (s: string) => AsyncStorage.setItem(StorageKey_CachedIAP, s),
        async () => AsyncStorage.getItem(StorageKey_CachedIAP),
        currentLifetimeProduct
    )

    const discountTxts: undefined | { maxPriceTxt: string, percentDiscountTxt: string } = useMemo(() => {
        if (!currentLifetimeProduct ||
            currentLifetimeProduct.sku === IapProductMax.sku ||
            !fetchedTargetProduct ||
            !IsValuableArrayOrString(fetchedProducts)
        ) {
            return
        }

        const fetchedMax = fetchedProducts.find(iap => iap.productId === IapProductMax.sku)

        if (!fetchedMax)
            return

        const priceMaxOrNaN = SafeParseFloat(fetchedMax.price)

        const localPriceMax = fetchedMax.localizedPrice

        const currentPriceOrNaN = SafeParseFloat(fetchedTargetProduct.price)

        if (isNaN(priceMaxOrNaN) || isNaN(currentPriceOrNaN))
            return

        const percent = CalculateSalePercentage(priceMaxOrNaN, currentPriceOrNaN)

        // console.log(percent, priceMaxOrNaN, currentPriceOrNaN)

        return {
            percentDiscountTxt: percent.toFixed(),
            maxPriceTxt: localPriceMax,
        }
    }, [fetchedProducts, fetchedTargetProduct, currentLifetimeProduct])

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { flex: 1, },
            scrollView: { gap: Gap.Normal, padding: Outline.Normal, },

            priceView: { flexDirection: 'row' },

            normalBtnTxt: { fontSize: FontSize.Normal, },

            purchaseBtn: {
                borderWidth: 0,
                borderRadius: BorderRadius.Small,
                maxWidth: '50%',
                alignSelf: 'center',
                padding: Outline.Normal,
            },

            crossOriginPriceTxt: Object.assign(
                {},
                SettingItemPanelStyle.explainTxt,
                {
                    textDecorationLine: 'line-through'
                } as StyleProp<TextStyle>
            ),

            restoreBtn: {
                borderWidth: 0,
                borderRadius: BorderRadius.Small,
                padding: Outline.Small,
            },
        })
    }, [SettingItemPanelStyle])

    const renderPriceLine = useCallback(() => {
        const arr: WealthTextConfig[] = [
            {
                text: `${texts.current_price}: ${localPrice ?? '...'}`,
                textStyle: SettingItemPanelStyle.explainTxt,
            }
        ]

        if (discountTxts) {
            // percent

            arr.push({
                text: ` (-${discountTxts.percentDiscountTxt}%, `,
                textStyle: SettingItemPanelStyle.explainTxt,
            })

            // origin price

            arr.push({
                text: discountTxts.maxPriceTxt,
                textStyle: style.crossOriginPriceTxt
            })

            // close bracket

            arr.push({
                text: ')',
                textStyle: SettingItemPanelStyle.explainTxt,
            })
        }

        return (
            <WealthText textConfigs={arr} />
        )
    }, [discountTxts, localPrice, texts, SettingItemPanelStyle, style])

    const onPurchasedSuccessAsync = useCallback(async (sku: string) => {
        await onSetSubcribeDataAsync({
            id: sku,
            purchasedTick: Date.now()
        })
    }, [texts, onSetSubcribeDataAsync])

    const onPressRestorePurchaseAsync = useCallback(async () => {
        set_isHandling(true)

        const products = await RestorePurchaseAsync()

        // LogStringify(products)

        if (Array.isArray(products)) { // available products to restore
            const firstProduct = SafeGetArrayElement<Purchase>(products)

            if (firstProduct)
                onPurchasedSuccessAsync(firstProduct.productId)
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
    }, [texts, onPurchasedSuccessAsync])

    const onPressCheatCopyUserId = useCallback(() => {
        Clipboard.setString(UserID())
    }, [])

    const onPressCheatSetDev = useCallback(() => {
        const didSet = CheckTapSetDevPersistence()

        if (didSet)
            Alert.alert('dev!')
    }, [])

    const onPressUpgradeAsync = useCallback(async () => {
        if (isHandling || !isReadyPurchase || !currentLifetimeProduct)
            return

        set_isHandling(true)

        const res = await PurchaseAsync(currentLifetimeProduct.sku)

        if (res === undefined) { // success
            await onPurchasedSuccessAsync(currentLifetimeProduct.sku)
        }

        else if (res === null) { } // user canceled

        else { // error
            HandleError(res, 'BuyLifetime', true)
        }

        set_isHandling(false)
    }, [
        onPurchasedSuccessAsync,
        isHandling,
        isReadyPurchase,
        currentLifetimeProduct,
    ])

    useEffect(() => {
        (async () => {
            set_isHandling(true)

            // fetch premium product id

            const config = await GetRemoteConfigWithCheckFetchAsync(false)

            let premiumProduct: IAPProduct | undefined = (AllIAPProducts && AllIAPProducts.length > 1) ?
                AllIAPProducts[1] :
                AllIAPProducts[0]

            if (config) {
                const found = AllIAPProducts.find(i => i.sku === config.currentLifetimeId)

                if (found)
                    premiumProduct = found
            }

            set_currentLifetimeProduct(premiumProduct)
            set_isHandling(false)
        })()
    }, [])

    return (
        <View style={style.master}>
            <ScrollView contentContainerStyle={style.scrollView}>
                {/* lifetime upgrade */}
                {
                    !subscribedData &&
                    <View style={SettingItemPanelStyle.master_Column}>
                        {/* title */}
                        <Text style={SettingItemPanelStyle.titleTxt}>{texts.vocaby_lifetime}</Text>

                        {/* explain */}
                        <Text style={SettingItemPanelStyle.explainTxt}>{texts.vocaby_lifetime_explain}</Text>

                        {/* price */}
                        {
                            renderPriceLine()
                        }

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
                    !subscribedData &&
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

                {/* onequy apps */}
                <View style={SettingItemPanelStyle.master_Column}>
                    {/* title */}
                    <Text onPress={IsDev() ? onPressCheatSetDev : undefined} style={SettingItemPanelStyle.titleTxt}>{texts.onequy_apps}:</Text>

                    <OneQuyApp
                        onEvent={TrackOneQuyApps}
                        excludeAppName={AppName}
                        primaryColor={Color_Text}
                        counterPrimaryColor={Color_BG}
                        backgroundColor={Color_BG2}
                        counterBackgroundColor={Color_Text}
                        fontSize={FontSize.Small}
                    />
                </View>

                {/* version */}
                <Text onPress={IsDev() ? onPressCheatCopyUserId : undefined} style={SettingItemPanelStyle.explainTxt}>Version: v{VersionAsNumber}</Text>
            </ScrollView>
        </View>
    )
}

export default About