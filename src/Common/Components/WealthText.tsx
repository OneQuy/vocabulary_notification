// Created on 20 June 2024 (Vocaby)

import React from 'react';
import { View, Text, StyleSheet, StyleProp, TextStyle } from 'react-native';

export type WealthTextConfig = {
    text?: string,
    textStyle?: StyleProp<TextStyle>,
}

const WealthText = ({
    textConfigs
}: {
    textConfigs?: WealthTextConfig[]
}) => {
    if (!textConfigs)
        return

    return (
        <View style={styles.container}>
            {textConfigs.map((config, index) => (
                <Text
                    key={index}
                    style={config.textStyle}
                >
                    {config.text}
                </Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    }
})

export default WealthText