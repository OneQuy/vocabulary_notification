import { Alert } from "react-native"
import { ToCanPrint } from "../../Common/UtilsTS"

// todo
export const HandleError = (title: string, error: any, alert: boolean) => {
    Alert.alert(title, ToCanPrint(error))
}

export const AlertError = (error: any) => {
    Alert.alert(ToCanPrint(error))
}