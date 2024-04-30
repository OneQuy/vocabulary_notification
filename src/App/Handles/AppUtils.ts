import { Alert } from "react-native"
import { ToCanPrint } from "../../Common/UtilsTS"
import { TranslatedResult } from "../../Common/DeepTranslateApi"
import { PairTime, SavedWordData } from "../Types"
import { TimePickerResult } from "../Components/TimePicker"
import { GetExcludeTimesAsync as GetExcludedTimesAsync, GetIntervalMinAsync, GetLimitWordsPerDayAsync, GetNumDaysToPushAsync, GetPopularityLevelIndexAsync } from "./Settings"

// export const IsSameSavedWord = (s1: SavedWordData, s2: SavedWordData) => {
//     return (
//         s1.word === s2.word &&
//         s1.localized.translated === s2.localized.translated &&
//         s1.localized.lang === s2.localized.lang
//     )
// }

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

const CalcNotiTimeListPerDay = (intervalInMinute: number, excludePairs: PairTime[]): TimePickerResult[] => {
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

export const SetNotificationAsync = async () => {
    const popularityLevelIdx = await GetPopularityLevelIndexAsync()
    const intervalInMin = await GetIntervalMinAsync()
    const limitWordsPerDay = await GetLimitWordsPerDayAsync()
    const numDaysToPush = await GetNumDaysToPushAsync()
    const excludedTimePairs = await GetExcludedTimesAsync()

    // numPushesPerDay

    const notiTimeListPerDay = CalcNotiTimeListPerDay(intervalInMin, excludedTimePairs)

    const numPushesPerDay = notiTimeListPerDay.length

    // numUniqueWordsPerDay
    
    const numUniqueWordsPerDay = Math.min(numPushesPerDay, limitWordsPerDay)

    // numUniqueWordsOfAllDay
}