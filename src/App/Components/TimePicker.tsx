import { View } from 'react-native'
import React, { useState } from 'react'

import { TimerPickerModal } from "react-native-timer-picker";
import { ToCanPrint } from '../../Common/UtilsTS';

const TimePicker = () => {
    const [showPicker, setShowPicker] = useState(false);
    const [alarmString, setAlarmString] = useState<
            string | null
        >(null);
    
    return (
        <View style={{backgroundColor: "#514242", alignItems: "center", justifyContent: "center"}}>
            <TimerPickerModal
                visible={showPicker}
                setIsVisible={setShowPicker}
                onConfirm={(pickedDuration) => {
                    setAlarmString(ToCanPrint(pickedDuration));
                    setShowPicker(false);
                }}
                modalTitle="Set Alarm"
                onCancel={() => setShowPicker(false)}
                closeOnOverlayPress
                // LinearGradient={LinearGradient}
                styles={{
                    theme: "dark",
                }}
                modalProps={{
                    overlayOpacity: 0.2,
                }}
            />
        </View>
    )    
}

export default TimePicker