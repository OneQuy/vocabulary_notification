// Created on 22 June 2024 (Vocaby)

import React, { useState, useEffect } from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';

const TextTyper = ({
    text,
    speed = 10,
    textStyle,
    onFinished,
}: {
    text: string,
    speed?: number,
    textStyle?: StyleProp<TextStyle>,
    onFinished?: () => void,
}) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let currentText = '';
        let currentIndex = 0;

        const intervalId = setInterval(() => {
            if (currentIndex < text.length) {
                currentText += text[currentIndex];
                setDisplayedText(currentText);
                currentIndex++;
            } else {
                clearInterval(intervalId);

                if (onFinished)
                    onFinished()
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, speed]);

    return (
        <Text style={textStyle}>
            {displayedText}
        </Text>
    );
}

export default TextTyper