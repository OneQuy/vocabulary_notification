
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


import { GetBooleanAsync, SetBooleanAsync } from "../../Common/AsyncStorageUtils"
import { LocalFirstThenFirebaseValue } from "../../Common/LocalFirstThenFirebaseValue"
import { GetAlternativeConfig } from "../../Common/RemoteConfig"
import { SubscribedData, UserPremiumDataProperty, UserProperty_StartUsingAppTick } from "../../Common/SpecificType"
import { GetUserPropertyFirebasePath } from "../../Common/UserMan"
import { AlertAsync, DateDiff_WithNow, IsNullOrNot_Null_Undefined_ObjectError, IsObjectError, SafeValue } from "../../Common/UtilsTS"
import { StorageKey_ShowedIntroTrial, StorageKey_StartUsingAppTick, StorageKey_SubscribeData } from "../Constants/StorageKey"
import { CanNotSetupUserData, LocalText, PopupTitleError, RetryText } from "../Hooks/useLocalText"
import { HandlingType, SubView } from "../Screens/SetupScreen"

const IsLog = __DEV__

export const HandleBeforeShowPopupPopularityLevelAsync = async (
    setHandling: (type: HandlingType) => void,
    setSubview: (type: SubView) => void,
    onSetSubcribeDataAsync: (subscribedData: SubscribedData | undefined) => Promise<void>,
    texts: LocalText,
): Promise<boolean> => {
    while (true) {
        // in case fetch too long can show loading

        const timeOut = setTimeout(() => setHandling('downloading'), 1000)

        // fetch

        const [
            premiumData,
            startUsingAppTick
        ] = await Promise.all([
            LocalFirstThenFirebaseValue.GetValueAsync<SubscribedData>(
                StorageKey_SubscribeData,
                GetUserPropertyFirebasePath(UserPremiumDataProperty)
            ),
            LocalFirstThenFirebaseValue.GetValueAsync<number>(
                StorageKey_StartUsingAppTick,
                GetUserPropertyFirebasePath(UserProperty_StartUsingAppTick)
            ),
        ])

        if (IsLog) {
            console.log('[HandleBeforeShowPopupPopularityLevelAsync] premium', premiumData, 'startUsingAppTick', startUsingAppTick,
                'IsNullOrNot_Null_Undefined_ObjectError<SubscribedData>(premiumData)', IsNullOrNot_Null_Undefined_ObjectError<SubscribedData>(premiumData),
                'IsNullOrNot_Null_Undefined_ObjectError<number>(startUsingAppTick)', IsNullOrNot_Null_Undefined_ObjectError<number>(startUsingAppTick),
                'IsObjectError(premiumData)', IsObjectError(premiumData),
                'IsObjectError(startUsingAppTick)', IsObjectError(startUsingAppTick)
            )
        }

        // close loading view

        clearTimeout(timeOut)
        setHandling(undefined)

        // success fetch (maybe no-data)

        if (IsNullOrNot_Null_Undefined_ObjectError<SubscribedData>(premiumData) &&
            IsNullOrNot_Null_Undefined_ObjectError<number>(startUsingAppTick)) {
            if (premiumData === null) { // no premium
                // note: startUsingAppTick === null => can NOT happen, cuz this did set before enter app!

                const diffDays = DateDiff_WithNow(SafeValue(startUsingAppTick, 0))

                const trialDays = GetAlternativeConfig('trialDays', 7)

                if (diffDays >= trialDays) { // no premium & exceeded the trial
                    const pressedOKOrLifeTime = await AlertAsync(
                        PopupTitleError,
                        texts.out_of_trial,
                        'OK',
                        texts.lifetime
                    )

                    if (!pressedOKOrLifeTime) { //  pressed Lifetime 
                        setSubview('about')
                    }

                    return false
                }
                else { // no premium & but still in trial
                    // check if showed intro trial?

                    const showedIntroTrial = await GetBooleanAsync(StorageKey_ShowedIntroTrial)

                    if (!showedIntroTrial) {
                        SetBooleanAsync(StorageKey_ShowedIntroTrial, true)

                        const pressedOKOrLifeTime = await AlertAsync(
                            texts.popularity_level,
                            texts.introduce_trial,
                            'OK',
                            texts.lifetime
                        )

                        if (!pressedOKOrLifeTime) { // pressed Lifetime 
                            setSubview('about')
                            return false
                        }
                        else // press OK
                            return true
                    }
                    else // showed intro trial 
                    {
                        if (IsLog) {
                            console.log('[HandleBeforeShowPopupPopularityLevelAsync] still in trial')
                        }

                        return true
                    }
                }
            }
            else { // premium => can enter popup
                onSetSubcribeDataAsync(premiumData)
                return true
            }
        }

        // fetch error need to re-fetch

        else {
            await AlertAsync(
                PopupTitleError,
                CanNotSetupUserData,
                RetryText
            )
        }
    }
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