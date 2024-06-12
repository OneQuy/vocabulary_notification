
// goal: 
//      + can change level within 7 days or did PREMIUM
//      + after that, can NOT change other levels, only use current level.
//
// logic:
//      + at load screen
//          - check did set start using app tick? only enter app after did set
//      + at change level popup:
//          - get start using app tick, premium info (must success)
//              - if within 7 days, can change level
//              - if no, show premium alert


import { LocalFirstThenFirebaseValue } from "../../Common/LocalFirstThenFirebaseValue"
import { SubscribedData, UserPremiumDataProperty, UserProperty_StartUsingAppTick } from "../../Common/SpecificType"
import { GetUserPropertyFirebasePath } from "../../Common/UserMan"
import { StorageKey_StartUsingAppTick, StorageKey_SubscribeData } from "../Constants/StorageKey"
import { CanNotSetupUserData, LocalText, PopupTitleError, RetryText } from "../Hooks/useLocalText"
import { HandlingType } from "../Screens/SetupScreen"

// const IsLog = __DEV__

export const HandleBeforeShowPopupPopularityLevelAsync = async (
    setHandling: (type: HandlingType) => void,
    texts: LocalText,
): Promise<boolean> => {
    const timeOut = setTimeout(() => setHandling('downloading'), 1000)

    const [premium] = await Promise.all([
        LocalFirstThenFirebaseValue.GetValueAsync<SubscribedData>(
            StorageKey_SubscribeData,
            GetUserPropertyFirebasePath(UserPremiumDataProperty)
        ),
        LocalFirstThenFirebaseValue.GetValueAsync<SubscribedData>(
            StorageKey_SubscribeData,
            GetUserPropertyFirebasePath(UserPremiumDataProperty)
        ),
    ])

    clearTimeout(timeOut)

    console.log(premium);

    setHandling(undefined)

    return true
}

/**
 * make sure did set in order to enter the app!
 */
export const CheckSetStartUsingAppTickAsync = async (): Promise<void> => {
    const firebasePath = GetUserPropertyFirebasePath(UserProperty_StartUsingAppTick)

    await LocalFirstThenFirebaseValue.MakeSureDidSetOrSetNewAsync(
        StorageKey_StartUsingAppTick,
        firebasePath,
        Date.now(),
        PopupTitleError,
        CanNotSetupUserData,
        RetryText
    )
}