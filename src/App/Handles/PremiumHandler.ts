import { GetBooleanAsync, SetBooleanAsync } from "../../Common/AsyncStorageUtils"
import { UserProperty_StartUsingAppTick } from "../../Common/SpecificType"
import { GetUserValueAsync, SetUserValueAsync } from "../../Common/UserMan"
import { AlertAsync, IsNumType } from "../../Common/UtilsTS"
import { StorageKey_SetStartUsingAppTick } from "../Constants/StorageKey"
import { CanNotSetupUserData, PopupTitleError, RetryText } from "../Hooks/useLocalText"

// goal: 
//      + can change level within 7 days or did PREMIUM
//      + after that, can change other levels, only use current level.

// logic:
//      + at load screen
//          - check did set start using app tick? only enter app after set
//      + at change level popup:
//          - get start using app tick, premium info (must success)
//              - if within 7 days, can change level
//              - if no, show premium alert


export const CheckSetStartUsingAppTickAsync = async (): Promise<void> => {
    // if did set, then no action

    const didSetStartUsingAppTick = await GetBooleanAsync(StorageKey_SetStartUsingAppTick, false)

    if (didSetStartUsingAppTick)
        return


    // need to set, but check if did set on firebase first

    const firebaseTickSet = await GetUserValueAsync<number>(UserProperty_StartUsingAppTick)

    if (IsNumType(firebaseTickSet)) { // already set
        SetBooleanAsync(StorageKey_SetStartUsingAppTick, true)
        return
    }

    // need to set

    const nullSuccessOrError = await SetUserValueAsync(UserProperty_StartUsingAppTick, Date.now())

    if (nullSuccessOrError === null) { // success
        SetBooleanAsync(StorageKey_SetStartUsingAppTick, true)
        return
    }
    else {
        await AlertAsync(
            PopupTitleError,
            CanNotSetupUserData,
            RetryText
        )

        await CheckSetStartUsingAppTickAsync()
    }
}