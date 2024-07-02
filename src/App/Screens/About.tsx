import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, StyleProp, TextStyle } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SettingItemPanelStyle } from '../Components/SettingItemPanel'
import useLocalText from '../Hooks/useLocalText'
import { Gap, Outline } from '../Constants/Constants_Outline'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { Color_BG, Color_BG2, Color_Text, Color_Text2 } from '../Hooks/useTheme'
import { FontSize } from '../Constants/Constants_FontSize'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { useMyIAP } from '../../Common/IAP/useMyIAP'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StorageKey_CachedIAP } from '../Constants/StorageKey'
import { GetPercentDiscountTxtAndOriginLocalizedPriceTxt, IAPProduct, RestorePurchaseAsync } from '../../Common/IAP/IAP'
import { SafeDateString, SafeGetArrayElement, SafeValue, ToCanPrintError } from '../../Common/UtilsTS'
import { TrackOneQuyApps, TrackSimpleWithParam } from '../../Common/Tracking'
import { Purchase } from 'react-native-iap'
import { GetRemoteConfigWithCheckFetchAsync } from '../../Common/RemoteConfig'
import { AllIAPProducts, AppContext, AppName, IapProductMax } from '../../Common/SpecificConstants'
import OneQuyApp from '../../Common/Components/OneQuyApp'
import { CheckTapSetDevPersistence, IsDev } from '../../Common/IsDev'
import { VersionAsNumber } from '../../Common/CommonConstants'
import Clipboard from '@react-native-clipboard/clipboard'
import { UserID } from '../../Common/UserID'
import WealthText, { WealthTextConfig } from '../../Common/Components/WealthText'
import { GetCurrentLifetimeProduct } from '../Handles/AppUtils'
import { PressContact, PurchaseAndTrackingAsync } from '../../Common/SpecificUtils'

const About = () => {
    const texts = useLocalText()
    const [isHandling, set_isHandling] = useState(false)
    const [expiredSaleLine, set_expiredSaleLine] = useState<undefined | string>(undefined)
    const { subscribedData, onSetSubcribeDataAsync } = useContext(AppContext)

    const [currentLifetimeProduct, set_currentLifetimeProduct] = useState<undefined | IAPProduct>(undefined)

    const { isReadyPurchase, localPrice, initErrorObj, fetchedProducts } = useMyIAP(
        AllIAPProducts,
        async (s: string) => AsyncStorage.setItem(StorageKey_CachedIAP, s),
        async () => AsyncStorage.getItem(StorageKey_CachedIAP),
        currentLifetimeProduct
    )

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { flex: 1, },
            scrollView: { gap: Gap.Normal, padding: Outline.Normal, },

            priceView: { flexDirection: 'row' },

            normalBtnTxt: { fontSize: FontSize.Normal, },

            contactItemTitleTxt: {
                color: Color_Text,
                fontSize: FontSize.Small
            },

            contactItemContentTxt: {
                color: Color_Text2,
                fontSize: FontSize.Small,
                textDecorationLine: 'underline'
            },

            purchaseBtn: {
                borderWidth: 0,
                borderRadius: BorderRadius.Small,
                maxWidth: '50%',
                alignSelf: 'center',
                padding: Outline.Normal,
            },

            currentPriceTxt: Object.assign(
                {},
                SettingItemPanelStyle.explainTxt,
                {
                    color: 'chartreuse',
                    fontWeight: '800',
                } as StyleProp<TextStyle>
            ),

            crossOriginPriceTxt: Object.assign(
                {},
                SettingItemPanelStyle.explainTxt,
                {
                    textDecorationLine: 'line-through',
                    color: 'firebrick'
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
                text: `${texts.current_price}: `,
                textStyle: SettingItemPanelStyle.explainTxt,
            },
            {
                text: `${localPrice ?? '...'}`,
                textStyle: style.currentPriceTxt,
            }
        ]

        const discountTxts = GetPercentDiscountTxtAndOriginLocalizedPriceTxt(IapProductMax, currentLifetimeProduct, fetchedProducts)

        if (discountTxts && expiredSaleLine) {
            // percent

            arr.push({
                text: ` (-${discountTxts.percentDiscountTxt}%, `,
                textStyle: SettingItemPanelStyle.explainTxt,
            })

            // origin price

            arr.push({
                text: discountTxts.originLocalizedPriceTxt,
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
    }, [localPrice, expiredSaleLine, fetchedProducts, texts, currentLifetimeProduct, SettingItemPanelStyle, style])

    const onPressRestorePurchaseAsync = useCallback(async () => {
        set_isHandling(true)

        const products = await RestorePurchaseAsync()

        // LogStringify(products)

        let restoreResultForTracking = ''

        if (Array.isArray(products)) { // available products to restore
            const firstProduct = SafeGetArrayElement<Purchase>(products)

            if (firstProduct) {
                await onSetSubcribeDataAsync(firstProduct.productId)

                restoreResultForTracking = 'success_' + firstProduct.productId
            }
            else {
                restoreResultForTracking = 'no_product'

                Alert.alert(
                    texts.popup_error,
                    texts.restore_purchase_no_products +
                    (products.length > 0 ? '\n\n' + ToCanPrintError(products) : ''))
            }
        }
        else if (products !== null) { // error
            restoreResultForTracking = 'error'
            Alert.alert(texts.popup_error, texts.restore_purchase_no_products + '\n\n' + ToCanPrintError(products))
        }
        else { // user canceled
            restoreResultForTracking = 'user_cancel'
        }

        set_isHandling(false)

        TrackSimpleWithParam('restore_purchase', restoreResultForTracking)
    }, [texts, onSetSubcribeDataAsync])

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

        await PurchaseAndTrackingAsync(currentLifetimeProduct.sku, onSetSubcribeDataAsync)

        set_isHandling(false)
    }, [
        onSetSubcribeDataAsync,
        isHandling,
        isReadyPurchase,
        currentLifetimeProduct,
    ])

    useEffect(() => {
        (async () => {
            set_isHandling(true)

            // fetch premium product id

            const remoteConfig = await GetRemoteConfigWithCheckFetchAsync(false)

            const premiumProduct = GetCurrentLifetimeProduct(remoteConfig)

            set_currentLifetimeProduct(premiumProduct)

            // sale expired line

            const saleEndTick = SafeValue(remoteConfig?.saleEndTick, 0)

            if (Date.now() < saleEndTick) {
                set_expiredSaleLine(`${texts.sale_ends.replace('###', SafeDateString(new Date(saleEndTick), '/'))}`)
            }

            // done

            set_isHandling(false)
        })()
    }, [])

    return (
        <View pointerEvents={isHandling ? 'none' : 'auto'} style={style.master}>
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

                        {/* expired date */}
                        {
                            expiredSaleLine &&
                            <Text style={SettingItemPanelStyle.explainTxt}>{expiredSaleLine}</Text>
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

                {/* contact */}
                {
                    <View style={SettingItemPanelStyle.master_Column}>
                        {/* title */}
                        <Text style={SettingItemPanelStyle.titleTxt}>{texts.contact}</Text>

                        {/* email */}
                        <WealthText
                            onPressOverall={() => PressContact(texts, 'email')}
                            textConfigs={[
                                {
                                    text: 'Email: ',
                                    textStyle: style.contactItemTitleTxt
                                },
                                {
                                    text: 'onequy@gmail.com',
                                    textStyle: style.contactItemContentTxt
                                }
                            ]}
                        />

                        {/* X */}
                        <WealthText
                            onPressOverall={() => PressContact(texts, 'twitter')}
                            textConfigs={[
                                {
                                    text: 'Twitter (X): ',
                                    textStyle: style.contactItemTitleTxt
                                },
                                {
                                    text: '@vocaby_app',
                                    textStyle: style.contactItemContentTxt
                                }
                            ]}
                        />
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