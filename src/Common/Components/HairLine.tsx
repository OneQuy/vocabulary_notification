import { View, StyleSheet, DimensionValue, ColorValue } from 'react-native'
import React from 'react'

const HairLine = ({
    marginVertical,
    widthPercent,
    color = 'black',
}: {
    marginVertical?: number,
    widthPercent?: DimensionValue,
    color?: ColorValue,
}) => {
    return (
        <View style={{
            backgroundColor: color,
            width: widthPercent ?? '100%',
            marginVertical,
            height: StyleSheet.hairlineWidth
        }} />
    )
}

export default HairLine