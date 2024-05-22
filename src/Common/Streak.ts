import AsyncStorage from "@react-native-async-storage/async-storage";
import { IsToday, IsYesterday } from "./UtilsTS";
import { StorageKey_Streak } from "../App/Constants/StorageKey";

export const AppStreakId = 'app_streak'

export type Streak = {
    id: string,
    bestStreak: number,
    currentStreak: number,
    lastDateTick: number,
}

var data: Streak[] | undefined = undefined

/**
 * @returns if handled: handled = true
 * @returns if already handled today: handled = false
 */
export async function SetStreakAsync(id: string) {
    // check load data

    if (data === undefined) {
        var s = await AsyncStorage.getItem(StorageKey_Streak)

        if (s)
            data = JSON.parse(s) as Streak[]
        else
            data = []
    }

    // find item

    let todayStreak = data.find(streak => streak.id === id)

    if (!todayStreak) {
        todayStreak = {
            id,
            uniquePostSeen: 0,
            bestStreak: 0,
            currentStreak: 0,
            lastDateTick: new Date(0).getTime(),
        } as Streak

        data.push(todayStreak)
    }

    // set streak

    const lastDate = new Date(todayStreak.lastDateTick)
    let handled = false

    if (!IsToday(lastDate)) {
        handled = true
        todayStreak.lastDateTick = Date.now()
        const isStreak = IsYesterday(lastDate)

        if (isStreak) {
            todayStreak.currentStreak++
        }
        else { // not streak
            todayStreak.currentStreak = 1
        }

        todayStreak.bestStreak = Math.max(todayStreak.bestStreak, todayStreak.currentStreak)
    }

    // save

    AsyncStorage.setItem(StorageKey_Streak, JSON.stringify(data))
    // console.log(JSON.stringify(data, null, 1));

    return {
        handled,
        todayStreak
    }
}

export async function GetStreakAsync(id: string) {
    if (data === undefined) {
        var s = await AsyncStorage.getItem(StorageKey_Streak)

        if (s)
            data = JSON.parse(s) as Streak[]
        else
            data = []
    }

    const item = data.find(streak => streak.id === id)
    return item
}