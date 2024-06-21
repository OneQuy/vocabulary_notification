// NUMBER OF [CHANGE HERE]: 0

// Created on early 2024, Gooday

import { FirebaseDatabase_GetValueAsyncWithTimeOut, FirebaseDatabase_SetValueAsync, FirebaseDatabase_SetValueAsyncWithTimeOut, FirebaseDatabaseTimeOutMs } from "./Firebase/FirebaseDatabase"
import { IsDev } from "./IsDev"
import { SubscribedData, User, UserForcePremiumDataProperty } from "./SpecificType"
import { UserID } from "./UserID"
import { CreateError, IsValuableArrayOrString } from "./UtilsTS"

// path ///////////////////////////////

const GetUserFirebasePath = (userId?: string) => { // main 
    return `user_data/${IsDev() ? 'dev' : 'production'}/users/${IsValuableArrayOrString(userId) ? userId : UserID()}`
}

export const GetUserPropertyFirebasePath = (property: string, userId?: string): string => { // sub 
    return `${GetUserFirebasePath(userId)}/${property}`
}

const GetUserFirebasePath_ForcePremiumData = (userId?: string) => {
    return `${GetUserFirebasePath(userId)}/${UserForcePremiumDataProperty}`
}

// set ///////////////////////////////

/**
 * @returns null if success
 * @returns Error{} if error
 */
export const SetUserValueAsync = async (property: string, value: any, userId?: string): Promise<null | Error> => {
    const firepath = `${GetUserFirebasePath(userId)}/${property}`

    const nullOrError = await FirebaseDatabase_SetValueAsyncWithTimeOut(firepath, value, FirebaseDatabaseTimeOutMs)

    if (nullOrError === null) { // success
        return null
    }
    else { // error
        return CreateError(nullOrError)
    }
}

// get ///////////////////////////////

/**
 * @returns T if success
 * @returns null if no data
 * @returns Error{} if error
 */
export const GetUserValueAsync = async <T>(property: string, userId?: string): Promise<T | null | Error> => {
    const firepath = `${GetUserFirebasePath(userId)}/${property}`

    const userRes = await FirebaseDatabase_GetValueAsyncWithTimeOut(firepath, FirebaseDatabaseTimeOutMs)

    if (userRes.value !== null) { // success
        return userRes.value as T
    }
    else if (userRes.error === null) { // no data
        return null
    }
    else { // error
        return CreateError(userRes.error)
    }
}

/**
 * 
 * user: User if success. undefined if empty data or error
 * 
 * error: undefined or null if success or empty data. error if error
 */
export const GetUserAsync = async (): Promise<{ user: User | undefined, error: any }> => {
    const userRes = await FirebaseDatabase_GetValueAsyncWithTimeOut(GetUserFirebasePath(), FirebaseDatabaseTimeOutMs)

    if (userRes.value) { // success
        return {
            user: userRes.value as User,
            error: undefined
        }
    }
    else { // error
        return {
            user: undefined,
            error: userRes.error
        }
    }
}

// premium ///////////////////////////////

export const GetUserForcePremiumDataAsync = async (userId?: string): Promise<SubscribedData | null> => {
    const userRes = await FirebaseDatabase_GetValueAsyncWithTimeOut(GetUserFirebasePath_ForcePremiumData(userId), FirebaseDatabaseTimeOutMs)

    if (!userRes.value) // error or empty data user
        return null
    else // success
        return userRes.value as SubscribedData
}

export const ClearUserForcePremiumDataAsync = async (userId?: string): Promise<void> => {
    await FirebaseDatabase_SetValueAsync(GetUserFirebasePath_ForcePremiumData(userId), null)
}