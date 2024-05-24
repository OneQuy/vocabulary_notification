import { GetNumberIntAsync, SetNumberAsync } from "../../Common/AsyncStorageUtils"
import { DownloadFile_GetJsonAsync, ReadJsonFileAsync, ReadTextAsync } from "../../Common/FileUtils"
import { CreateError } from "../../Common/UtilsTS"
import { StorageKey_UsedWordIndex } from "../Constants/StorageKey"
import { Word } from "../Types"
import { GetPopularityLevelIndexAsync } from "./Settings"

const IsLog = __DEV__

export const WordDataFirebaseFileUrls = [
    'https://firebasestorage.googleapis.com/v0/b/vocanoti.appspot.com/o/words%2Findex-1.json?alt=media&token=bf8256ea-7e43-4f7b-84fe-8cfb111444c8',
    'https://firebasestorage.googleapis.com/v0/b/vocanoti.appspot.com/o/words%2Findex-2.json?alt=media&token=1a6b3774-ff6d-4ea2-98a9-0f1bb83d1180',
    'https://firebasestorage.googleapis.com/v0/b/vocanoti.appspot.com/o/words%2Findex-3.json?alt=media&token=6498e32e-385e-45e0-919c-65173d99a9cb',
    'https://firebasestorage.googleapis.com/v0/b/vocanoti.appspot.com/o/words%2Findex-4.json?alt=media&token=da32bcfe-cece-47da-beac-b0d543ca4026',
    'https://firebasestorage.googleapis.com/v0/b/vocanoti.appspot.com/o/words%2Findex-5.json?alt=media&token=3b591b50-63c6-4ce2-b67c-f47b557ff019',
    'https://firebasestorage.googleapis.com/v0/b/vocanoti.appspot.com/o/words%2Findex-6.json?alt=media&token=a4e2f105-fa76-41a7-bd37-cff0dae905a7',
    'https://firebasestorage.googleapis.com/v0/b/vocanoti.appspot.com/o/words%2Findex-7.json?alt=media&token=6cbdeb84-80a6-488f-87f5-69bca326bc90',
    'https://firebasestorage.googleapis.com/v0/b/vocanoti.appspot.com/o/words%2Findex-8.json?alt=media&token=14f69885-3721-4dcc-8352-f9856a8971af',
    'https://firebasestorage.googleapis.com/v0/b/vocanoti.appspot.com/o/words%2Findex-9.json?alt=media&token=42859e5f-19cf-4a45-adbb-1dff0e9f6902',
] as const

type CachedWordData = {
    data: Word[],
    levelIndex: number,
}

type GetNextWordsDataForNotiResult = {
    words: Word[],
    usedWordIndex: number,
}

const caches: Record<`index_${number}`, CachedWordData> = {}

const GetLocalRlp = (popularityLevelIndex: number) => {
    return `words/index-${popularityLevelIndex}.json`
}

/**
 * ### note:
 * @returns propably not same length cuz diff level
 */
export const GetWordsDataCurrentLevelAsync = async (wordStrings: string[]): Promise<Word[] | Error> => {
    wordStrings = wordStrings.map(w => w.toUpperCase())

    const allWordsOrUndefined = await GetAllWordsDataCurrentLevelAsync()

    if (allWordsOrUndefined === undefined)
        return new Error('[GetWordsDataCurrentLevelAsync] what? GetAllWordsDataCurrentLevelAsync === undefined')

    const words = allWordsOrUndefined.filter(w => wordStrings.includes(w.word))

    if (IsLog) {
        console.log('[GetWordsDataCurrentLevelAsync] got words in current level', words.length,
            'required', wordStrings.length,
            '=> words not in current level', wordStrings.length - words.length)
    }

    return words
}

/**
 * 
 * @returns undefined is success
 */
export const DownloadWordDataAsync = async (popularityIdx: number): Promise<undefined | Error> => {
    if (popularityIdx < 1 || popularityIdx > WordDataFirebaseFileUrls.length)
        return new Error('[DownloadWordDataAsync] out of index WordDataFirebaseFileUrls: ' + popularityIdx)

    if (IsLog) {
        console.log('[GetAllWordsDataAsync] start to download file word data... index', popularityIdx);
    }

    const url = WordDataFirebaseFileUrls[popularityIdx - 1]

    const fileDLRes = await DownloadFile_GetJsonAsync(
        url,
        GetLocalRlp(popularityIdx),
        true,
        true)

    if (fileDLRes.error)
        return CreateError(fileDLRes.error)

    if (IsLog) {
        console.log('[GetAllWordsDataAsync] downloaded file word data success, index', popularityIdx);
    }

    return undefined
}

/**
 * @param popularityIdx === -1 for loading current level
 */
export const IsCachedWordsDataCurrentLevelAsync = async (popularityIdx = -1): Promise<boolean> => {
    popularityIdx = popularityIdx < 0 ?
        await GetPopularityLevelIndexAsync() :
        popularityIdx

    const cache = caches[`index_${popularityIdx}`]

    if (cache)
        return true
    else
        return false

}

/**
 * @param popularityIdx === -1 for loading current level
 * @returns undefined is need to dl
 */
export const GetAllWordsDataCurrentLevelAsync = async (popularityIdx = -1): Promise<Word[] | undefined> => {
    popularityIdx = popularityIdx < 0 ?
        await GetPopularityLevelIndexAsync() :
        popularityIdx

    const cache = caches[`index_${popularityIdx}`]

    if (cache) {
        if (IsLog) {
            console.log('[GetAllWordsDataAsync] loaded from cached, index', popularityIdx);
        }

        return cache.data
    }

    let words: Word[]

    // file 0 is assets

    if (popularityIdx === 0) {
        if (IsLog) {
            console.log('[GetAllWordsDataAsync] loading from require assets... index', popularityIdx);
        }

        words = require('../../../assets/words_0.json') as Word[]

        if (IsLog) {
            console.log('[GetAllWordsDataAsync] loaded from require assets, index', popularityIdx);
        }
    }

    // others need to load from local or download

    else {
        // load from local

        if (IsLog) {
            console.log('[GetAllWordsDataAsync] check file for loading from local... index', popularityIdx);
        }

        const jsonOrError = await ReadJsonFileAsync<Word[]>(GetLocalRlp(popularityIdx), true)

        if (Array.isArray(jsonOrError)) {
            words = jsonOrError

            if (IsLog) {
                console.log('[GetAllWordsDataAsync] loaded from local file, index', popularityIdx);
            }
        }

        // need to dl 

        else {
            return undefined
        }
    }

    // cache to load later

    caches[`index_${popularityIdx}`] = {
        data: words,
        levelIndex: popularityIdx,
    }

    return words
}

export const SetUsedWordIndexCurrentLevelAsync = async (usedWordIndex: number): Promise<void> => {
    const popularityIdx = await GetPopularityLevelIndexAsync()

    if (IsLog) {
        console.log('[SetUsedWordIndexAsync] usedWordIndex', usedWordIndex, 'popularityIdx', popularityIdx);
    }

    await SetNumberAsync(StorageKey_UsedWordIndex(popularityIdx), usedWordIndex)
}

export const GetNextWordsDataCurrentLevelForNotiAsync = async (count: number): Promise<GetNextWordsDataForNotiResult | Error> => {
    const allWords = await GetAllWordsDataCurrentLevelAsync()

    if (allWords === undefined)
        return new Error('[GetNextWordsDataCurrentLevelForNotiAsync] what? GetAllWordsDataCurrentLevelAsync === undefined')

    const popularityIdx = await GetPopularityLevelIndexAsync()

    let usedWordIndex = await GetNumberIntAsync(StorageKey_UsedWordIndex(popularityIdx), -1)

    if (IsLog) {
        console.log('[GetNextWordsDataForNotiAsync] start get from idx', usedWordIndex + 1);
    }

    const arr: Word[] = []

    for (let c = 0; c < count; c++) {
        usedWordIndex++

        if (usedWordIndex >= allWords.length)
            usedWordIndex = 0

        arr.push(allWords[usedWordIndex])
    }

    if (IsLog) {
        console.log('[GetNextWordsDataForNotiAsync] (est.) end used idx', usedWordIndex);
    }

    return {
        words: arr,
        usedWordIndex
    }
}