// Created on 29 June 2024 (Vocaby)

import { View, Text, StyleSheet, StyleProp, TextStyle } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import { Color_BG, Color_Text } from '../Hooks/useTheme'
import ScaleUpView from '../../Common/Components/Effects/ScaleUpView'
import useLocalText from '../Hooks/useLocalText'
import { CommonStyles, StartupWindowSize } from '../../Common/CommonConstants'
import WealthText, { WealthTextConfig } from '../../Common/Components/WealthText'
import { AllIAPProducts, AppContext, AppName, IapProductMax } from '../../Common/SpecificConstants'
import { Outline } from '../Constants/Constants_Outline'
import { PopuplarityLevelNumber, TotalWords } from '../Constants/AppConstants'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { useMyIAP } from '../../Common/IAP/useMyIAP'
import { StorageKey_CachedIAP } from '../Constants/StorageKey'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GetPercentDiscountTxtAndOriginLocalizedPriceTxt, IAPProduct } from '../../Common/IAP/IAP'
import { SettingItemPanelStyle } from '../Components/SettingItemPanel'
import { GetAlternativeConfig, GetRemoteConfigWithCheckFetchAsync } from '../../Common/RemoteConfig'
import { GetCurrentLifetimeProduct } from '../Handles/AppUtils'
import { PurchaseAndTrackingAsync } from '../../Common/SpecificUtils'
import { SafeDateString, SafeValue } from '../../Common/UtilsTS'
import useCountdown from '../../Common/Hooks/useCountdown'
import { TrackSimpleWithParam } from '../../Common/Tracking'

const OffsetEffect = 200
const DelayStartEffect = 300

const Paywall = ({
    onPressCancel,
}: {
    onPressCancel: () => void
}) => {
    const texts = useLocalText()
    const [handling, set_handling] = useState(false)
    const [expiredSaleLine, set_expiredSaleLine] = useState<string | undefined>(undefined)
    const { onSetSubcribeDataAsync } = useContext(AppContext)
    const { timeLeft } = useCountdown(GetAlternativeConfig('payWallWaitInSec', 3))

    const [currentLifetimeProduct, set_currentLifetimeProduct] = useState<undefined | IAPProduct>(undefined)

    const { isReadyPurchase, localPrice, fetchedProducts } = useMyIAP(
        AllIAPProducts,
        async (s: string) => AsyncStorage.setItem(StorageKey_CachedIAP, s),
        async () => AsyncStorage.getItem(StorageKey_CachedIAP),
        currentLifetimeProduct
    )

    const onPressLaterAsync = useCallback(async () => {
        if (timeLeft > 0)
            return

        TrackSimpleWithParam('paywall', 'press_later')
        onPressCancel()
    }, [timeLeft, onPressCancel])

    const onPressUpgradeAsync = useCallback(async () => {
        if (!isReadyPurchase ||
            handling ||
            !currentLifetimeProduct)
            return

        TrackSimpleWithParam('paywall', 'press_upgrade')

        set_handling(true)

        await PurchaseAndTrackingAsync(currentLifetimeProduct.sku, onSetSubcribeDataAsync)

        set_handling(false)
    }, [onSetSubcribeDataAsync, isReadyPurchase, handling, currentLifetimeProduct])

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { backgroundColor: Color_BG, justifyContent: 'center', alignItems: 'center', flex: 1 },

            titleTxt: { fontSize: FontSize.Big, color: Color_Text },

            contentItemTxt: { marginHorizontal: Outline.Normal, marginVertical: Outline.Small, textAlign: 'center', fontSize: FontSize.Normal, color: Color_Text },

            proTxt: {
                fontSize: FontSize.Big,
                color: Color_Text,
                fontWeight: FontBold.BoldMore,
            },

            currentPriceTxt: Object.assign(
                {},
                SettingItemPanelStyle.explainTxt,
                {
                    color: Color_Text,
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

            upgradeBtnTxt: {
                fontSize: FontSize.Normal
            },

            upgradeBtn: {
                borderWidth: 0,
                borderRadius: BorderRadius.Medium,
                padding: Outline.Normal,
                margin: Outline.Normal,
                marginTop: Outline.Normal * 2,
                maxWidth: StartupWindowSize.width * 0.5,
            },
        })
    }, [])

    const renderPriceLine = useCallback(() => {
        const arr: WealthTextConfig[] = [
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

    useEffect(() => {
        (async () => {
            TrackSimpleWithParam('paywall', 'show')

            set_handling(true)

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

            set_handling(false)
        })()
    }, [])

    return (
        <View
            key={9}
            style={style.master}
            pointerEvents={handling ? 'none' : 'auto'}
        >
            <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                {/* title */}
                <ScaleUpView isSpringOrTiming delay={OffsetEffect * 0 + DelayStartEffect}>
                    <WealthText
                        textConfigs={[
                            {
                                text: AppName,
                                textStyle: style.titleTxt,
                            },
                            {
                                text: ' ' + texts.pro,
                                textStyle: style.proTxt,
                            },
                        ]}
                    />
                </ScaleUpView>

                {/* content */}
                {
                    <ScaleUpView isSpringOrTiming delay={OffsetEffect * 1 + DelayStartEffect}>
                        <Text
                            style={style.contentItemTxt}
                        >
                            {
                                texts.
                                    pro_item_content.
                                    replace('###', PopuplarityLevelNumber.toString()).
                                    replace('@@@', TotalWords.toString())
                            }
                        </Text>
                    </ScaleUpView>
                }

                {/* upgrade btn */}
                <ScaleUpView delay={OffsetEffect * 2 + DelayStartEffect} isSpringOrTiming>
                    <LucideIconTextEffectButton
                        selectedColorOfTextAndIcon={Color_BG}
                        selectedBackgroundColor={Color_Text}

                        onPress={onPressUpgradeAsync}

                        notChangeToSelected
                        canHandlePressWhenSelected
                        manuallySelected={true}

                        enableIndicator={!isReadyPurchase || handling || !currentLifetimeProduct}
                        // enableIndicator={true}

                        style={style.upgradeBtn}

                        title={texts.upgrade}

                        titleProps={{ style: style.upgradeBtnTxt }}
                    />
                </ScaleUpView>

                {/* price */}
                <ScaleUpView delay={OffsetEffect * 3 + DelayStartEffect} isSpringOrTiming>
                    {
                        renderPriceLine()
                    }
                </ScaleUpView>

                {/* sale end */}
                <ScaleUpView isSpringOrTiming delay={OffsetEffect * 4 + DelayStartEffect}>
                    <Text
                        style={SettingItemPanelStyle.explainTxt}
                    >
                        {expiredSaleLine}
                    </Text>
                </ScaleUpView>
            </View>

            {/* later btn */}
            <LucideIconTextEffectButton
                unselectedColorOfTextAndIcon={Color_Text}

                onPress={onPressLaterAsync}

                notChangeToSelected

                enableIndicator={handling}
                // enableIndicator={true}

                style={style.upgradeBtn}

                title={timeLeft > 0 ? timeLeft.toString() : texts.later}

                titleProps={{ style: style.upgradeBtnTxt }}
            />
        </View>
    )
}

export default Paywall