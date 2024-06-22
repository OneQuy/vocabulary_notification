import { View, Text, StyleSheet } from 'react-native'
import React, { useMemo } from 'react'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import { Color_BG, Color_Text } from '../Hooks/useTheme'
import ScaleUpView from '../../Common/Components/Effects/ScaleUpView'
import useLocalText from '../Hooks/useLocalText'
import { CommonStyles, StartupWindowSize } from '../../Common/CommonConstants'
import WealthText from '../../Common/Components/WealthText'
import { AppName } from '../../Common/SpecificConstants'
import { Outline } from '../Constants/Constants_Outline'
import SlideInView from '../../Common/Components/Effects/SlideInView'
import { PopuplarityLevelNumber, TotalWords } from '../Constants/AppConstants'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { BorderRadius } from '../Constants/Constants_BorderRadius'


const OffsetEffect = 300

const WelcomeScreen = () => {
    const texts = useLocalText()

    const style = useMemo(() => {
        return StyleSheet.create({
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
            key={3}
            style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}
        >
            {/* welcome */}
            <ScaleUpView isSpringOrTiming>
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
            <ScaleUpView isSpringOrTiming delay={1 * OffsetEffect}>
                <Text style={style.contentTxt}>{texts.welcome_content.replace('###', AppName)}</Text>
            </ScaleUpView>

            {/* items */}
            {
                <View style={style.itemsView}>
                    <SlideInView from={'right'} isSpringOrTiming delay={2 * OffsetEffect}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={style.contentItemTxt}>⭐️ {texts.welcome_item_0}</Text>
                    </SlideInView>

                    <SlideInView from={'right'} isSpringOrTiming delay={OffsetEffect * 3}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={style.contentItemTxt}>⭐️ {texts.welcome_item_1}</Text>
                    </SlideInView>

                    <SlideInView from={'right'} isSpringOrTiming delay={OffsetEffect * 4}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={style.contentItemTxt}>⭐️ {texts.welcome_item_2.replace('###', PopuplarityLevelNumber.toString())}</Text>
                    </SlideInView>

                    <SlideInView from={'right'} isSpringOrTiming delay={OffsetEffect * 5}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={style.contentItemTxt}>⭐️ {texts.welcome_item_3.replace('###', TotalWords)}</Text>
                    </SlideInView>
                </View>
            }

            {/* start btn */}
            <ScaleUpView delay={OffsetEffect * 6 + 1000} isSpringOrTiming>
                <LucideIconTextEffectButton
                    selectedColorOfTextAndIcon={Color_BG}
                    selectedBackgroundColor={Color_Text}

                    // onPress={() => onConfirmValue(selectingValue, selectingTargetLang)}

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