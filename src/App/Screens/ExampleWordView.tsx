import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import useTheme from '../Hooks/useTheme'
import useLocalText from '../Hooks/useLocalText'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { Gap, Outline } from '../Constants/Constants_Outline'
import { WindowSize_Max } from '../../Common/CommonConstants'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import { TranslationService } from '../Types'

export type ValueAndDisplayText = {
    value: any,
    text: string,
}

const ExampleWordView = ({
    titleLeft,
    titleRight,
    values,
    initValue,
    getExampleAsync,
}: {
    titleLeft: string,
    titleRight: string,
    values: ValueAndDisplayText[],
    initValue?: ValueAndDisplayText,
    getExampleAsync: (service: TranslationService, popularityLevelIdx: number) => Promise<boolean | Error | ValueAndDisplayText[]>,
}) => {
    const theme = useTheme()
    const texts = useLocalText()

    const [selectingValue, set_selectingValue] = useState(initValue)

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { flex: 1, gap: 1, },

            panelView: { flex: 1, flexDirection: 'row', gap: 1, alignItems: 'center', },

            masterChild: { flex: 1 },

            titleChildTxt: { fontWeight: FontBold.Bold, fontSize: FontSize.Normal, textAlign: 'center' },

            separatorLine: { height: '95%', width: StyleSheet.hairlineWidth, backgroundColor: theme.counterPrimary },

            scrollViewSlidingPopup: { gap: Gap.Small, padding: Outline.Normal, },

            normalBtnTxt: { fontSize: FontSize.Normal, },

            confirmBtn: {
                borderWidth: WindowSize_Max * 0.0015,
                borderRadius: BorderRadius.Medium,
                padding: Outline.Normal,
                marginBottom: Outline.Normal,
                marginHorizontal: Outline.Normal
            },

            normalBtn: {
                borderWidth: WindowSize_Max * 0.0015,
                borderRadius: BorderRadius.Medium,
                padding: Outline.Normal,
                flexDirection: 'row',
                // gap: Gap.Normal,
            },

            normalBtn_NoBorder: {
                padding: Outline.Normal,
            },
        })
    }, [theme])

    const onPressValue = useCallback((value: ValueAndDisplayText) => {

    }, [])

    return (
        <View style={style.master}>
            {/* 2 panels */}
            <View style={style.panelView}>
                {/* left panel */}
                <View style={style.masterChild}>

                    <Text style={style.titleChildTxt}>{titleLeft}</Text>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={style.scrollViewSlidingPopup}
                    >
                        {
                            values.map((valueAndDisplayText: ValueAndDisplayText) => {
                                const isSelected = valueAndDisplayText === selectingValue

                                return (
                                    < LucideIconTextEffectButton
                                        key={valueAndDisplayText.text}
                                        selectedColorOfTextAndIcon={theme.primary}
                                        unselectedColorOfTextAndIcon={theme.counterPrimary}

                                        onPress={() => onPressValue(valueAndDisplayText)}

                                        manuallySelected={isSelected}
                                        notChangeToSelected
                                        canHandlePressWhenSelected

                                        style={isSelected ? style.normalBtn : style.normalBtn_NoBorder}

                                        title={valueAndDisplayText.text}

                                        titleProps={{ style: style.normalBtnTxt }}
                                    />
                                )
                            })
                        }
                    </ScrollView>
                </View>

                {/* separatorLine */}
                <View style={style.separatorLine} />

                {/* right panel */}
                <View style={style.masterChild}>
                    <Text style={style.titleChildTxt}>{titleRight}</Text>

                </View>
            </View>

            {/* confirm btn */}
            < LucideIconTextEffectButton
                selectedColorOfTextAndIcon={theme.primary}
                unselectedColorOfTextAndIcon={theme.counterPrimary}

                // onPress={() => onPressValue(valueAndDisplayText)}

                // manuallySelected={isSelected}
                // notChangeToSelected
                // canHandlePressWhenSelected

                style={style.confirmBtn}

                title={texts.confirm}

                titleProps={{ style: style.normalBtnTxt }}
            />
        </View>
    )
}

export default ExampleWordView