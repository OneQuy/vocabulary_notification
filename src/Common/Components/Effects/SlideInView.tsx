// Created on 22 June 2024 (Vocaby)

import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions, StyleProp, ViewStyle } from 'react-native';

const SlideInView = ({
    children,
    from = 'right',
    isSpringOrTiming = true,
    duration = 500,
    delay,
    containerStyle,
}: {
    children: React.JSX.Element,
    from?: 'left' | 'right' | 'top' | 'bottom',
    isSpringOrTiming?: boolean,
    duration?: number,
    delay?: number,
    containerStyle?: StyleProp<ViewStyle>,
}) => {
    const translateValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let initialPosition;
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;

        switch (from) {
            case 'left':
                initialPosition = -screenWidth;
                break;
            case 'right':
                initialPosition = screenWidth;
                break;
            case 'top':
                initialPosition = -screenHeight;
                break;
            case 'bottom':
                initialPosition = screenHeight;
                break;
            default:
                initialPosition = -screenWidth;
        }

        translateValue.setValue(initialPosition);

        if (isSpringOrTiming) {
            Animated.spring(translateValue, {
                toValue: 0,
                delay,
                useNativeDriver: true,
            }).start();
        }
        else {
            Animated.timing(translateValue, {
                toValue: 0,
                duration,
                delay,
                useNativeDriver: true,
            }).start();
        }
    }, []);

    const transformStyle =
    {
        transform: [
            {
                translateX: from === 'left' || from === 'right' ? translateValue : 0,
            },
            {
                translateY: from === 'top' || from === 'bottom' ? translateValue : 0
            }
        ],
    };

    return (
        <Animated.View style={[transformStyle, containerStyle]}>
            {children}
        </Animated.View>
    );
};

export default SlideInView