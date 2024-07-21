// NUMBER OF [CHANGE HERE] 0
//
// Created on 17 Jun 2024, Vocaby

import { StorageKey_DidFetchUserDataOnNewlyInstall, StorageKey_SubscribeData } from "../App/Constants/StorageKey"
import { GetBooleanAsync, SetBooleanAsync } from "./AsyncStorageUtils"
import { FirebasePathAndLocalStorageKey, LocalFirstThenFirebaseValue } from "./Firebase/LocalFirstThenFirebaseValue"
import { UserPremiumDataProperty } from "./SpecificType"
import { GetUserPropertyFirebasePath } from "./UserMan"
import { IsValuableArrayOrString } from "./UtilsTS"

// const IsLog = __DEV__
const IsLog = false

/**
 * only enter app if fetched success (maybe no-data)
 */
export class FetchUserDataOnNewlyInstall {
    private static GetDefaultPathKeys = (): FirebasePathAndLocalStorageKey[] => {
        const arr: FirebasePathAndLocalStorageKey[] = [
            {
                storageKey: StorageKey_SubscribeData,
                firebasePath: GetUserPropertyFirebasePath(UserPremiumDataProperty),
            }
        ]

        return arr
    }

    static CheckFetchAsync = async (
        extraPathAndKeys?: FirebasePathAndLocalStorageKey[]
    ): Promise<void> => {
        const didFetched = await GetBooleanAsync(StorageKey_DidFetchUserDataOnNewlyInstall)

        if (didFetched) {
            if (IsLog)
                console.log('[FetchUserDataOnNewlyInstall] did fetched. no fetch again.');

            return
        }

        let sumArr: FirebasePathAndLocalStorageKey[] = this.GetDefaultPathKeys()

        if (IsValuableArrayOrString(extraPathAndKeys))
            sumArr = sumArr.concat(extraPathAndKeys)

        if (IsLog)
            console.log('[FetchUserDataOnNewlyInstall] fetching....');

        await LocalFirstThenFirebaseValue.MakeSureDidGetSuccessAsync(
            sumArr
        )

        await SetBooleanAsync(StorageKey_DidFetchUserDataOnNewlyInstall, true)
    }
}