import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import useTheme from '../Hooks/useTheme'
import useLocalText from '../Hooks/useLocalText'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { Gap, Outline } from '../Constants/Constants_Outline'
import { WindowSize_Max } from '../../Common/CommonConstants'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { FontSize } from '../Constants/Constants_FontSize'

export type ValueAndDisplayText = {
    value: any,
    text: string,
}

const ExampleWordView = ({
    values,
    initValue,
}: {
    values: ValueAndDisplayText[],
    initValue?: ValueAndDisplayText,
}) => {
    const theme = useTheme()
    const texts = useLocalText()

    const [selectingValue, set_selectingValue] = useState(initValue)

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { flex: 1, flexDirection: 'row', gap: 1, alignItems: 'center', },
            
            masterChild: { flex: 1 },

            separatorLine: { height: '95%', width: StyleSheet.hairlineWidth, backgroundColor: theme.counterPrimary },

            scrollViewSlidingPopup: { gap: Gap.Small, padding: Outline.Normal, },

            normalBtnTxt: { fontSize: FontSize.Normal, },

            normalBtn: {
                borderWidth: WindowSize_Max * 0.0015,
                borderRadius: BorderRadius.Medium,
                padding: Outline.Normal,
                flexDirection: 'row',
                gap: Gap.Normal,
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
            {/* left panel */}
            <View style={style.masterChild}>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={style.scrollViewSlidingPopup}
                >
                    {
                        values.map((valueAndDisplayText: ValueAndDisplayText) => {
                            const isSelected = valueAndDisplayText === selectingValue

                            return (
                                < LucideIconTextEffectButton
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

            <View style={style.separatorLine} />

            {/* right panel */}
            <View style={style.masterChild}>

            </View>
        </View>
    )
}

export default ExampleWordView