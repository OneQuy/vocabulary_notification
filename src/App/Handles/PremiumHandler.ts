
// goal: 
//      + can change level within 7 days or did PREMIUM
//      + after that, can change other levels, only use current level.

import { LocalFirstThenFirebaseValue } from "../../Common/LocalFirstThenFirebaseValue"
import { UserProperty_StartUsingAppTick } from "../../Common/SpecificType"
import { GetUserPropertyFirebasePath } from "../../Common/UserMan"
import { AlertAsync, IsNumType } from "../../Common/UtilsTS"
import { StorageKey_StartUsingAppTick } from "../Constants/StorageKey"
import { CanNotSetupUserData, PopupTitleError, RetryText } from "../Hooks/useLocalText"

// logic:
//      + at load screen
//          - check did set start using app tick? only enter app after set
//      + at change level popup:
//          - get start using app tick, premium info (must success)
//              - if within 7 days, can change level
//              - if no, show premium alert

// const IsLog = __DEV__

/**
 * make sure did set in order to enter the app!
 */
export const CheckSetStartUsingAppTickAsync = async (): Promise<void> => {
    const firebasePath = GetUserPropertyFirebasePath(UserProperty_StartUsingAppTick)

    // check did set?

    const value = await LocalFirstThenFirebaseValue.GetValueAsync<number>(
        StorageKey_StartUsingAppTick,
        firebasePath
    )

    if (IsNumType(value)) { // did set
        return
    }

    // need to set

    while (true) {
        const setRes = await LocalFirstThenFirebaseValue.SetValueAsync(
            StorageKey_StartUsingAppTick,
            firebasePath,
            Date.now()
        )

        if (setRes === null) { // set success
            return
        }

        await AlertAsync(
            PopupTitleError,
            CanNotSetupUserData,
            RetryText
        )
    }
}