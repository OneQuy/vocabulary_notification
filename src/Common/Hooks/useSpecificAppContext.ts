// NUMBER OF [CHANGE HERE] 1
//
// Created on 23 may 2024 (Coding Vocaby)

import { useCallback, useEffect, useState } from 'react'
import { GetObjectAsync } from '../AsyncStorageUtils'
import { AppContextType, SubscribedData } from '../SpecificType'
import { StorageKey_SubscribeData } from '../../App/Constants/StorageKey'
import PostHog from 'posthog-react-native'
import { SetupAppStateAndStartTrackingAsync } from '../AppStatePersistence'
import { DefaultAppContext } from '../SpecificConstants'
import { Alert } from 'react-native'
import useLocalText from '../../App/Hooks/useLocalText'

const useSpecificAppContext = (posthog: PostHog) => {
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

        // alert success

        if (subscribedData) {
            Alert.alert('Wohoo!', texts.purchase_success) // alert whenever purchase success or FORCE SET PREMIUM AFTER SPLASH-SCREEN
        }
    }, [texts])

    // init (make sure called once per open)

    useEffect(() => {
        (async () => {
            // load subcribe data

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
            })
        })()
    }, [])

    return {
        appContextValue
    }
}

export default useSpecificAppContext