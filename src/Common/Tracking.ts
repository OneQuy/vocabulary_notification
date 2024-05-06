import { Alert } from "react-native"
import { ToCanPrint } from "./UtilsTS"

/**
 * HandleError('what? can not fetch enough words', 'SetNotificationAsync-X', false)
 */
export const HandleError = (error: any, typeTracking?: string, alert = true) => {
    // todo
    // tracking
    
    // alert

    if (alert) {
        Alert.alert(
            'Error',
            (typeTracking ? (typeTracking + '\n\n') : '') + ToCanPrint(error))
    }
}