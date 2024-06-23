// Created on 22 June 2024 (Vocaby)

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
import SlideInView from '../../Common/Components/Effects/SlideInView'
import { PopuplarityLevelNumber, TotalWords } from '../Constants/AppConstants'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { BorderRadius } from '../Constants/Constants_BorderRadius'

const OffsetEffect = 200
const DelayStartEffect = 300

const WelcomeScreen = ({
    onPressStart,
}: {
    onPressStart: () => void
}) => {
    const texts = useLocalText()
    const [pressedStart, set_pressedStart] = useState(false)

    const onPressStartBtn = useCallback(() => {
        set_pressedStart(true)
        onPressStart()
    }, [])

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { backgroundColor: Color_BG, justifyContent: 'center', alignItems: 'center', flex: 1 },

            welcomeTxt: { fontSize: FontSize.Big, color: Color_Text },

            contentTxt: { marginHorizontal: Outline.Normal, marginVertical: Outline.Normal * 2, textAlign: 'center', fontSize: FontSize.Normal, color: Color_Text },

            contentItemTxt: { fontStyle: 'italic', marginVertical: Outline.Small, textAlign: 'center', fontSize: FontSize.Normal, color: Color_Text },

            appNameTxt: {
                fontSize: FontSize.Big,
                color: Color_Text,
                fontWeight: FontBold.BoldMore,
            },

            itemsView: {
                alignItems: 'flex-start'
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
            key={5}
            style={style.master}
        >
            {/* welcome */}
            <ScaleUpView isSpringOrTiming delay={OffsetEffect * 0 + DelayStartEffect}>
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

            {/* content */}
            <ScaleUpView isSpringOrTiming delay={OffsetEffect * 1 + DelayStartEffect}>
                <Text style={style.contentTxt}>{texts.welcome_content.replace('###', AppName)}</Text>
            </ScaleUpView>

            {/* items */}
            {
                <View style={style.itemsView}>
                    <SlideInView from={'right'} isSpringOrTiming delay={OffsetEffect * 2 + DelayStartEffect}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={style.contentItemTxt}>⭐️ {texts.welcome_item_0}</Text>
                    </SlideInView>

                    <SlideInView from={'right'} isSpringOrTiming delay={OffsetEffect * 3 + DelayStartEffect}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={style.contentItemTxt}>🔥 {texts.welcome_item_1}</Text>
                    </SlideInView>

                    <SlideInView from={'right'} isSpringOrTiming delay={OffsetEffect * 4 + DelayStartEffect}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={style.contentItemTxt}>💛 {texts.welcome_item_2.replace('###', PopuplarityLevelNumber.toString())}</Text>
                    </SlideInView>

                    <SlideInView from={'right'} isSpringOrTiming delay={OffsetEffect * 5 + DelayStartEffect}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={style.contentItemTxt}>✨ {texts.welcome_item_3.replace('###', TotalWords)}</Text>
                    </SlideInView>
                </View>
            }

            {/* start btn */}
            <ScaleUpView containerStyle={{ opacity: pressedStart ? 0 : 1 }} delay={OffsetEffect * 6 + DelayStartEffect} isSpringOrTiming>
                <LucideIconTextEffectButton
                    selectedColorOfTextAndIcon={Color_BG}
                    selectedBackgroundColor={Color_Text}

                    onPress={onPressStartBtn}

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

export default WelcomeScreen