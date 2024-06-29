// Created on 29 June 2024 (Vocaby)

import { View, Text, StyleSheet } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import { Color_BG, Color_Text } from '../Hooks/useTheme'
import ScaleUpView from '../../Common/Components/Effects/ScaleUpView'
import useLocalText from '../Hooks/useLocalText'
import { StartupWindowSize } from '../../Common/CommonConstants'
import WealthText from '../../Common/Components/WealthText'
import { AppName } from '../../Common/SpecificConstants'
import { Outline } from '../Constants/Constants_Outline'
import { PopuplarityLevelNumber } from '../Constants/AppConstants'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { BorderRadius } from '../Constants/Constants_BorderRadius'

const OffsetEffect = 200
const DelayStartEffect = 300

const Paywall = ({
    onPressCancel,
}: {
    onPressCancel: () => void
}) => {
    const texts = useLocalText()
    const [handling, set_handling] = useState(false)
    const tickStart = Date.now()

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

            startBtnTxt: {
                fontSize: FontSize.Normal
            },

            startBtn: {
                borderWidth: 0,
                borderRadius: BorderRadius.Small,
                padding: Outline.Normal,
                margin: Outline.Normal,
                marginVertical: Outline.Normal * 2,
                maxWidth: StartupWindowSize.width * 0.5,
            },
        })
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

                    title={texts.start_text}

                    titleProps={{ style: style.startBtnTxt }}
                />
            </ScaleUpView>
        </View>
    )
}

export default Paywall