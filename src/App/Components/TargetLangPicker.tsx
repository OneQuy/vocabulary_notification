import { View, TextInput, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { CommonStyles, WindowSize_Max } from '../../Common/CommonConstants'
import useTheme from '../Hooks/useTheme'
import useLocalText from '../Hooks/useLocalText'
import { Language } from '../../Common/TranslationApis/TranslationLanguages'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { FontSize } from '../Constants/Constants_FontSize'
import { Gap, Outline } from '../Constants/Constants_Outline'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { GetCurrentTranslationServiceSuitAsync } from '../Handles/TranslateBridge'
import { TranslationService } from '../Types'
import { DelayAsync } from '../../Common/UtilsTS'

const TargetLangPicker = ({
    initTargetLang,
    selectingService,
    onPressTargetLang,
    delayShow,
}: {
    delayShow?: boolean
    initTargetLang: Language | undefined,
    selectingService: TranslationService,
    onPressTargetLang: (lang: Language) => void,
}) => {
    const theme = useTheme()
    const texts = useLocalText()

    const [supportedLanguages, set_supportedLanguages] = useState<Language[]>([])
    const [searchLangInputTxt, set_searchLangInputTxt] = useState('')

    const style = useMemo(() => {
        return StyleSheet.create({
            scrollViewSlidingPopup: { gap: Gap.Small, padding: Outline.Normal, },

            searchLangView: {
                borderWidth: StyleSheet.hairlineWidth,
                borderRadius: BorderRadius.Medium,
                borderColor: theme.counterPrimary,
                padding: Outline.Small,
                justifyContent: 'center',
                alignItems: 'center',
                margin: Outline.Normal,
            },

            searchTxt: { fontSize: FontSize.Normal, color: theme.counterPrimary },

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

    const showingLangs = useMemo(() => {
        return supportedLanguages.filter(lang => searchLangInputTxt.length === 0 || lang.name.toLowerCase().includes(searchLangInputTxt.toLowerCase()))
    }, [searchLangInputTxt, supportedLanguages])

    useEffect(() => {
        (async () => {
            if (delayShow)
                await DelayAsync(300)

            const suit = await GetCurrentTranslationServiceSuitAsync(selectingService)

            set_supportedLanguages(suit.supportedLanguages)
        })()
    }, [selectingService])

    return (
        <View style={CommonStyles.flex_1}>
            {/* input search */}
            <View style={style.searchLangView}>
                <TextInput
                    style={style.searchTxt}
                    placeholder={texts.search_language}
                    maxLength={20}
                    textContentType='countryName'
                    keyboardType='default'
                    value={searchLangInputTxt}
                    onChangeText={set_searchLangInputTxt}
                    autoCapitalize='none'
                />
            </View>

            {/* lang list */}
            {
                showingLangs.length <= 0 &&
                <View style={CommonStyles.flex_1}>
                    <ActivityIndicator color={theme.counterPrimary} />
                </View>
            }

            {/* lang list */}
            {
                showingLangs.length > 0 &&
                <View style={CommonStyles.flex_1}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={style.scrollViewSlidingPopup}
                    >
                        {
                            showingLangs.map((lang: Language) => {
                                const isSelected = lang === initTargetLang

                                return (
                                    <LucideIconTextEffectButton
                                        key={lang.language}

                                        selectedColorOfTextAndIcon={theme.primary}
                                        unselectedColorOfTextAndIcon={theme.counterPrimary}

                                        onPress={() => onPressTargetLang(lang)}

                                        manuallySelected={isSelected}
                                        notChangeToSelected
                                        canHandlePressWhenSelected

                                        style={isSelected ? style.normalBtn : style.normalBtn_NoBorder}

                                        title={lang.name}

                                        titleProps={{ style: style.normalBtnTxt }}
                                    />
                                )
                            })
                        }
                    </ScrollView>
                </View>
            }
        </View>
    )
}

export default TargetLangPicker