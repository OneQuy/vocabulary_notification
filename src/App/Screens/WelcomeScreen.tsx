import { View, Text, StyleSheet } from 'react-native'
import React, { useMemo } from 'react'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import { Color_Text } from '../Hooks/useTheme'
import ScaleUpView from '../../Common/Components/Effects/ScaleUpView'
import useLocalText from '../Hooks/useLocalText'
import { CommonStyles } from '../../Common/CommonConstants'
import WealthText from '../../Common/Components/WealthText'
import { AppName } from '../../Common/SpecificConstants'
import { Outline } from '../Constants/Constants_Outline'
import SlideInView from '../../Common/Components/Effects/SlideInView'
import { PopuplarityLevelNumber, TotalWords } from '../Constants/AppConstants'
import TextTyper from '../../Common/Components/Effects/TextTyper'

const WelcomeScreen = () => {
    const texts = useLocalText()

    const style = useMemo(() => {
        return StyleSheet.create({
            welcomeTxt: { fontSize: FontSize.Big, color: Color_Text },

            contentTxt: { marginHorizontal: Outline.Normal, marginVertical: Outline.Normal * 2, textAlign: 'center', fontSize: FontSize.Normal, color: Color_Text },

            contentItemTxt: { marginVertical: Outline.Small, textAlign: 'center', fontSize: FontSize.Normal, color: Color_Text },

            appNameTxt: {
                fontSize: FontSize.Big,
                color: Color_Text,
                fontWeight: FontBold.BoldMore,
            },

            itemsView: {
                alignItems: 'flex-start'
            },
        })
    }, [])

    return (
        <View
            key={2}
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
            {/* <ScaleUpView isSpringOrTiming delay={200}>
                <Text style={style.contentTxt}>{texts.welcome_content.replace('###', AppName)}</Text>
                </ScaleUpView> */}

            <TextTyper
                text={texts.welcome_content.replace('###', AppName)}
                textStyle={style.contentTxt}
                speed={1}
            />


            {/* items */}
            <View style={style.itemsView}>
                <SlideInView from={'right'} isSpringOrTiming delay={0}>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={style.contentItemTxt}>⭐️ {texts.welcome_item_0}</Text>
                </SlideInView>

                <SlideInView from={'right'} isSpringOrTiming delay={100}>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={style.contentItemTxt}>⭐️ {texts.welcome_item_1}</Text>
                </SlideInView>

                <SlideInView from={'right'} isSpringOrTiming delay={200}>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={style.contentItemTxt}>⭐️ {texts.welcome_item_2.replace('###', PopuplarityLevelNumber.toString())}</Text>
                </SlideInView>

                <SlideInView from={'right'} isSpringOrTiming delay={300}>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={style.contentItemTxt}>⭐️ {texts.welcome_item_3.replace('###', TotalWords)}</Text>
                </SlideInView>
            </View>
        </View>
    )
}

export default WelcomeScreen