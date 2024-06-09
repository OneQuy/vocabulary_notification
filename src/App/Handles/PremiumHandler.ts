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

const IsLog = __DEV__

export const CheckSetStartUsingAppTickAsync = async (): Promise<void> => {
    // if did set, then no action

    const didSetStartUsingAppTick = await GetBooleanAsync(StorageKey_SetStartUsingAppTick, false)

    if (didSetStartUsingAppTick) {
        if (IsLog)
            console.log('[CheckSetStartUsingAppTickAsync] did set (cached)');

        return
    }

    // need to set, but check if did set on firebase first

    const firebaseTickSet = await GetUserValueAsync<number>(UserProperty_StartUsingAppTick)

    if (IsNumType(firebaseTickSet)) { // already set
        if (IsLog)
            console.log('[CheckSetStartUsingAppTickAsync] did set (cached from firebase)', firebaseTickSet);

        SetBooleanAsync(StorageKey_SetStartUsingAppTick, true)
        return
    }

    // need to set

    const now = Date.now()
    const nullSuccessOrError = await SetUserValueAsync(UserProperty_StartUsingAppTick, now)

    if (nullSuccessOrError === null) { // success
        if (IsLog)
            console.log('[CheckSetStartUsingAppTickAsync] set firebase success', now);

        SetBooleanAsync(StorageKey_SetStartUsingAppTick, true)
        return
    }
    else {
        if (IsLog)
            console.log('[CheckSetStartUsingAppTickAsync] set firebase fail', now);

        await AlertAsync(
            PopupTitleError,
            CanNotSetupUserData,
            RetryText
        )

        await CheckSetStartUsingAppTickAsync()
    }
}