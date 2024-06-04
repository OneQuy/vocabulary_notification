import AsyncStorage from "@react-native-async-storage/async-storage"
import { StorageKey_ExcludedTimes, StorageKey_IntervalMin, StorageKey_LimitWordsPerDay, StorageKey_NumDaysToPush, StorageKey_PopularityIndex, StorageKey_SourceLang, StorageKey_TargetLang, StorageKey_TranslationService } from "../Constants/StorageKey"
import { GetArrayAsync, GetNumberIntAsync, SetArrayAsync, SetNumberAsync } from "../../Common/AsyncStorageUtils"
import { DefaultExcludedTimePairs, DefaultIntervalInMin, DefaultLimitWords as DefaultLimitWordsPerDay, DefaultNumDaysToPush, TranslationServicePresets } from "../Constants/AppConstants"
import { PairTime, TranslationService } from "../Types"
import { PickRandomElement } from "../../Common/UtilsTS"

export const GetSourceLangAsync = async (): Promise<string> => {
    return await AsyncStorage.getItem(StorageKey_SourceLang) || 'en'
}

export const SetSourceLangAsyncAsync = async (lang: string): Promise<void> => {
    await AsyncStorage.setItem(StorageKey_SourceLang, lang)
}


export const GetTargetLangAsync = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(StorageKey_TargetLang)
}

export const SetTargetLangAsyncAsync = async (lang: string | undefined): Promise<void> => {
    if (lang)
        await AsyncStorage.setItem(StorageKey_TargetLang, lang)
    else
        await AsyncStorage.removeItem(StorageKey_TargetLang)
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

// export const GetNumDaysToPushAsync = async (): Promise<number> => {
//     return await GetNumberIntAsync(StorageKey_NumDaysToPush, DefaultNumDaysToPush)
// }

// export const SetNumDaysToPushAsync = async (value: number): Promise<void> => {
//     await SetNumberAsync(StorageKey_NumDaysToPush, value)
// }


export const GetExcludeTimesAsync = async (): Promise<PairTime[]> => {
    const arr = await GetArrayAsync<PairTime>(StorageKey_ExcludedTimes)

    if (!arr)
        return DefaultExcludedTimePairs
    else
        return arr
}

export const SetExcludedTimesAsync = async (pairs: PairTime[]): Promise<void> => {
    await SetArrayAsync(StorageKey_ExcludedTimes, pairs)
}


export const GetDefaultTranslationService = (): TranslationService => {
    return PickRandomElement(TranslationServicePresets) ?? 'Microsoft Translation'
}

export const GetTranslationServiceAsync = async (): Promise<TranslationService> => {
    const s = await AsyncStorage.getItem(StorageKey_TranslationService)

    if (!s || !TranslationServicePresets.includes(s as TranslationService)) {
        const service = GetDefaultTranslationService()

        await SetTranslationServiceAsync(service)

        return service
    }
    else
        return s as TranslationService
}

export const SetTranslationServiceAsync = async (value: TranslationService): Promise<void> => {
    await AsyncStorage.setItem(StorageKey_TranslationService, value)
}