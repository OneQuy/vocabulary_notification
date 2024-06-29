// Created on 29 June 2024 (Vocaby)

import { View, Text, StyleSheet, StyleProp, TextStyle } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import { Color_BG, Color_Text } from '../Hooks/useTheme'
import ScaleUpView from '../../Common/Components/Effects/ScaleUpView'
import useLocalText from '../Hooks/useLocalText'
import { StartupWindowSize } from '../../Common/CommonConstants'
import WealthText, { WealthTextConfig } from '../../Common/Components/WealthText'
import { AllIAPProducts, AppName, IapProductMax } from '../../Common/SpecificConstants'
import { Gap, Outline } from '../Constants/Constants_Outline'
import { PopuplarityLevelNumber } from '../Constants/AppConstants'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { useMyIAP } from '../../Common/IAP/useMyIAP'
import { StorageKey_CachedIAP } from '../Constants/StorageKey'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GetPercentDiscountTxtAndOriginLocalizedPriceTxt, IAPProduct } from '../../Common/IAP/IAP'
import { SettingItemPanelStyle } from '../Components/SettingItemPanel'
import { GetRemoteConfigWithCheckFetchAsync } from '../../Common/RemoteConfig'
import { GetCurrentLifetimeProduct } from '../Handles/AppUtils'

const OffsetEffect = 200
const DelayStartEffect = 300

const Paywall = ({
    onPressCancel,
}: {
    onPressCancel: () => void
}) => {
    const texts = useLocalText()
    const [handling, set_handling] = useState(false)

    const [currentLifetimeProduct, set_currentLifetimeProduct] = useState<undefined | IAPProduct>(undefined)

    const { isReadyPurchase, localPrice, initErrorObj, fetchedProducts } = useMyIAP(
        AllIAPProducts,
        async (s: string) => AsyncStorage.setItem(StorageKey_CachedIAP, s),
        async () => AsyncStorage.getItem(StorageKey_CachedIAP),
        currentLifetimeProduct
    )

    const onPressCancelBtn = useCallback(() => {
        // set_handling(true)
        // onPressCancel()

        // // track

        // const event = 'welcome_screen'

        // TrackingAsync(event,
        //     [
        //         `total/app/${event}`,
        //     ],
        //     {
        //         viewTimeInSec: RoundWithDecimal(((Date.now() - tickStart) / 1000)),
        //     }
        // )
    }, [])

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { backgroundColor: Color_BG, justifyContent: 'center', alignItems: 'center', flex: 1 },

            welcomeTxt: { fontSize: FontSize.Big, color: Color_Text },

            contentItemTxt: { marginVertical: Outline.Small, textAlign: 'center', fontSize: FontSize.Normal, color: Color_Text },

            appNameTxt: {
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

            startBtnTxt: {
                fontSize: FontSize.Normal
            },

            startBtn: {
                borderWidth: 0,
                borderRadius: BorderRadius.Small,
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

        if (discountTxts) {
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
    }, [localPrice, fetchedProducts, texts, currentLifetimeProduct, SettingItemPanelStyle, style])

    useEffect(() => {
        (async () => {
            set_handling(true)

            // fetch premium product id

            const remoteConfig = await GetRemoteConfigWithCheckFetchAsync(false)

            const premiumProduct = GetCurrentLifetimeProduct(remoteConfig)

            set_currentLifetimeProduct(premiumProduct)

            // sale expired line

            // const saleEndTick = SafeValue(remoteConfig?.saleEndTick, 0)

            // if (Date.now() < saleEndTick) {
            //     set_expirtedSaleLine(`${texts.sale_ends.replace('###', SafeDateString(new Date(saleEndTick), '/'))}`)
            // }

            // done

            set_handling(false)
        })()
    }, [])

    return (
        <View
            key={2}
            style={style.master}
            pointerEvents={handling ? 'none' : 'auto'}
        >
            {/* title */}
            <ScaleUpView isSpringOrTiming delay={OffsetEffect * 0 + DelayStartEffect}>
                <WealthText
                    textConfigs={[
                        {
                            text: AppName,
                            textStyle: style.welcomeTxt,
                        },
                        {
                            text: ' ' + texts.pro,
                            textStyle: style.appNameTxt,
                        },
                    ]}
                />
            </ScaleUpView>

            {/* content */}
            {
                <ScaleUpView isSpringOrTiming delay={OffsetEffect * 1 + DelayStartEffect}>
                    <Text
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        style={style.contentItemTxt}
                    >
                        {texts.pro_item_content.replace('###', PopuplarityLevelNumber.toString())}
                    </Text>
                </ScaleUpView>
            }

            {/* upgrade btn */}
            <ScaleUpView containerStyle={{ opacity: handling ? 0 : 1 }} delay={OffsetEffect * 2 + DelayStartEffect} isSpringOrTiming>
                <LucideIconTextEffectButton
                    selectedColorOfTextAndIcon={Color_BG}
                    selectedBackgroundColor={Color_Text}

                    onPress={onPressCancelBtn}

                    notChangeToSelected
                    manuallySelected={true}
                    canHandlePressWhenSelected

                    style={style.startBtn}

                    title={texts.upgrade}

                    titleProps={{ style: style.startBtnTxt }}
                />
            </ScaleUpView>

            {/* price */}
            <ScaleUpView delay={OffsetEffect * 3 + DelayStartEffect} isSpringOrTiming>
                {
                    renderPriceLine()
                }
            </ScaleUpView>
        </View>
    )
}

export default Paywall