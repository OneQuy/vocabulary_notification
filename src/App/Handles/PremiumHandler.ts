
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


import { GetBooleanAsync, GetNumberIntAsync, SetBooleanAsync } from "../../Common/AsyncStorageUtils"
import { LocalFirstThenFirebaseValue } from "../../Common/Firebase/LocalFirstThenFirebaseValue"
import { GetAlternativeConfig } from "../../Common/RemoteConfig"
import { UserProperty_StartUsingAppTick } from "../../Common/SpecificType"
import { GetUserPropertyFirebasePath } from "../../Common/UserMan"
import { AlertAsync, DateDiff_WithNow } from "../../Common/UtilsTS"
import { StorageKey_ShowedIntroTrial, StorageKey_StartUsingAppTick } from "../Constants/StorageKey"
import { CanNotSetupUserData, LocalText, PopupTitleError, RetryText } from "../Hooks/useLocalText"
import { SubView } from "../Screens/SetupScreen"

const IsLog = __DEV__

export const HandleBeforeShowPopupPopularityLevelForNoPremiumAsync = async (
    setSubview: (type: SubView) => void,
    texts: LocalText,
): Promise<boolean> => {
    const startUsingAppTick = await GetNumberIntAsync(StorageKey_StartUsingAppTick, 0) // note: startUsingAppTick must be valid, cuz this did set before enter app!

    const diffDays = DateDiff_WithNow(startUsingAppTick)

    const trialDays = GetAlternativeConfig('trialDays', 7)

    if (IsLog) {
        console.log(
            '[HandleBeforeShowPopupPopularityLevelForNoPremiumAsync] startUsingAppTick', startUsingAppTick,
            'trialDAys', trialDays,
            'diffDays', diffDays)
    }

    if (diffDays >= trialDays) { // no premium & exceeded the trial
        const pressedOKOrLifeTime = await AlertAsync(
            texts.popup_error,
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

        if (!showedIntroTrial) { // not showed trial yet => show
            SetBooleanAsync(StorageKey_ShowedIntroTrial, true)

            const pressedOKOrLifeTime = await AlertAsync(
                texts.popularity_level,
                texts.introduce_trial.replaceAll('##', trialDays.toString()),
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
        else // showed intro trial, still in trial
        {
            if (IsLog) {
                console.log('[HandleBeforeShowPopupPopularityLevelForNoPremiumAsync] still in trial',
                    'diffDays', diffDays,
                    'trialDays', trialDays)
            }

            return true
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