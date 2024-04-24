// https://github.com/troberts-28/react-native-timer-picker
// style: https://github.com/troberts-28/react-native-timer-picker/blob/main/src/components/TimerPickerModal.styles.ts

import { StyleSheet, View } from 'react-native'
import React from 'react'

import { TimerPickerModal } from "react-native-timer-picker";
import { HexToRgb } from '../../Common/UtilsTS';

type TimePickerResult = {
    hours: number,
    minutes: number,
    seconds: number,
}

const TimePicker = ({
    setIsVisible,
    onConfirm
}: {
    setIsVisible: (visible: boolean) => void,
    onConfirm: (time: TimePickerResult) => void,
}) => {
    return (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: HexToRgb('#000000', 0.7), alignItems: "center", justifyContent: "center" }]}>
            <TimerPickerModal
                visible={true}
                setIsVisible={setIsVisible}
                onConfirm={(pickedDuration) => {
                    onConfirm(pickedDuration)
                    setIsVisible(false);
                }}
                onCancel={() => setIsVisible(false)}
                closeOnOverlayPress
                hideSeconds
                hourLabel={'H'}
                // hourLimit={}
                minuteLabel={'M'}
                styles={{
                    confirmButton: {
                        backgroundColor: 'black',
                        borderWidth: undefined,
                        color: 'white',
                    }
                }}
                // modalTitle="Set Alarm"
            />
        </View>
    )
}

export default TimePicker