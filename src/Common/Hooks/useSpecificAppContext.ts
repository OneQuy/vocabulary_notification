// NUMBER OF [CHANGE HERE] 1
//
// Created on 23 may 2024 (Coding Vocaby)

import { useCallback, useEffect, useState } from 'react'
import { GetObjectAsync } from '../AsyncStorageUtils'
import { AppContextType, DeveloperNote, OnSetSubcribeDataAsyncFunc, OnSetSubcribeDataAsyncFuncParam, RemoteConfig, SubscribedData, UserPremiumDataProperty } from '../SpecificType'
import { StorageKey_SubscribeData } from '../../App/Constants/StorageKey'
import PostHog from 'posthog-react-native'
import { SetupAppStateAndStartTrackingAsync } from '../AppStatePersistence'
import { DefaultAppContext } from '../SpecificConstants'
import useLocalText from '../../App/Hooks/useLocalText'
import { AlertAsync } from '../UtilsTS'
import { LoopSetValueFirebase } from '../Firebase/LoopSetValueFirebase'
import { GetUserPropertyFirebasePath } from '../UserMan'
import { GetRemoteConfigWithCheckFetchAsync } from '../RemoteConfig'
import { GetCalbackDeveloperNote, GetDeveloperNoteAsync, IsNewUpdateAvailableAsync, IsReviewingVersion } from '../SpecificUtils'

type UseSpecificAppContextParam = {
    posthog: PostHog,

    /**
     * should [] deps
     */
    onActiveOrUseEffectOnceWithGapAsync?: (isUseEffectOnceOrOnActive: boolean) => Promise<void>,

    /**
     * should [] deps
     */
    onActiveOrUseEffectOnceAsync?: (isUseEffectOnceOrOnActive: boolean) => Promise<void>,

    /**
     * should [] deps
     */
    onReloadedRemoteConfigAsync?: (_: RemoteConfig | undefined) => Promise<void>,
}

const useSpecificAppContext = ({
    posthog,
    onActiveOrUseEffectOnceAsync,
    onActiveOrUseEffectOnceWithGapAsync,
    onReloadedRemoteConfigAsync,
}: UseSpecificAppContextParam) => {
    const texts = useLocalText()

    const [appContextValue, set_appContextValue] = useState<AppContextType>(DefaultAppContext)
    const [showUpdateLine, set_showUpdateLine] = useState(false)
    const [developerNote, set_developerNote] = useState<undefined | DeveloperNote>(undefined)
    const [callbackDeveloperNote, set_callbackDeveloperNote] = useState<undefined | { callback: () => void }>(undefined)

    /**
     * undefined is to clear premium
     */
    const onSetSubcribeDataAsync: OnSetSubcribeDataAsyncFunc = useCallback(async (subscribedData: OnSetSubcribeDataAsyncFuncParam): Promise<void> => {
        console.log('[onSetSubcribeDataAsync] subscribedData', subscribedData);

        let data: SubscribedData | undefined = undefined

        if (typeof subscribedData === 'string') {
            data = {
                id: subscribedData,
                purchasedTick: Date.now(),
            } as SubscribedData
        }
        else
            data = subscribedData

        // save local & firebase (maybe loop)

        await LoopSetValueFirebase.SetValueAsync(
            StorageKey_SubscribeData,
            GetUserPropertyFirebasePath(UserPremiumDataProperty),
            data,
            texts.popup_error,
            texts.purchased_but_cannot_sync,
            texts.retry,
            texts.later
        )

        // set useContext (update ui)

        set_appContextValue(curValue => {
            return {
                ...curValue,
                subscribedData: data,
            }
        })

        // alert success

        if (data) {
            await AlertAsync('Wohoo!', texts.purchase_success) // alert whenever purchase success or FORCE SET PREMIUM AFTER SPLASH-SCREEN
        }
    }, [texts])

    const onDidReloadRemoteConfig = useCallback(async (remoteConfig: RemoteConfig | undefined): Promise<void> => {
        set_appContextValue(current => {
            return {
                ...current,
                isReviewMode: IsReviewingVersion(remoteConfig),
            }
        })

        if (onReloadedRemoteConfigAsync)
            await onReloadedRemoteConfigAsync(remoteConfig)
    }, []) // should []

    const mainOnActiveOrUseEffectOnceAsync = useCallback(async (isUseEffectOnceOrOnActive: boolean) => {
        if (onActiveOrUseEffectOnceAsync)
            await onActiveOrUseEffectOnceAsync(isUseEffectOnceOrOnActive)

        // load

        const [
            updateLine,
            developerNote
        ] = await Promise.all([
            IsNewUpdateAvailableAsync(),
            GetDeveloperNoteAsync()
        ])

        // update app line

        set_showUpdateLine(updateLine)

        // update app line

        set_developerNote(developerNote)

        if (developerNote) {
            const callback = GetCalbackDeveloperNote(developerNote)
            set_callbackDeveloperNote(callback === undefined ? undefined : { callback })
        }

        // log

        // console.log("[mainOnActiveOrUseEffectOnceAsync] isUseEffectOnceOrOnActive", isUseEffectOnceOrOnActive);
    }, []) // must []

    // init (make sure called once per open)

    useEffect(() => {
        (async () => {
            // check upload firebase value cached

            LoopSetValueFirebase.CheckRunLoopAsync();

            // load subcribe data (from local)

            const subscribedDataOrUndefined = await GetObjectAsync<SubscribedData>(StorageKey_SubscribeData)

            // remote config

            const remoteConfig = await GetRemoteConfigWithCheckFetchAsync()

            // init app context

            set_appContextValue(curValue => { // CHANGE HERE 1 (OPTIONAL)
                return {
                    ...curValue,
                    subscribedData: subscribedDataOrUndefined,
                    onSetSubcribeDataAsync,
                    isReviewMode: IsReviewingVersion(remoteConfig),
                }
            })

            // setup & tracking

            await SetupAppStateAndStartTrackingAsync({
                posthog,
                subscribedData: subscribedDataOrUndefined,
                forceSetPremiumAsync: onSetSubcribeDataAsync,
                onActiveOrUseEffectOnceWithGapAsync,
                onActiveOrUseEffectOnceAsync: mainOnActiveOrUseEffectOnceAsync,
                onReloadedRemoteConfigAsync: onDidReloadRemoteConfig,
            })
        })()
    }, [])

    return {
        appContextValue,
        showUpdateLine,

        /**
         * ### usage:
         * ``` tsx
         *  developerNote &&
            <TouchableOpacity activeOpacity={callbackDeveloperNote ? 0.2 : 1} onPress={callbackDeveloperNote} style={CommonStyles.justifyContentCenter_AlignItemsCenter}>
            <Text
                style={[
                style.devNoteTxt, // default style
                IsValuableArrayOrString(developerNote.color) ? { color: developerNote.color } : undefined, // override color
                { textDecorationLine: callbackDeveloperNote ? 'underline' : 'none' }, // override underline
                ]}
            >
                {developerNote.content}
            </Text>
            </TouchableOpacity>
         * ``` 
         */
        developerNote,
        callbackDeveloperNote: callbackDeveloperNote?.callback,
    }
}

export default useSpecificAppContext