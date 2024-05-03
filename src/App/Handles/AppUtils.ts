import { Alert } from "react-native"
import { SafeValue, ToCanPrint } from "../../Common/UtilsTS"
import { TranslatedResult } from "../../Common/DeepTranslateApi"
import { LocalizedData, PairTime, SavedWordData } from "../Types"
import { TimePickerResult } from "../Components/TimePicker"
import { DropTableAsync } from "./LocalizedWordsTable"
import { SetCurrentAllNotificationsAsync } from "./SetupNotification"
import { cancelAllLocalNotificationsAsync } from "../../Common/Nofitication"

const IsLog_SetNotification = true

export const HandleError = (title: string, error: any, alert: boolean) => {
    // todo
    Alert.alert(title, ToCanPrint(error))
}

export const ClearDbAndNotificationsAsync = async () => {
    await DropTableAsync()
    await SetCurrentAllNotificationsAsync([])
    cancelAllLocalNotificationsAsync()
}

export const AlertError = (error: any) => {
    Alert.alert(ToCanPrint(error))
}

export const TimePickerResultToTimestamp = (idayFromToday: number, time: TimePickerResult): number => {
    const d = new Date()

    d.setDate(d.getDate() + idayFromToday)
    d.setHours(time.hours)
    d.setMinutes(time.minutes)

    return d.setSeconds(0, 0)
}

export const ToWordLangString = (word: string, lang: string): string => {
    return `${word}_${lang}`
}

export const ExtractWordFromWordLang = (wordAndLang: string): string => {
    const arr =  wordAndLang.split('_')
    return arr[0]
}

export const CheckDeserializeLocalizedData = (saved: SavedWordData): LocalizedData => {
    if (typeof saved.localizedData === 'string') {
        saved.localizedData = JSON.parse(saved.localizedData) as LocalizedData
    }

    return saved.localizedData
}

export const SavedWordToTranslatedResult = (saved: SavedWordData): TranslatedResult => {
    return {
        text: ExtractWordFromWordLang(saved.wordAndLang)[0],
        translated: CheckDeserializeLocalizedData(saved).translated,
    } as TranslatedResult
}

export const TranslatedResultToSavedWord = (translate: TranslatedResult, lang: string, notiTick: number): SavedWordData => {
    const res: SavedWordData = {
        wordAndLang: ToWordLangString(translate.text, lang),
        lastNotiTick: notiTick,

        localizedData: {
            translated: SafeValue(translate.translated, translate.text),
        },
    }

    return res
}

export const TotalMin = (time: TimePickerResult) => {
    return time.hours * 60 + time.minutes
}

const IsInExcludeTime = (hour: number, minute: number, excludePairs: PairTime[]): boolean => {
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

export const CalcNotiTimeListPerDay = (intervalInMinute: number, excludePairs: PairTime[]): TimePickerResult[] => {
    let lastNoti: TimePickerResult | undefined
    const arr: TimePickerResult[] = []

    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute++) {
            if (IsInExcludeTime(hour, minute, excludePairs))
                continue

            if (lastNoti === undefined) {
                lastNoti = {
                    hours: hour,
                    minutes: minute,
                    seconds: 0
                }

                arr.push(lastNoti)
            }
            else {
                const distanceInMin = TotalMin({ hours: hour, minutes: minute }) - TotalMin(lastNoti)

                if (distanceInMin >= intervalInMinute) {
                    lastNoti = {
                        hours: hour,
                        minutes: minute,
                        seconds: 0
                    }

                    arr.push(lastNoti)
                }
            }
        }
    }

    // LogStringify(arr)

    return arr
}