import React, { useRef, useEffect } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { CommonStyles } from '../../CommonConstants';

const ScaleUpView = ({
    children,
    isSpringOrTiming,
    duration,
    delay,
    containerStyle,
}: {
    children: React.JSX.Element,
    isSpringOrTiming?: boolean,
    duration?: number,
    delay?: number,
    containerStyle?: StyleProp<ViewStyle>,
}) => {
    const scaleValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isSpringOrTiming === true) {
            Animated.spring(scaleValue, {
                toValue: 1,
                delay,
                useNativeDriver: true,
            }).start();
        }
        else {
            Animated.timing(scaleValue, {
                toValue: 1,
                duration,
                delay,
                useNativeDriver: true,
            }).start();
        }
    }, []);

    return (
        <Animated.View style={[CommonStyles.justifyContentCenter_AlignItemsCenter, containerStyle, { transform: [{ scale: scaleValue }] }]}>
            {children}
        </Animated.View>
    );
};

export default ScaleUpView;
