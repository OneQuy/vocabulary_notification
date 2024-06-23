// Created on 23 June 2024 (Vocaby)

import React, { useState, useEffect } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

const FlickerView = ({
    children,
    enable = true,
    interval = 500,
    containerStyle,
}: {
    children: React.JSX.Element,
    enable?: boolean,
    interval?: number,
    containerStyle?: StyleProp<ViewStyle>,
}) => {
    const [opacity, set_opacity] = useState(1);

    useEffect(() => {
        if (!enable) {
            set_opacity(1)
            return
        }
        
        const intervalId = setInterval(() => {
            set_opacity(val => val === 0 ? 1 : 0)
        }, interval);

        return () => clearInterval(intervalId);
    }, [enable]);

    return (
        <View style={[containerStyle, { opacity }]}>
            {children}
        </View>
    );
}

export default FlickerView