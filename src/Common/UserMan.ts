import { FirebaseDatabase_GetValueAsyncWithTimeOut, FirebaseDatabase_SetValueAsync, FirebaseDatabaseTimeOutMs } from "./firebase/FirebaseDatabase"
import { SubscribedData, User, UserForcePremiumDataProperty } from "./SpecificType"
import { UserID } from "./UserID"
import { IsValuableArrayOrString } from "./UtilsTS"

const GetUserFirebasePath = (userId?: string) => {
    return `user_data/users/${IsValuableArrayOrString(userId) ? userId : UserID()}`
}

const GetUserFirebasePath_ForcePremiumData = (userId?: string) => {
    return `user_data/users/${IsValuableArrayOrString(userId) ? userId : UserID()}/${UserForcePremiumDataProperty}`
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