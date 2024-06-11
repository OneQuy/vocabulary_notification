import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseDatabaseTimeOutMs, FirebaseDatabase_GetValueAsyncWithTimeOut, FirebaseDatabase_SetValueAsyncWithTimeOut } from "./Firebase/FirebaseDatabase";
import { CreateError } from "./UtilsTS";

const IsLog = __DEV__

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
    static GetValueAsync = async <T>(storageKey: string, firebasePath: string): Promise<T | null | Error> => {
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
    static SetValueAsync = async (storageKey: string, firebasePath: string, value: any): Promise<null | Error> => {
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
}