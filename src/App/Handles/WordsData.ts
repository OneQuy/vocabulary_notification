import { GetNumberIntAsync, SetNumberAsync } from "../../Common/AsyncStorageUtils"
import { DownloadFile_GetJsonAsync, ReadJsonFileAsync, ReadTextAsync } from "../../Common/FileUtils"
import { GetAlternativeConfig } from "../../Common/RemoteConfig"
import { CreateError, IsValuableArrayOrString } from "../../Common/UtilsTS"
import { StorageKey_UsedWordIndex } from "../Constants/StorageKey"
import { Word } from "../Types"
import { GetPopularityLevelIndexAsync } from "./Settings"

const IsLog = __DEV__

const FileUrlPattern = 'https://firebasestorage.googleapis.com/v0/b/vocanoti.appspot.com/o/words%2Findex-#.json?alt=media&token=@'

const WordDataFirebaseFileTokens = [
    'cebdb704-31b9-4e63-8131-433f4e90d1bf',
    '0cc804e7-a374-4a17-a48f-ae5866c3546d',
    '324aba26-049b-4d12-aeca-220ea0c3e31f',
    'a00c3dab-0fc2-4703-8b4d-6003a9ae2b8f',
    '73718e7b-c010-4a41-b06e-ec642a6767c7',
    'd45b51cc-cd41-4e07-8665-1753fd9bf984',
    '704f8705-fd80-4ca4-981b-1eb64d68e044',
    '247b705b-3b09-4e0b-bb55-488c5d0abf73',
    '89606f42-1abf-4245-8089-43d8b30b13fb',
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
    if (!IsValuableArrayOrString(wordStrings)) {
        if (IsLog) {
            console.log('[GetWordsDataCurrentLevelAsync] empty request => return 0 words')
        }

        return []
    }

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
    if (popularityIdx < 1 || popularityIdx > WordDataFirebaseFileTokens.length)
        return new Error('[DownloadWordDataAsync] out of index WordDataFirebaseFileUrls: ' + popularityIdx)

    if (IsLog) {
        console.log('[GetAllWordsDataAsync] start to download file word data... index', popularityIdx);
    }

    const urlPattern = GetAlternativeConfig('dataFileUrlPattern', FileUrlPattern)
    const token = GetAlternativeConfig(`dataFileTokenIdx${popularityIdx}`, WordDataFirebaseFileTokens[popularityIdx - 1])

    const url = urlPattern
        .replace('#', popularityIdx.toString())
        .replace('@', token)

    console.log(url);

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