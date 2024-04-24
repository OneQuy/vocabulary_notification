// https://github.com/troberts-28/react-native-timer-picker
// style: https://github.com/troberts-28/react-native-timer-picker/blob/main/src/components/TimerPickerModal.styles.ts

import { StyleSheet, View } from 'react-native'
import React from 'react'

import { TimerPickerModal } from "react-native-timer-picker";
import { GetDayHourMinSecFromMs, HexToRgb } from '../../Common/UtilsTS';

type TimePickerResult = {
    hours: number,
    minutes: number,
    seconds: number,
}

const TimePicker = ({
    initialHour,
    initialMinute,
    setIsVisible,
    onConfirm
}: {
    initialHour: number,
    initialMinute: number,
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
                initialHours={initialHour}
                initialMinutes={initialMinute}
                hideSeconds
                hourLabel={'H'}
                hourLimit={{ min: 0, max: 12 }}
                minuteLabel={'M'}
                styles={{
                    confirmButton: {
                        backgroundColor: 'black',
                        borderWidth: undefined,
                        color: 'white',
                    },

                    cancelButton: {
                        borderColor: 'black',
                        color: 'black',
                    }
                }}
            // modalTitle="Set Alarm"
            />
        </View>
    )
}

export default TimePicker