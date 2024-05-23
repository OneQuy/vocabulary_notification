import React, { useCallback, useEffect, useState } from 'react'
import { GetObjectAsync } from '../../Common/AsyncStorageUtils'
import { AppContextType, SubscribedData } from '../../Common/SpecificType'
import { StorageKey_SubscribeData } from '../Constants/StorageKey'
import PostHog from 'posthog-react-native'
import { SetupAppStateAndStartTrackingAsync } from '../../Common/AppStatePersistence'
import { DefaultAppContext } from '../../Common/SpecificConstants'

const useAppContext = (posthog: PostHog) => {
    const [appContextValue, set_appContextValue] = useState<AppContextType>(DefaultAppContext)

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

        if (subscribedData) {

        }
    }, [])

    // init (make sure called once per open)

    useEffect(() => {
        (async () => {
            // load subcribe data

            const subscribedDataOrUndefined = await GetObjectAsync<SubscribedData>(StorageKey_SubscribeData)

            // init app context

            set_appContextValue({
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

export default useAppContext