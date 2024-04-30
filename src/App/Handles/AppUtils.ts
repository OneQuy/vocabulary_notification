import { Alert } from "react-native"
import { ToCanPrint } from "../../Common/UtilsTS"
import { TranslatedResult } from "../../Common/DeepTranslateApi"
import { SavedWordData } from "../Types"

export const HandleError = (title: string, error: any, alert: boolean) => {
    // todo
    Alert.alert(title, ToCanPrint(error))
}

export const AlertError = (error: any) => {
    Alert.alert(ToCanPrint(error))
}

export const SavedWordToTranslatedResult = (saved: SavedWordData): TranslatedResult => {
    return {
        text: saved.word,
        translated: saved.localized.translated,
    } as TranslatedResult
}

export const TranslatedResultToSavedWord = (translate: TranslatedResult, lang: string, notiTick: number): SavedWordData => {
    return {
        word: translate.text,
        notiTick,

        localized: {
            translated: translate.translated,
            lang,
        },
    } as SavedWordData
}

// export const IsSameSavedWord = (s1: SavedWordData, s2: SavedWordData) => {
//     return (
//         s1.word === s2.word &&
//         s1.localized.translated === s2.localized.translated &&
//         s1.localized.lang === s2.localized.lang
//     )
// }