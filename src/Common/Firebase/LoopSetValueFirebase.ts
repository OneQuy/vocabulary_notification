// Created 15 June 2024 (coding Vocaby)

import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseDatabaseTimeOutMs, FirebaseDatabase_SetValueAsyncWithTimeOut } from "./FirebaseDatabase";
import { AlertAsync, CreateError, IsValuableArrayOrString, PickAndRemoveFirstElementArray } from "../UtilsTS";
import { AppendArrayAsync, GetArrayAsync, SetArrayAsync } from "../AsyncStorageUtils";
import { StorageKey_LoopSetValueFirebase } from "../../App/Constants/StorageKey";

// const IsLog = __DEV__
const IsLog = false

export type LoopSetValueFirebaseCacheData = {
    firebasePath: string,
    value: any,
}

export class LoopSetValueFirebase {
    private static isRunningLoop: boolean = false

    /**
     * return true to continue upload the next one
     * return false to finish the loop
     */
    private static CheckUploadTheNextCacheAsync = async (): Promise<boolean> => {
        const dataArr = await GetArrayAsync<LoopSetValueFirebaseCacheData>(StorageKey_LoopSetValueFirebase)

        // no item

        if (!IsValuableArrayOrString(dataArr)) {
            if (IsLog)
                console.log('[LoopSetValueFirebase-CheckUploadTheNextCacheAsync] no item to upload');

            return false
        }

        // start set

        const firstItem: LoopSetValueFirebaseCacheData = dataArr[0]

        const nullSuccessOrError = await FirebaseDatabase_SetValueAsyncWithTimeOut(
            firstItem.firebasePath,
            firstItem.value,
            FirebaseDatabaseTimeOutMs
        )

        // success

        if (nullSuccessOrError === null) {
            PickAndRemoveFirstElementArray(dataArr)

            await SetArrayAsync(StorageKey_LoopSetValueFirebase, dataArr)

            const needContinue = IsValuableArrayOrString(dataArr)

            if (IsLog)
                console.log('[LoopSetValueFirebase-CheckUploadTheNextCacheAsync] set success (firebase) value: ', firstItem.value,
                    ', path', firstItem.firebasePath,
                    ', dataArr', dataArr.length,
                    ', out of item?', !needContinue)

            return needContinue // run next one or stop
        }

        // error

        else {
            if (IsLog)
                console.log('[LoopSetValueFirebase-CheckUploadTheNextCacheAsync] set fail (firebase) value: ', firstItem.value,
                    ', path', firstItem.firebasePath,
                    ', error', nullSuccessOrError)

            return true // run next one
        }
    }

    /**
     * #### not need to await
     * #### can called multi times
     */
    static CheckRunLoopAsync = async (): Promise<void> => {
        // if (IsLog)
        //     console.log('[LoopSetValueFirebase-CheckRunLoopAsync] is running?', this.isRunningLoop);

        if (this.isRunningLoop)
            return

        if (IsLog)
            console.log('[LoopSetValueFirebase-CheckRunLoopAsync] start looping');

        this.isRunningLoop = true

        while (true) {
            const needContinue = await this.CheckUploadTheNextCacheAsync()

            if (!needContinue) {
                this.isRunningLoop = false

                if (IsLog)
                    console.log('[LoopSetValueFirebase-CheckRunLoopAsync] exit looping');

                break
            }
        }
    }

    /**
     * 1. save local first
     * 2. save firebase (1)
     *  + if success: return
     *  + if fail: backup key-value to local
     *      + if not show alert: run loop
     *      + if show alert
     *          - if press Retry: (1)
     *          - if press Cancel: run loop
     * 
     * @returns null if success (both local & firebase)
     * @returns Error{} if saved local success but failed save to firebase (and run loop)
     */
    static SetValueAsync = async (
        storageKey: string,
        firebasePath: string,
        value: any,
        alertTitleErrorTxt = 'Error',
        alertContentErrorTxt = 'Can not sync data. Please check your internet and try again.',
        alertBtnRetryTxt = 'Retry',
        alertBtnLaterTxt = 'Later',
        notShowAlert = false,
    ): Promise<null | Error> => {
        // save to local first

        if (value !== null && value !== undefined)
        await AsyncStorage.setItem(storageKey, JSON.stringify(value))
        else
            await AsyncStorage.removeItem(storageKey)

        // save to firebase

        let failAndDidSetRunLoop = false

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
                    console.log('[LoopSetValueFirebase-SetValueAsync] saved local but set fail firebase', nullSuccessOrError, 'key', storageKey, 'did cached data', failAndDidSetRunLoop);

                // cache data (right here cuz of preventing user from quite app completely)

                if (!failAndDidSetRunLoop) {
                    failAndDidSetRunLoop = true

                    const cacheData: LoopSetValueFirebaseCacheData = {
                        firebasePath,
                        value,
                    }

                    await AppendArrayAsync<LoopSetValueFirebaseCacheData>(
                        StorageKey_LoopSetValueFirebase,
                        cacheData
                    )
                }

                // alert

                const pressedRetry = notShowAlert ?
                    false :
                    await AlertAsync(
                        alertTitleErrorTxt,
                        alertContentErrorTxt,
                        alertBtnRetryTxt,
                        alertBtnLaterTxt,
                    )

                if (pressedRetry) { } // press retry
                else { // press later
                    // run loop

                    this.CheckRunLoopAsync()

                    return CreateError(nullSuccessOrError)
                }
            }
        }
    }
}