import AsyncStorage from "@react-native-async-storage/async-storage"
import { StorageKey_ExcludedTimes, StorageKey_IntervalMin, StorageKey_LimitWordsPerDay, StorageKey_PopularityIndex, StorageKey_TargetLang } from "../Constants/StorageKey"
import { GetArrayAsync, GetNumberIntAsync, SetArrayAsync, SetNumberAsync } from "../../Common/AsyncStorageUtils"
import { DefaultExcludedTimePairs, DefaultIntervalInMin, DefaultLimitWords as DefaultLimitWordsPerDay } from "../Constants/AppConstants"
import { PairTime } from "../Types"

export const GetTargetLangAsync = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(StorageKey_TargetLang)
}

export const SettTargetLangAsyncAsync = async (lang: string): Promise<void> => {
    await AsyncStorage.setItem(StorageKey_TargetLang, lang)
}


export const GetPopularityLevelIndexAsync = async (): Promise<number> => {
    return await GetNumberIntAsync(StorageKey_PopularityIndex, 0)
}

export const SetPopularityLevelIndexAsync = async (index: number): Promise<void> => {
    await SetNumberAsync(StorageKey_PopularityIndex, index)
}


export const GetIntervalMinAsync = async (): Promise<number> => {
    return await GetNumberIntAsync(StorageKey_IntervalMin, DefaultIntervalInMin)
}

export const SetIntervalMinAsync = async (value: number): Promise<void> => {
    await SetNumberAsync(StorageKey_IntervalMin, value)
}


export const GetLimitWordsPerDayAsync = async (): Promise<number> => {
    return await GetNumberIntAsync(StorageKey_LimitWordsPerDay, DefaultLimitWordsPerDay)
}

export const SetLimitWordsPerDayAsync = async (value: number): Promise<void> => {
    await SetNumberAsync(StorageKey_LimitWordsPerDay, value)
}


export const GetExcludeTimesAsync = async (): Promise<PairTime[]> => {
    const arr = await GetArrayAsync<PairTime>(StorageKey_ExcludedTimes)

    if (!arr)
        return DefaultExcludedTimePairs
    else
        return arr
}

export const SetExcludeTimesAsync = async (pairs: PairTime[]): Promise<void> => {
    await SetArrayAsync(StorageKey_ExcludedTimes, pairs)
}