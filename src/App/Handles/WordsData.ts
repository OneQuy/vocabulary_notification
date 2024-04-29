import { GetNumberIntAsync, SetNumberAsync } from "../../Common/AsyncStorageUtils"
import { DownloadFile_GetJsonAsync, ReadTextAsync } from "../../Common/FileUtils"
import { CreateError } from "../../Common/UtilsTS"
import { StorageKey_UsedWordIndex } from "../Constants/StorageKey"
import { Word } from "../Types"
import { GetPopularityLevelIndexAsync } from "./Settings"

const IsLog = true

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

export const GetWordsDataAsync = async (wordStrings: string[]): Promise<Word[] | Error> => {
    const allWords = await GetAllWordsDataAsync()

    if (allWords instanceof Error)
        return allWords

    const words = allWords.filter(w => wordStrings.includes(w.word))

    if (words.length !== wordStrings.length)
        return new Error('[GetWordsDataAsync] words.length !== wordStrings.length')

    return words
}

export const GetAllWordsDataAsync = async (): Promise<Word[] | Error> => {
    const popularityIdx = await GetPopularityLevelIndexAsync()

    const cache = caches[`index_${popularityIdx}`]

    if (cache) {
        if (IsLog) {
            console.log('[GetAllWordsDataAsync] loaded from cached', popularityIdx);
        }

        return cache.data
    }

    let words: Word[]

    // file 0 is assets

    if (popularityIdx === 0) {
        words = require('../../../assets/words_0.json') as Word[]

        if (IsLog) {
            console.log('[GetAllWordsDataAsync] loaded from require assets', popularityIdx);
        }
    }

    // others need to load from local or download

    else {
        // load from local

        let readFileLocalRes = await ReadTextAsync(GetLocalRlp(popularityIdx), true)

        if (readFileLocalRes.text) {
            words = JSON.parse(readFileLocalRes.text) as Word[]

            if (IsLog) {
                console.log('[GetAllWordsDataAsync] loaded from local file', popularityIdx);
            }
        }

        // dl 

        else {
            if (popularityIdx < 0 || popularityIdx >= WordDataFirebaseFileUrls.length)
                return new Error('[GetAllWordsDataAsync] out of index: ' + popularityIdx)

            const url = WordDataFirebaseFileUrls[popularityIdx]

            const fileDLRes = await DownloadFile_GetJsonAsync(
                url,
                GetLocalRlp(popularityIdx),
                true,
                true)

            if (fileDLRes.error)
                return CreateError(fileDLRes.error)

            words = fileDLRes.json as Word[]

            if (IsLog) {
                console.log('[GetAllWordsDataAsync] downloaded file success', popularityIdx);
            }
        }
    }

    // cache

    caches[`index_${popularityIdx}`] = {
        data: words,
        levelIndex: popularityIdx,
    }

    return words
}

export const SetUsedWordIndexAsync = async (usedWordIndex: number): Promise<void> => {
    if (IsLog) {
        console.log('[SetUsedWordIndexAsync] usedWordIndex', usedWordIndex);
    }

    const popularityIdx = await GetPopularityLevelIndexAsync()
    await SetNumberAsync(StorageKey_UsedWordIndex(popularityIdx), usedWordIndex)
}

export const GetNextWordsDataForNotiAsync = async (count: number): Promise<GetNextWordsDataForNotiResult | Error> => {
    const allWords = await GetAllWordsDataAsync()

    if (allWords instanceof Error)
        return allWords

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
        console.log('[GetNextWordsDataForNotiAsync] end used idx', usedWordIndex);
    }

    return {
        words: arr,
        usedWordIndex
    }
}