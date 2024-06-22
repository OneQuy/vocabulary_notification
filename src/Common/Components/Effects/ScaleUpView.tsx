import React, { useRef, useEffect } from 'react';
import { Animated, StyleProp, StyleSheet, ViewStyle } from 'react-native';

const ScaleUpView = ({
    children,
    duration,
    delay,
    containerStyle,
}: {
    children: React.JSX.Element,
    duration?: number,
    delay?: number,
    containerStyle?: StyleProp<ViewStyle>,
}) => {
    const scaleValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(scaleValue, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.container, containerStyle, { transform: [{ scale: scaleValue }] }]}>
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        // Add other styles as needed
    },
});

export default ScaleUpView;
