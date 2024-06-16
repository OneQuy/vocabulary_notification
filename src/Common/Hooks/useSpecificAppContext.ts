// NUMBER OF [CHANGE HERE] 1
//
// Created on 23 may 2024 (Coding Vocaby)

import { useCallback, useEffect, useState } from 'react'
import { GetObjectAsync, SetObjectAsync } from '../AsyncStorageUtils'
import { AppContextType, SubscribedData } from '../SpecificType'
import { StorageKey_SubscribeData } from '../../App/Constants/StorageKey'
import PostHog from 'posthog-react-native'
import { SetupAppStateAndStartTrackingAsync } from '../AppStatePersistence'
import { DefaultAppContext } from '../SpecificConstants'
import useLocalText from '../../App/Hooks/useLocalText'
import { AlertAsync } from '../UtilsTS'
import { LoopSetValueFirebase } from '../Firebase/LoopSetValueFirebase'

type UseSpecificAppContextParam = {
    posthog: PostHog,
    onActiveOrUseEffectOnceWithGapAsync?: (isUseEffectOnceOrOnActive: boolean) => Promise<void>,
    onActiveOrUseEffectOnceAsync?: (isUseEffectOnceOrOnActive: boolean) => Promise<void>,
}

const useSpecificAppContext = ({
    posthog,
    onActiveOrUseEffectOnceAsync,
    onActiveOrUseEffectOnceWithGapAsync,
}: UseSpecificAppContextParam) => {
    const [appContextValue, set_appContextValue] = useState<AppContextType>(DefaultAppContext)
    const texts = useLocalText()

    /**
   * undefined is to clear premium
   */
    const onSetSubcribeDataAsync = useCallback(async (subscribedData: SubscribedData | undefined): Promise<void> => {
        set_appContextValue(curValue => {
            return {
                ...curValue,
                subscribedData,
            }
        }
        )

        await SetObjectAsync(StorageKey_SubscribeData, subscribedData)

        // alert success

        if (subscribedData) {
            await AlertAsync('Wohoo!', texts.purchase_success) // alert whenever purchase success or FORCE SET PREMIUM AFTER SPLASH-SCREEN
        }
    }, [texts])

    // init (make sure called once per open)

    useEffect(() => {
        (async () => {
            // check upload firebase value cached

            LoopSetValueFirebase.CheckRunLoopAsync();

            // load subcribe data (from local)

            const subscribedDataOrUndefined = await GetObjectAsync<SubscribedData>(StorageKey_SubscribeData)

            // init app context

            set_appContextValue({ // CHANGE HERE 1
                ...appContextValue,
                subscribedData: subscribedDataOrUndefined,
                onSetSubcribeDataAsync,
            })

            // setup & tracking

            await SetupAppStateAndStartTrackingAsync({
                posthog,
                subscribedData: subscribedDataOrUndefined,
                forceSetPremiumAsync: onSetSubcribeDataAsync,
                onActiveOrUseEffectOnceWithGapAsync,
                onActiveOrUseEffectOnceAsync,
            })
        })()
    }, [])

    return {
        appContextValue,
        onSetSubcribeDataAsync,
    }
}

export default useSpecificAppContext