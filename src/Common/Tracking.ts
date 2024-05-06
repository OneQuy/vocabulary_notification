import { Alert } from "react-native"
import { ToCanPrint } from "./UtilsTS"

/**
 * HandleError(resOrError, 'DataToNotification', false)
 */
export const HandleError = (error: any, root: string, alert = true) => {
    const content = (root ? (root + '\n\n') : '') + ToCanPrint(error)

    // todo
    // tracking

    if (true) { // filter content check if need to check

    }

    // log 

    console.error(content);

    // alert

    if (alert) {
        Alert.alert(
            'Error',
            content)
    }
}