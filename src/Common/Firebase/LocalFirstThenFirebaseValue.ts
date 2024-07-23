// Created 10 June 2024 (coding Vocaby)

import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseDatabaseTimeOutMs, FirebaseDatabase_GetValueAsyncWithTimeOut, FirebaseDatabase_SetValueAsyncWithTimeOut } from "./FirebaseDatabase";
import { AlertAsync, CreateError, IsObjectError } from "../UtilsTS";
import { TruelyValueType } from "../SpecificType";

// const IsLog = __DEV__
const IsLog = false

export type FirebasePathAndLocalStorageKey = {
    storageKey: string,
    firebasePath: string,
}

export class LocalFirstThenFirebaseValue {
    /**
     ** #### how it works:
     ** check get local first:
     **      + if available: return value. done. (already done set on firebase)
     **      + if no available: 
     **          - fetch firebase (notice the note below)
     **          - save value local if sucess
     * 
     ** #### note: get function of firebase can return a valid value if previously did called 'set' even fail
     **  
     ** 
     * @returns T if success get (either local or firebase) (notice the note above)
     * @returns null if no data (both local & firebase)
     * @returns Error{} if error (when fetch froom firebase)
     */
    static GetValueAsync = async <T extends TruelyValueType>(storageKey: string, firebasePath: string): Promise<T | null | Error> => {
        // if did set local, then no action

        const savedLocalValue = await AsyncStorage.getItem(storageKey)

        if (savedLocalValue !== null) { //  already saved local
            if (IsLog)
                console.log('[LocalFirstThenFirebaseValue] get value (local) success', savedLocalValue, 'key', storageKey);

            return JSON.parse(savedLocalValue) as T
        }

        // check if did set on firebase

        const fetchResult = await FirebaseDatabase_GetValueAsyncWithTimeOut(firebasePath, FirebaseDatabaseTimeOutMs)

        if (fetchResult.value !== null) { // success fetched firebase => save to local
            const value = fetchResult.value as T

            // save to local

            await AsyncStorage.setItem(storageKey, JSON.stringify(value))

            // return

            if (IsLog)
                console.log('[LocalFirstThenFirebaseValue] get value (firebase) success and saved to local', value, 'firebasePath', firebasePath);

            return value
        }
        else if (fetchResult.error === null) { // no data
            if (IsLog)
                console.log('[LocalFirstThenFirebaseValue] get value (firebase) no-data', 'firebasePath', firebasePath);

            return null
        }
        else { // error
            if (IsLog)
                console.log('[LocalFirstThenFirebaseValue] get value (firebase) fail', 'firebasePath', firebasePath, fetchResult.error);

            return CreateError(fetchResult.error)
        }
    }


    /**
     ** #### how it works: save firebase first. if success: save local
     *
     * @returns null if success (saved both local and firebase)
     * @returns Error{} or other error if fail (failed both local and firebase)
     */
    static SetValueAsync = async <T extends TruelyValueType>(storageKey: string, firebasePath: string, value: T): Promise<null | Error> => {
        // save to firebase

        const nullSuccessOrError = await FirebaseDatabase_SetValueAsyncWithTimeOut(firebasePath, value, FirebaseDatabaseTimeOutMs)

        if (nullSuccessOrError === null) { // success
            // save to local

            await AsyncStorage.setItem(storageKey, JSON.stringify(value))

            if (IsLog)
                console.log('[LocalFirstThenFirebaseValue] set value success (both local & firebase)', value, 'key', storageKey);

            return null
        }
        else { // error
            if (IsLog)
                console.log('[LocalFirstThenFirebaseValue] set value fail (both firebase & local)', nullSuccessOrError, 'key', storageKey);

            return CreateError(nullSuccessOrError)
        }
    }

    /**
    ** #### how it works: only pass this func if did get successfully (maybe no-data)
    ** #### save to local if success.
    */
    static MakeSureDidGetSuccessAsync = async (
        firebasePathAndLocalStorageKeyArr: FirebasePathAndLocalStorageKey[],
        alertTitleErrorTxt = 'Error',
        alertContentErrorTxt = 'Can not fetch data. Please check your internet and try again.',
        alertBtnRetryTxt = 'Retry',
    ): Promise<void> => {
        while (true) {
            const valueNullOrErrorArr = await Promise.all(
                firebasePathAndLocalStorageKeyArr.map(pathAndKey =>
                    LocalFirstThenFirebaseValue.GetValueAsync(
                        pathAndKey.storageKey,
                        pathAndKey.firebasePath
                    )
                )
            )

            const firstError = valueNullOrErrorArr.find(valueNullOrError => IsObjectError(valueNullOrError))

            if (firstError || valueNullOrErrorArr.length !== firebasePathAndLocalStorageKeyArr.length) { // has at least a error
                await AlertAsync(
                    alertTitleErrorTxt,
                    alertContentErrorTxt,
                    alertBtnRetryTxt
                )
            }
            else // success all => save local
            {
                // save to local

                for (let i = 0; i < valueNullOrErrorArr.length; i++) {
                    const pathKey = firebasePathAndLocalStorageKeyArr[i]
                    const value = valueNullOrErrorArr[i]

                    if (value) {
                        if (IsLog) {
                            console.log('[LocalFirstThenFirebaseValue-MakeSureDidGetSuccessAsync] (GET success ALL) saving to local key', pathKey.storageKey, 'value', value, 'type', typeof value);
                        }

                        await AsyncStorage.setItem(pathKey.storageKey, JSON.stringify(value))
                    }
                    else { // no-data, not save
                        if (IsLog) {
                            console.log('[LocalFirstThenFirebaseValue-MakeSureDidGetSuccessAsync] (GET success ALL) no-data, not save key', pathKey.storageKey);
                        }
                    }
                }

                // quit

                return
            }
        }
    }

    /**
     ** #### usage:
     * ```tss
     * valueOrGetFuncIfSetNew: async () => { return await InternetTime.LoopFetchTillSucessAsync() }
     * ```

    ** #### how it works: only pass this func if did set successfully
    ** (1) check get local first:
    **      + if available: return. done. (already did set both local & firebase)
    **      + if no available: (2)
    ** (2) fetch firebase
    **      + if sucess (and have value): done (did set both local & firebase)
    **      + if sucess (and no value): (3)
    **      + if fail => loop: (2)
    ** (3) set firebase
    **      + if sucess: done (did set both local & firebase)
    **      + if fail => loop: (3)
    */
    static MakeSureDidSetOrSetNewAsync = async <T extends TruelyValueType>(
        storageKey: string,
        firebasePath: string,
        valueOrGetFuncIfSetNew: T | (() => Promise<T>),
        alertTitleErrorTxt = 'Error',
        alertContentErrorTxt = 'Can not setup data. Please check your internet and try again.',
        alertBtnRetryTxt = 'Retry',
    ): Promise<void> => {
        // check if did set

        while (true) {
            const value = await LocalFirstThenFirebaseValue.GetValueAsync<T>(
                storageKey,
                firebasePath
            )

            if (value !== null && !IsObjectError(value)) { // did set (local & firebase)
                if (IsLog)
                    console.log('[LocalFirstThenFirebaseValue-MakeSureDidSetOrSetNewNowAsync] GET success, value', value, 'key', storageKey);

                return
            }
            else if (value === null) { // no value => need to set new
                if (IsLog)
                    console.log('[LocalFirstThenFirebaseValue-MakeSureDidSetOrSetNewNowAsync] GET success but no-data', 'key', storageKey);

                break
            }
            else { // error => need to re-fetch
                if (IsLog)
                    console.log('[LocalFirstThenFirebaseValue-MakeSureDidSetOrSetNewNowAsync] GET failed', 'key', storageKey);

                await AlertAsync(
                    alertTitleErrorTxt,
                    alertContentErrorTxt,
                    alertBtnRetryTxt
                )
            }
        }

        // need to set

        while (true) {
            const valueToSetNew = typeof valueOrGetFuncIfSetNew === 'function' ?
                await valueOrGetFuncIfSetNew() :
                valueOrGetFuncIfSetNew

            const setRes = await LocalFirstThenFirebaseValue.SetValueAsync(
                storageKey,
                firebasePath,
                valueToSetNew
            )

            // set success

            if (setRes === null) {
                if (IsLog)
                    console.log('[LocalFirstThenFirebaseValue-MakeSureDidSetOrSetNewNowAsync] SET success, value', valueOrGetFuncIfSetNew, 'key', storageKey);

                return
            }

            // set failed

            if (IsLog)
                console.log('[LocalFirstThenFirebaseValue-MakeSureDidSetOrSetNewNowAsync] SET failed', 'key', storageKey);

            await AlertAsync(
                alertTitleErrorTxt,
                alertContentErrorTxt,
                alertBtnRetryTxt
            )
        }
    }
}