import React, { useState, useEffect } from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';

const TextTyper = ({
    text,
    speed = 10,
    textStyle,
}: {
    text: string,
    speed?: number,
    textStyle?: StyleProp<TextStyle>,
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