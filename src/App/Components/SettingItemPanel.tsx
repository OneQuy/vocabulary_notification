import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useMemo } from 'react'
import { Color_BG2, Color_Border, Color_Text, Color_Text2 } from '../Hooks/useTheme'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import { Gap, Outline } from '../Constants/Constants_Outline'

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
    const style = useMemo(() => {
        return StyleSheet.create({
            master: {
                backgroundColor: Color_BG2,

                borderColor: Color_Border,
                borderWidth: StyleSheet.hairlineWidth,
                borderRadius: BorderRadius.Medium,

                flexDirection: 'row',
                padding: Outline.Normal,

                justifyContent: 'center',
                alignItems: 'center',
            },

            leftPanel: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: Gap.Small,
            },

            rightPanelTO: {
                paddingHorizontal: Outline.Small,
                width: isLong ? '40%' : '20%',
                aspectRatio: isLong ? 3 : 1,
                borderColor: Color_Text,
                borderWidth: StyleSheet.hairlineWidth,
                borderRadius: BorderRadius.Small,
                justifyContent: 'center',
                alignItems: 'center',
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
                // fontWeight: FontBold.Bold,
            },
        })
    }, [isLong])

    return (
        <View style={style.master}>
            <View style={style.leftPanel}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={style.titleTxt}>{title}</Text>
                {
                    explain &&
                    <Text adjustsFontSizeToFit numberOfLines={5} style={style.explainTxt}>{explain}</Text>
                }
            </View>

            <TouchableOpacity style={style.rightPanelTO} onPress={onPress}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={style.valueTxt}>{value}</Text>

                {
                    unit &&
                    <Text adjustsFontSizeToFit numberOfLines={1} style={style.unitTxt}>{unit}</Text>
                }
            </TouchableOpacity>
        </View>
    )
}

export default SettingItemPanel