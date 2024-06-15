// Created 15 June 2024 (coding Vocaby)

import AsyncStorage from "@react-native-async-storage/async-storage";
import { TruelyValueType } from "../SpecificType";
import { FirebaseDatabaseTimeOutMs, FirebaseDatabase_SetValueAsyncWithTimeOut } from "./FirebaseDatabase";
import { AlertAsync, CreateError } from "../UtilsTS";

const IsLog = __DEV__

export class LoopSetValueFirebase {
    /**
     * 1. save local first
     * 2. save firebase (1)
     *  + if success: return
     *  + if fail: show alert
     *      - if press Retry: (1)
     *      - if press Cancel: backup key-value, run loop
     * 
     * @returns null if success (both local & firebase)
     * @returns Error{} if saved local success but failed save to firebase (and run loop)
     */
    static SetValueAsync = async <T extends TruelyValueType>(
        storageKey: string,
        firebasePath: string,
        value: T,
        alertTitleErrorTxt = 'Error',
        alertContentErrorTxt = 'Can not sync data. Please check your internet and try again.',
        alertBtnRetryTxt = 'Retry',
        alertBtnCancelTxt = 'Cancel',
    ): Promise<null | Error> => {
        // save to local first

        await AsyncStorage.setItem(storageKey, JSON.stringify(value))

        // save to firebase

        while (true) {
            const nullSuccessOrError = await FirebaseDatabase_SetValueAsyncWithTimeOut(
                firebasePath,
                value,
                FirebaseDatabaseTimeOutMs
            )

            // success

            if (nullSuccessOrError === null) {
                if (IsLog)
                    console.log('[LoopSetValueFirebase-SetValueAsync] set success (both local & firebase)', value, 'key', storageKey);

                return null
            }

            // error

            else {
                if (IsLog)
                    console.log('[LoopSetValueFirebase-SetValueAsync] saved local but set fail firebase', nullSuccessOrError, 'key', storageKey);

                const pressedRetry = await AlertAsync(
                    alertTitleErrorTxt,
                    alertContentErrorTxt,
                    alertBtnRetryTxt,
                    alertBtnCancelTxt,
                )

                if (pressedRetry) { } // press retry
                else { // press cancel
                    return CreateError(nullSuccessOrError)
                }
            }
        }
    }
}