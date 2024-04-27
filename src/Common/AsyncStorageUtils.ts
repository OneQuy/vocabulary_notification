import AsyncStorage from "@react-native-async-storage/async-storage"
import { DateDiff, DateDiff_InHour, DateDiff_InMinute, IsNumType, IsToday, IsTodayAndSameHour } from "./UtilsTS"

// boolean =================

export const GetBooleanAsync = async (key: string, defaultValue?: boolean): Promise<boolean> => {
    const s = await AsyncStorage.getItem(key)

    if (!s)
        return defaultValue === undefined ? false : defaultValue

    return s === '1'
}

export const SetBooleanAsync = async (key: string, value: boolean): Promise<void> => {
    await AsyncStorage.setItem(key, value ? '1' : '0')
}

// number =================

/**
 * 
 * @return number or NaN
 */
export const GetNumberFloatAsync = async (key: string, defaultValue?: number): Promise<number> => {
    const s = await AsyncStorage.getItem(key)

    if (!s)
        return defaultValue === undefined ? Number.NaN : defaultValue

    try {
        return Number.parseFloat(s)
    }
    catch {
        return Number.NaN
    }
}

/**
 * 
 * @return number or NaN
 */
export const GetNumberIntAsync = async (key: string, defaultValue?: number): Promise<number> => {
    const s = await AsyncStorage.getItem(key)

    if (!s)
        return defaultValue === undefined ? Number.NaN : defaultValue

    try {
        return Number.parseInt(s)
    }
    catch {
        return Number.NaN
    }
}

export const SetNumberAsync = async (key: string, value: number): Promise<void> => {
    await AsyncStorage.setItem(key, value.toString())
}

/**
 * 
 * @returns lastest saved value (value that after increasing)
 */
export const IncreaseNumberAsync = async (key: string, startAt: number = 0, incUnit: number = 1): Promise<number> => {
    const cur = await GetNumberIntAsync(key, startAt)
    await SetNumberAsync(key, cur + incUnit)
    return cur + incUnit
}

/**
 * 
 * @returns the current the value. after that inc and save
 */
export const LoopNumberAsync = async (key: string, start: number, end: number): Promise<number> => {
    const cur = await GetNumberIntAsync(key, start)

    let next = cur + 1

    if (next > end)
        next = start

    await SetNumberAsync(key, next)

    return cur
}

// date & number =================

/**
 * 
 * @returns lastest saved value (value that after increasing)
 */
export const IncreaseNumberAsync_WithCheckAndResetNewDay = async (key: string, valueNewDay: number = 0, incUnit: number = 1): Promise<number> => {
    let num = await GetNumberIntAsync_WithCheckAndResetNewDay(key, valueNewDay)
    num += incUnit

    const s = `${Date.now()}_${num}`
    await AsyncStorage.setItem(key, s)
    return num
}

export const GetNumberIntAsync_WithCheckAndResetNewDay = async (key: string, valueNewDay: number = 0): Promise<number> => {
    const s = await AsyncStorage.getItem(key)

    if (!s)
        return valueNewDay

    const arr = s.split('_')

    if (!Array.isArray(arr) || arr.length !== 2)
        return valueNewDay

    try {
        const date = new Date(parseInt(arr[0]))

        if (!IsToday(date))
            return valueNewDay

        return parseInt(arr[1])
    }
    catch {
        return valueNewDay
    }
}

/**
 * 
 * @returns 
 * `{
 * 
 *  number: value. If empty or error: defaultNumber
 * 
 *  date: Date. If empty or error: undefined
 * 
 * }`
 */
export const GetPairNumberIntAndDateAsync = async (key: string, defaultNumber = 0): Promise<{ number: number, date: Date | undefined }> => {
    const s = await AsyncStorage.getItem(key)

    if (!s) {
        return {
            number: defaultNumber,
            date: undefined
        }
    }

    const arr = s.split('_')

    if (!Array.isArray(arr) || arr.length !== 2) {
        return {
            number: defaultNumber,
            date: undefined
        }
    }

    try {
        return {
            date: new Date(parseInt(arr[0])),
            number: parseInt(arr[1])
        }
    }
    catch {
        return {
            number: defaultNumber,
            date: undefined
        }
    }
}

/**
 * 
 * @param valueToSetOrDefaultValueForIncrease the value to force set. If just need to inc the old number, fill this the default value if old value not existed
 * @param increaseUnit if force set, leave this param undefined. If need to inc, fill the inc unit here.
 * @returns --- { number, date } with latest saved value
 */
export const SetPairNumberIntAndDateAsync_Now = async (
    key: string,
    valueToSetOrDefaultValueForIncrease: number,
    increaseUnit?: number): Promise<{ number: number, date: Date | undefined }> => {
    let valueToSet = 0

    if (typeof increaseUnit === 'number') { // for inc => need load current value
        const { number } = await GetPairNumberIntAndDateAsync(key, valueToSetOrDefaultValueForIncrease)
        valueToSet = number + increaseUnit
    }
    else
        valueToSet = valueToSetOrDefaultValueForIncrease

    const now = new Date()

    const s = `${now.getTime()}_${valueToSet}`
    await AsyncStorage.setItem(key, s)

    return {
        number: valueToSet,
        date: now,
    }
}

// date =================

export const GetDateAsync = async (key: string): Promise<Date | undefined> => {
    const s = await AsyncStorage.getItem(key)

    if (!s)
        return undefined

    try {
        return new Date(Number.parseInt(s))
    }
    catch {
        return undefined
    }
}

export const GetDateAsync_IsValueExistedAndIsToday = async (key: string): Promise<boolean> => {
    const d = await GetDateAsync(key)

    if (d === undefined)
        return false

    return IsToday(d)
}

export const GetDateAsync_IsValueNotExistedOrEqualOverMinFromNow = async (key: string, min: number): Promise<boolean> => {
    const d = await GetDateAsync(key)

    if (d === undefined)
        return true

    return DateDiff_InMinute(Date.now(), d) >= min
}

export const GetDateAsync_IsValueNotExistedOrEqualOverHourFromNow = async (key: string, hour: number): Promise<boolean> => {
    const d = await GetDateAsync(key)

    if (d === undefined)
        return true

    return DateDiff_InHour(Date.now(), d) >= hour
}

export const GetDateAsync_IsValueNotExistedOrEqualOverDayFromNow = async (key: string, day: number): Promise<boolean> => {
    const d = await GetDateAsync(key)

    if (d === undefined)
        return true

    return DateDiff(Date.now(), d) >= day
}

export const GetDateAsync_IsValueExistedAndIsTodayAndSameHour = async (key: string): Promise<boolean> => {
    const d = await GetDateAsync(key)

    if (d === undefined)
        return false

    return IsTodayAndSameHour(d)
}

export const SetDateAsync = async (key: string, value: number): Promise<void> => {
    await AsyncStorage.setItem(key, value.toString())
}

export const SetDateAsync_Now = async (key: string): Promise<void> => {
    await SetDateAsync(key, Date.now())
}

// array =================

export const StorageGetArrayAsync = async (key: string, separator = '|'): Promise<string[]> => {
    const valueS = await AsyncStorage.getItem(key)

    if (!valueS)
        return []
    else
        return valueS.split(separator)
}

export const StorageAppendToArrayAsync = async (key: string, value: string, separator = '|'): Promise<string> => {
    const old = await AsyncStorage.getItem(key)

    let set: string

    if (old)
        set = `${old}${separator}${value}`
    else
        set = value

    await AsyncStorage.setItem(key, set)

    return set
}