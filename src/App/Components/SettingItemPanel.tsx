import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useMemo } from 'react'
import { Color_BG2, Color_Border, Color_Text, Color_Text2 } from '../Hooks/useTheme'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import { Gap, Outline } from '../Constants/Constants_Outline'

export const SettingItemPanelStyle = StyleSheet.create({
    master: {
        backgroundColor: Color_BG2,

        borderColor: Color_Border,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: BorderRadius.Medium,

        flexDirection: 'row',
        padding: Outline.Normal,

        justifyContent: 'center',
        alignItems: 'center',

        gap: Gap.Small,
    },
    
    master_Column: {
        backgroundColor: Color_BG2,

        borderColor: Color_Border,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: BorderRadius.Medium,

        // flexDirection: 'row',
        padding: Outline.Normal,

        justifyContent: 'center',
        alignItems: 'center',

        gap: Gap.Small,
    },

    leftPanel: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: Gap.Small,
    },

    titleTxt: {
        color: Color_Text,
        fontSize: FontSize.Normal,
        fontWeight: FontBold.Bold,
    },

    explainTxt: {
        color: Color_Text2,
        fontSize: FontSize.Small,
    },

    valueTxt: {
        color: Color_Text,
        fontSize: FontSize.Big,
        fontWeight: FontBold.Bold,
    },

    unitTxt: {
        color: Color_Text,
        fontSize: FontSize.Small,
    },
})

const SettingItemPanel = ({
    title,
    explain,
    value,
    unit,
    onPress,
    isLong,
}: {
    title: string,
    explain?: string,

    value: any,
    unit?: string,

    isLong?: boolean,

    onPress: () => void,
}) => {
    const memoStyle = useMemo(() => {
        return StyleSheet.create({
            rightPanelTO: {
                paddingHorizontal: Outline.Small,
                width: isLong ? '30%' : '20%',
                aspectRatio: isLong ? 3 : 1,
                borderColor: Color_Text,
                borderWidth: StyleSheet.hairlineWidth,
                borderRadius: BorderRadius.Small,
                justifyContent: 'center',
                alignItems: 'center',
            }
        })
    }, [isLong])

    return (
        <View style={SettingItemPanelStyle.master}>
            <View style={SettingItemPanelStyle.leftPanel}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={SettingItemPanelStyle.titleTxt}>{title}</Text>
                {
                    explain &&
                    <Text adjustsFontSizeToFit numberOfLines={5} style={SettingItemPanelStyle.explainTxt}>{explain}</Text>
                }
            </View>

            <TouchableOpacity style={memoStyle.rightPanelTO} onPress={onPress}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={SettingItemPanelStyle.valueTxt}>{value}</Text>

                {
                    unit &&
                    <Text adjustsFontSizeToFit numberOfLines={1} style={SettingItemPanelStyle.unitTxt}>{unit}</Text>
                }
            </TouchableOpacity>
        </View>
    )
}

export default SettingItemPanel