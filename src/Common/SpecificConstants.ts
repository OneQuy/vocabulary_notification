// Created on 17 may 2024 (Coding Vocaby)

import { createContext } from "react"
import { AppContextType } from "./SpecificType"

// CHANGE ALL :)

export const AndroidLink = "market://details?id=com.vocabulary_notification"
export const iOSLink = "https://apps.apple.com/us/app/vocabulary-notification-vocaby/id6502538703"
export const ShortLink = "https://onelink.to/45p9ky"

export const AppName = 'Vocaby'

export const ShareAppContent =
'Vocaby is your pocket English tutor, delivering vocabulary lessons directly to your mobile device through convenient notifications. Enhance your English skills effortlessly on the go!' + 
'\n\n' +
'👉 Download now: ' + 
`${ShortLink}`

export const AppContext = createContext<AppContextType>({})