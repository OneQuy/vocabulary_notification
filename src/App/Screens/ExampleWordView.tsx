import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useTheme from '../Hooks/useTheme'
import useLocalText from '../Hooks/useLocalText'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { Gap, Outline } from '../Constants/Constants_Outline'
import { WindowSize_Max } from '../../Common/CommonConstants'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import { TranslationService } from '../Types'
import { ToCanPrint } from '../../Common/UtilsTS'
import TargetLangPicker from '../Components/TargetLangPicker'
import { Language } from '../../Common/TranslationApis/TranslationLanguages'

export type ValueAndDisplayText = {
    value: any,
    text: string,
}

const ExampleWordView = ({
    titleLeft,
    titleRight,
    values,
    initValue,
    initTargetLang,
    getExampleAsync,
    onConfirmValue,
}: {
    titleLeft: string,
    titleRight: string,
    values: ValueAndDisplayText[],
    initValue?: ValueAndDisplayText,
    initTargetLang?: Language,
    onConfirmValue: (service?: ValueAndDisplayText) => void,
    
    getExampleAsync: (
        service: TranslationService, 
        popularityLevelIdx?: number,
        targetLang?: string | null,
    ) => Promise<boolean | Error | ValueAndDisplayText[]>,
}) => {
    const theme = useTheme()
    const texts = useLocalText()

    const [selectingValue, set_selectingValue] = useState(initValue)
    const [selectingTargetLang, set_selectingTargetLang] = useState(initTargetLang)
    const [examples, set_examples] = useState<undefined | ValueAndDisplayText[]>(undefined)
    const [rightPanelState, set_rightPanelState] = useState<undefined | 'translating' | 'pick_target_lang' | boolean | Error>(undefined)

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { flex: 1, gap: 1, },

            panelView: { marginBottom: Outline.Normal, flex: 1, flexDirection: 'row', gap: 1, alignItems: 'center', },

            panelChild: { flex: 1, gap: Outline.Normal, justifyContent: 'center', alignItems: 'center' },

            titleChildTxt: { fontWeight: FontBold.Bold, fontSize: FontSize.Normal, textAlign: 'center' },

            separatorLine: { height: '95%', width: StyleSheet.hairlineWidth, backgroundColor: theme.counterPrimary },

            scrollView: { gap: Gap.Small, padding: Outline.Normal, },

            scrollViewExample: { gap: Gap.Normal, },

            serviceTxt: { fontSize: FontSize.Small, },

            normalTxt: { fontSize: FontSize.Normal, },

            errorTxt: { fontSize: FontSize.Small, marginHorizontal: Outline.Small },

            exampleTxt: { fontSize: FontSize.Normal, textAlign: 'center', },
            exampleTxt_Bold: { fontSize: FontSize.Normal, fontWeight: FontBold.Bold, textAlign: 'center', },

            confirmBtn: {
                borderWidth: WindowSize_Max * 0.0015,
                borderRadius: BorderRadius.Medium,
                padding: Outline.Normal,
                marginBottom: Outline.Normal,
                marginHorizontal: Outline.Normal
            },

            anotherExampleBtn: {
                borderWidth: WindowSize_Max * 0.0015,
                borderRadius: BorderRadius.Medium,
                padding: Outline.Small,
                marginHorizontal: Outline.Normal
            },

            normalBtn: {
                borderWidth: WindowSize_Max * 0.0015,
                borderRadius: BorderRadius.Medium,
                padding: Outline.Normal,
                flexDirection: 'row',
            },

            normalBtn_NoBorder: {
                padding: Outline.Normal,
            },
        })
    }, [theme])

    const generateExamplesAsync = useCallback(async () => {
        set_rightPanelState('translating')
        set_examples(undefined)

        const res = await getExampleAsync(selectingValue?.value)

        if (Array.isArray(res)) {
            set_examples(res)
            set_rightPanelState(undefined)
        }
        else
            set_rightPanelState(res)
    }, [getExampleAsync, selectingValue])

    const onPressTargetLang = useCallback((value: Language) => {
        set_selectingTargetLang(value)
    }, [])

    const onPressValue = useCallback((value: ValueAndDisplayText) => {
        set_selectingValue(value)
    }, [])

    useEffect(() => {
        generateExamplesAsync()
    }, [selectingValue])

    return (
        <View style={style.master}>
            {/* 2 panels */}
            <View style={style.panelView}>
                {/* left panel */}
                <View style={style.panelChild}>

                    <Text style={style.titleChildTxt}>{titleLeft}</Text>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={style.scrollView}
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

                                        titleProps={{ style: style.serviceTxt }}
                                    />
                                )
                            })
                        }
                    </ScrollView>
                </View>

                {/* separatorLine */}
                <View style={style.separatorLine} />

                {/* right panel */}
                {
                    rightPanelState !== 'pick_target_lang' &&
                    <View style={style.panelChild}>
                        {/* title */}
                        {
                            examples &&
                            <Text style={style.titleChildTxt}>{titleRight}</Text>
                        }

                        {/* pick target lang */}
                        {
                            rightPanelState !== 'translating' &&
                            < LucideIconTextEffectButton
                                selectedColorOfTextAndIcon={theme.primary}
                                unselectedColorOfTextAndIcon={theme.counterPrimary}

                                onPress={generateExamplesAsync}

                                notChangeToSelected

                                style={style.anotherExampleBtn}

                                title={texts.other_words}

                                titleProps={{ style: style.normalTxt }}
                            />
                        }

                        {/* another example btn */}
                        {
                            rightPanelState !== 'translating' &&
                            < LucideIconTextEffectButton
                                selectedColorOfTextAndIcon={theme.primary}
                                unselectedColorOfTextAndIcon={theme.counterPrimary}

                                onPress={generateExamplesAsync}

                                notChangeToSelected

                                style={style.anotherExampleBtn}

                                title={texts.other_words}

                                titleProps={{ style: style.normalTxt }}
                            />
                        }

                        {/* loading */}
                        {
                            rightPanelState === 'translating' &&
                            <>
                                <ActivityIndicator color={theme.counterPrimary} />
                                <Text style={style.normalTxt}>{texts.translating}...</Text>
                            </>
                        }

                        {/* Error */}
                        {
                            (rightPanelState instanceof Error || rightPanelState === false) &&
                            <>
                                <Text style={style.normalTxt}>{texts.fail_translate}</Text>
                                {
                                    rightPanelState !== false &&
                                    <Text
                                        numberOfLines={10}
                                        adjustsFontSizeToFit
                                        style={style.errorTxt}
                                    >
                                        {ToCanPrint(rightPanelState)}
                                    </Text>
                                }
                            </>
                        }

                        {/* success list */}
                        {
                            (examples) &&
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={style.scrollViewExample}
                            >
                                {
                                    examples.map((valueAndDisplayText: ValueAndDisplayText) => {
                                        return (
                                            <View key={valueAndDisplayText.text}>
                                                <Text
                                                    style={style.exampleTxt_Bold}
                                                >
                                                    {valueAndDisplayText.text}
                                                </Text>
                                                <Text
                                                    style={style.exampleTxt}
                                                >
                                                    {valueAndDisplayText.value}
                                                </Text>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        }
                    </View>
                }

                {/* right panel - pick target lang */}
                {
                    rightPanelState === 'pick_target_lang' &&
                    <TargetLangPicker
                        onPressTargetLang={onPressTargetLang}
                        initTargetLang={undefined}
                        selectingService={selectingValue?.value}
                    />
                }
            </View>

            {/* confirm btn */}
            < LucideIconTextEffectButton
                selectedColorOfTextAndIcon={theme.primary}
                unselectedColorOfTextAndIcon={theme.counterPrimary}

                onPress={() => onConfirmValue(selectingValue)}

                notChangeToSelected

                style={style.confirmBtn}

                title={texts.confirm}

                titleProps={{ adjustsFontSizeToFit: false, style: style.normalTxt }}
            />
        </View>
    )
}

export default ExampleWordView