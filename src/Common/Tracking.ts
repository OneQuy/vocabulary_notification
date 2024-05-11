import { Alert } from "react-native"
import { SafeValue, ToCanPrint } from "./UtilsTS"

/**
 * HandleError(resOrError, 'DataToNotification', false)
 */
export const HandleError = (error: any, root: string, alert = true) => {
    // todo
    // tracking

    if (true) { // filter content check if need to check

    }

    // alert

    if (alert) {
        const msg = SafeValue(error?.message, '' + ToCanPrint(error))

        Alert.alert(
            'Oooooops',
            msg)
    }
    else if (__DEV__) {
        const content = `[${root}] ${ToCanPrint(error)}`
        console.error(content);
    }
}