// Created 15 June 2024 (coding Vocaby)

import AsyncStorage from "@react-native-async-storage/async-storage";
import { TruelyValueType } from "../SpecificType";
import { FirebaseDatabaseTimeOutMs, FirebaseDatabase_SetValueAsyncWithTimeOut } from "./FirebaseDatabase";
import { AlertAsync, CreateError, IsValuableArrayOrString, PickAndRemoveFirstElementArray } from "../UtilsTS";
import { AppendArrayAsync, GetArrayAsync, SetArrayAsync } from "../AsyncStorageUtils";
import { StorageKey_LoopSetValueFirebase } from "../../App/Constants/StorageKey";

const IsLog = __DEV__

export type LoopSetValueFirebaseCacheData = {
    firebasePath: string,
    value: TruelyValueType,
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
            console.log('[LoopSetValueFirebase-CheckRunLoopAsync] start run');

        this.isRunningLoop = true

        while (true) {
            const needContinue = await this.CheckUploadTheNextCacheAsync()

            if (!needContinue) {
                this.isRunningLoop = false
                break
            }
        }
    }

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
    static SetValueAsync = async (
        storageKey: string,
        firebasePath: string,
        value: TruelyValueType,
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
                    console.log('[LoopSetValueFirebase-SetValueAsync] saved local but set fail firebase (cached data)', nullSuccessOrError, 'key', storageKey);

                const pressedRetry = await AlertAsync(
                    alertTitleErrorTxt,
                    alertContentErrorTxt,
                    alertBtnRetryTxt,
                    alertBtnCancelTxt,
                )

                if (pressedRetry) { } // press retry
                else { // press cancel
                    // cache data

                    const cacheData: LoopSetValueFirebaseCacheData = {
                        firebasePath,
                        value,
                    }

                    await AppendArrayAsync<LoopSetValueFirebaseCacheData>(
                        StorageKey_LoopSetValueFirebase,
                        cacheData
                    )

                    // run loop

                    this.CheckRunLoopAsync()

                    // return

                    return CreateError(nullSuccessOrError)
                }
            }
        }
    }
}