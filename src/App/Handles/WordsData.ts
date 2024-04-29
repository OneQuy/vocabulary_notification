import { PickRandomElement } from "../../Common/UtilsTS"
import { Word } from "../Types"


const arrWords: Word[] = require('./../../../data.json') as Word[] // tmp


export const GetWordsDataAsync = async (words: string[]): Promise<Word[]> => {
    return arrWords.filter(word => words.includes(word.word))
}

export const SetReachedWordIndexAsync = async (index: number): Promise<void> => {
}

export const GetNextWordsFromDataAsync = async (count: number): Promise<Word[]> => {
    // get cur index
    // return get index

    const arr: Word[] = []

    if (count <= 0)
        return arr

    for (let i = 0; i < count; i++)
        arr.push(PickRandomElement(arrWords))

    return arr
}