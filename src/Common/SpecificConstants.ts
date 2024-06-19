// CHANGE ALL :) 
//
// Created on 17 may 2024 (Coding Vocaby)

import { createContext } from "react"
import { AppContextType, SubscribedData } from "./SpecificType"
import { IAPProduct } from "./IAP/IAP"


export const AndroidLink = "market://details?id=com.vocabulary_notification"
export const iOSLink = "https://apps.apple.com/us/app/vocabulary-notification-vocaby/id6502538703"
export const ShortLink = "https://onelink.to/45p9ky"

export const AppName = 'Vocaby'

export const ShareAppContent =
    'Vocaby is your pocket English tutor, delivering vocabulary lessons directly to your mobile device through convenient notifications. Enhance your English skills effortlessly on the go!' +
    '\n\n' +
    '👉 Download now: ' +
    `${ShortLink}`


export const IapProductMax: IAPProduct = {
    sku: 'vocaby_lifetime_max',
    isConsumable: true,
}

export const AllIAPProducts: IAPProduct[] = [
    {
        sku: 'vocaby_lifetime',
        isConsumable: true,
    },
    {
        sku: 'vocaby_lifetime_pro',
        isConsumable: true,
    },
    IapProductMax
]


export const DefaultAppContext: AppContextType = {
    subscribedData: undefined,
    onSetSubcribeDataAsync: async (_: SubscribedData | undefined) => { }
}

export const AppContext = createContext<AppContextType>(DefaultAppContext) // NO CHANGE