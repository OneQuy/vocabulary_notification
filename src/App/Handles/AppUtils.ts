import { Alert } from "react-native"
import { SafeArrayLength, SafeGetArrayElement, ToCanPrint } from "../../Common/UtilsTS"
import { TranslatedResult } from "../../Common/DeepTranslateApi"
import { PairTime, SavedWordData } from "../Types"
import { TimePickerResult } from "../Components/TimePicker"
import { GetExcludeTimesAsync as GetExcludedTimesAsync, GetIntervalMinAsync, GetLimitWordsPerDayAsync, GetNumDaysToPushAsync, GetPopularityLevelIndexAsync } from "./Settings"
import { SetCurrentAllNotificationsAsync, SetupWordsForSetNotiAsync } from "./WordMan"
import { NotificationOption, cancelAllLocalNotificationsAsync, setNotification } from "../../Common/Nofitication"

const IsLog_SetNotification = true

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

export const TimePickerResultToTimestamp = (idayFromToday: number, time: TimePickerResult): number => {
    const d = new Date()

    d.setDate(d.getDate() + idayFromToday)
    d.setHours(time.hours)
    d.setMinutes(time.minutes)

    return d.setSeconds(0, 0)
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
        lastNotiTick: notiTick,

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

export const SetNotificationAsync = async () : Promise<boolean> => {
    const intervalInMin = await GetIntervalMinAsync()
    const limitWordsPerDay = await GetLimitWordsPerDayAsync()
    const numDaysToPush = await GetNumDaysToPushAsync()
    const excludedTimePairs = await GetExcludedTimesAsync()

    // numPushesPerDay

    const pushTimesPerDay = CalcNotiTimeListPerDay(intervalInMin, excludedTimePairs)

    if (IsLog_SetNotification) {
        console.log('[SetNotificationAsync]',
            'pushTimesPerDay', pushTimesPerDay.length,
            'intervalInMin', intervalInMin)
    }

    // numUniqueWordsPerDay

    const numUniqueWordsPerDay = Math.min(pushTimesPerDay.length, limitWordsPerDay)

    if (IsLog_SetNotification) {
        console.log('[SetNotificationAsync]',
            'numUniqueWordsPerDay', numUniqueWordsPerDay,
            'limitWordsPerDay', limitWordsPerDay)
    }

    // numUniqueWordsOfAllDay

    const numUniqueWordsOfAllDay = numUniqueWordsPerDay * numDaysToPush

    if (IsLog_SetNotification) {
        console.log('[SetNotificationAsync]',
            'numUniqueWordsOfAllDay', numUniqueWordsOfAllDay,
            'numDaysToPush', numDaysToPush)
    }

    // uniqueWordsOfAllDay

    const setupWordsResult = await SetupWordsForSetNotiAsync(numUniqueWordsOfAllDay)

    if (setupWordsResult.error || setupWordsResult.errorText) {
        AlertError(setupWordsResult.error ?? setupWordsResult.errorText)
        return false
    }

    if (SafeArrayLength(setupWordsResult.words) !== numUniqueWordsOfAllDay ||
        !Array.isArray(setupWordsResult.words)) { // ts
        AlertError('[SetNotificationAsync] what? can not fetch enough words')
        return false
    }

    const uniqueWordsOfAllDay = setupWordsResult.words

    // set noti !

    await cancelAllLocalNotificationsAsync()

    const didSetNotiList: SavedWordData[] = []

    for (let iday = 0; iday < numDaysToPush; iday++) { // day by day
        const wordsOfDay = uniqueWordsOfAllDay.slice(iday * numUniqueWordsPerDay, iday * numUniqueWordsPerDay + numUniqueWordsPerDay)

        for (let iPushOfDay = 0; iPushOfDay < pushTimesPerDay.length; iPushOfDay++) { // pushes of day
            const wordToPush = SafeGetArrayElement<SavedWordData>(wordsOfDay, undefined, iPushOfDay, true)

            if (!wordToPush ||
                !wordToPush.localized.translated
            ) {
                AlertError('[SetNotificationAsync] what? wordToPush === undefined OR wordToPush.localized.translated === undefinded')
                return false
            }

            const timestamp = TimePickerResultToTimestamp(iday, pushTimesPerDay[iPushOfDay])

            const noti: NotificationOption = {
                title: wordToPush.word,
                message: wordToPush.localized.translated,
                timestamp,
            }

            setNotification(noti)
            
            didSetNotiList.push({
                word: wordToPush.word,
                localized: wordToPush.localized,
                lastNotiTick: timestamp,
            })
        }
    }

    SetCurrentAllNotificationsAsync(didSetNotiList)

    return true
}