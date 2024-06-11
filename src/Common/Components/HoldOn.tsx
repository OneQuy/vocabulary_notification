import { View, Text, StyleSheet, ActivityIndicator, ColorValue, DimensionValue } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'

const HoldOn = ({
    color,
    marginTop = '10%',
    text = "Checking internet...\nThis may take a while. Please hold on...",
    timeToAppearMs = 4000,
}: {
    color?: ColorValue,
    marginTop?: DimensionValue,
    text?: string,
    timeToAppearMs?: number,
}) => {
    const [show, set_show] = useState(false)

    const style = useMemo(() => {
        return StyleSheet.create({
            master: {
                justifyContent: 'center',
                alignItems: 'center',
                marginTop,
                gap: 10,
            },
            holdOnTxt: {
                color,
                textAlign: 'center',
            }
        })
    }, [color, marginTop])

    useEffect(() => {
        const timeOut = setTimeout(() => {
            set_show(true)
        }, timeToAppearMs)

        return () => {
            clearTimeout(timeOut)
        }
    }, [])

    if (!show)
        return undefined

    return (
        <View style={style.master}>
            <ActivityIndicator color={color} />
            <Text adjustsFontSizeToFit numberOfLines={2} style={style.holdOnTxt}>{text}</Text>
        </View>
    )
}

export default HoldOn