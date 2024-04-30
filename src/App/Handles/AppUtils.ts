import { Alert } from "react-native"
import { ToCanPrint } from "../../Common/UtilsTS"
import { TranslatedResult } from "../../Common/DeepTranslateApi"
import { PairTime, SavedWordData } from "../Types"
import { TimePickerResult } from "../Components/TimePicker"

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

export const TotalMin = (time: TimePickerResult) => {
    return time.hours * 60 + time.minutes
}

export const IsInExcludeTime = (hour: number, minute: number, excludePairs: PairTime[]): boolean => {
    const totalMin = hour * 60 + minute

    for (let i = 0; i < excludePairs.length; i++) {
        const pair = excludePairs[i]

        const startMin = pair[0].hours * 60 + pair[0].minutes
        const endMin = pair[1].hours * 60 + pair[1].minutes

        if (totalMin >= startMin && totalMin <= endMin)
            return true
    }

    return false
}


// export const IsSameSavedWord = (s1: SavedWordData, s2: SavedWordData) => {
//     return (
//         s1.word === s2.word &&
//         s1.localized.translated === s2.localized.translated &&
//         s1.localized.lang === s2.localized.lang
//     )
// }