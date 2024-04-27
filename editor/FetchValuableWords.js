const fs = require('fs')

const IntervalWaitOutOfRequest = 5000

const StartFromIdx = 60486

const outputpath = './editor/Assets/vocabs/'

const srcpath = './editor/Assets/count_1w100k.txt'

const AudioPath = 'https://api.dictionaryapi.dev/media/pronunciations/en/'

async function DelayAsync(msTime) {
    return new Promise(resolve => setTimeout(resolve, msTime));
}

function ArrayAddWithCheckDuplicate(
    arr,
    itemsToAdd,
    propertyForCompareIfTypeIsObject,
    stringifyCompare,
    pushOrUnshift
) {
    const arrToAdd = Array.isArray(itemsToAdd) ? itemsToAdd : [itemsToAdd]
    let added = false
    const property = propertyForCompareIfTypeIsObject

    for (let i = 0; i < arrToAdd.length; i++) {
        const curItemToAdd = arrToAdd[i]

        const foundIdx = arr.findIndex(element => {
            const isObject = typeof curItemToAdd === 'object'

            if (isObject && propertyForCompareIfTypeIsObject) {
                return curItemToAdd[property] === element[property]
            }
            else if (stringifyCompare === true) {
                const thisObj = JSON.stringify(curItemToAdd)
                const arrElement = JSON.stringify(element)

                return thisObj === arrElement
            }
            else
                return element === curItemToAdd
        })

        if (foundIdx >= 0) { // found => not add
            continue
        }

        // add!

        added = true

        if (pushOrUnshift)
            arr.push(curItemToAdd)
        else
            arr.unshift(curItemToAdd)
    }

    return added
}

function IsValuableArrayOrString(value, trimString = true) {
    if (Array.isArray(value)) {
        return value.length > 0
    }
    else if (typeof value === 'string') {
        if (trimString && value)
            value = value.trim()

        return value && value.length > 0
    }
    else
        return false
}

// interface Phonetic {
//     text?: string;
//     audio?: string;
// }
/**
 * 
 * @returns undefined / arr of phonetics
 */
const GetPhoneticsArr = (jsonArr) => {
    // currently just extract from first element

    jsonArr = jsonArr[0]

    // default value

    const phonetics = jsonArr.phonetics

    if (!Array.isArray(phonetics)) {
        if (IsValuableArrayOrString(jsonArr.phonetic) > 0) {
            return [
                {
                    text: jsonArr.phonetic
                }
            ]
        }
        else
            return undefined
    }

    // extract arr

    let arr = []
    let hadElementBothTextAndAudio = false

    phonetics.forEach(element => {
        const isValueable_Text = IsValuableArrayOrString(element.text)
        const isValueable_Audio = IsValuableArrayOrString(element.audio)

        if (isValueable_Audio || isValueable_Text) {
            const obj = {}

            if (isValueable_Audio) {
                if (element.audio.startsWith(AudioPath)) {
                    if (element.audio.endsWith('.mp3'))
                        obj.audio = element.audio.substring(AudioPath.length, element.audio.length - 4)
                    else
                        obj.audio = element.audio.substring(AudioPath.length)
                }
                else
                    obj.audio = element.audio
            }

            if (isValueable_Text)
                obj.text = element.text

            ArrayAddWithCheckDuplicate(arr, obj, undefined, true)

            if (isValueable_Audio && isValueable_Text)
                hadElementBothTextAndAudio = true
        }
    })

    if (hadElementBothTextAndAudio) {
        arr = arr.filter(i => i.text && i.audio)
    }

    if (arr.length > 0)
        return arr
    else
        return undefined
}


// interface Definition {
//     definition?: string;
//     example?: string;
// }
/**
 * 
 * @returns undefined / arr of definitions
 */
const GetDefinitionArr = (definitions) => {
    if (!Array.isArray(definitions))
        return undefined

    const arr = []

    definitions.forEach(element => {
        const isValue_definition = IsValuableArrayOrString(element.definition)

        if (isValue_definition) {
            const obj = {
                definition: element.definition
            }

            if (IsValuableArrayOrString(element.example)) {
                obj.example = element.example
            }

            arr.push(obj)
        }
    });

    if (arr.length > 0)
        return arr
    else
        return undefined
}

// interface Meaning {
//     partOfSpeech?: string;
//     definitions?: Definition[];
// }
/**
 * 
 * @returns undefined / arr of meanings
 */
const GetMeaningArr = (jsonArr) => {
    // merge meanings

    const arr = [] // Meaning[]

    jsonArr.forEach(wordObj => {
        if (!Array.isArray(wordObj.meanings))
            return

        wordObj.meanings.forEach(meaning => {
            if (meaning.partOfSpeech === 'adjective')
                meaning.partOfSpeech = 'j'
            else if (meaning.partOfSpeech === 'adverb')
                meaning.partOfSpeech = 'v'
            else if (meaning.partOfSpeech === 'verb')
                meaning.partOfSpeech = 've'
            else if (meaning.partOfSpeech === 'noun')
                meaning.partOfSpeech = 'n'
            else if (meaning.partOfSpeech === 'pronoun')
                meaning.partOfSpeech = 'p'
            else if (meaning.partOfSpeech === 'preposition')
                meaning.partOfSpeech = 'pr'
            else if (meaning.partOfSpeech === 'conjunction')
                meaning.partOfSpeech = 'c'
            else if (meaning.partOfSpeech === 'numeral')
                meaning.partOfSpeech = 'nu'
            else if (meaning.partOfSpeech === 'interjection')
                meaning.partOfSpeech = 'i'
            else if (meaning.partOfSpeech === 'proper noun')
                meaning.partOfSpeech = 'pn'
            else
                console.error('unknown part of speech: ' + meaning.partOfSpeech, wordObj.word);

            const definitions = GetDefinitionArr(meaning.definitions)

            if (!definitions)
                return

            const idx = arr.findIndex(i => i.partOfSpeech === meaning.partOfSpeech)

            if (idx < 0) {
                const obj = {
                    definitions,
                }

                if (IsValuableArrayOrString(meaning.partOfSpeech))
                    obj.partOfSpeech = meaning.partOfSpeech
                else
                    console.error('tmp, partOfSpeech EMPTY: ', wordObj.word)

                arr.push(obj)
            }
            else {
                const arrElement = arr[idx]
                arrElement.definitions = arrElement.definitions.concat(definitions)
            }
        });
    });

    if (arr.length > 0)
        return arr
    else
        return undefined
}

/**
 * 
 * @returns null if out of request
 * @returns undefined if invalid word
 */
const FetchWordAsync = async (word, count, wordIdx) => {
    const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word

    let jsonArr

    try {
        const res = await fetch(url)

        jsonArr = await res.json()

        if (!Array.isArray(jsonArr)) {
            // console.log('tmp, not in dic, word: ' + word, count);
            return undefined
        }
    }
    catch {
        return null
    }

    const meanings = GetMeaningArr(jsonArr)

    if (meanings === undefined) {
        console.log('tmp, not meanings, word: ' + word, count);
        return undefined
    }

    const obj = {
        word,
        idx: wordIdx,
        count,
        meanings,
    }

    const phonetics = GetPhoneticsArr(jsonArr)

    if (phonetics !== undefined)
        obj.phonetics = phonetics

    return obj
}

const FetchValuableWordsAsync = async () => {
    const text = fs.readFileSync(srcpath, 'utf-8')
    const lines = text.split('\n')

    let arr = []
    let startOutOfReqTick = -1
    let fetchedWordCount = 0

    for (let lineIdx = StartFromIdx; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx]

        const arrSplit = line.split('\t')

        if (arrSplit.length < 2 || arrSplit[0].length < 2)
            continue

        const word = arrSplit[0]
        const count = Number.parseInt(arrSplit[1])

        let res

        while (true) {
            res = await FetchWordAsync(word, count, lineIdx)
            fetchedWordCount++

            // console.log(lineIdx, word, 'success', res && res.word);

            if (res === null) { // out of request
                if (startOutOfReqTick === -1) {
                    startOutOfReqTick = Date.now()
                }

                if (arr.length >= 1) {
                    // const s = JSON.stringify(arr, null, 1)
                    const s = JSON.stringify(arr)

                    const filename = `to-index-${lineIdx - 1}.json`
                    fs.writeFileSync(outputpath + filename, s)

                    console.log('created: ' + filename, arr.length, 'words', ', fetched: ' + fetchedWordCount)
                    arr = []
                }

                await DelayAsync(IntervalWaitOutOfRequest)
            }
            else { // success or invalid word
                if (startOutOfReqTick > -1) {
                    console.log('server reset time: ' + (Date.now() - startOutOfReqTick));
                    startOutOfReqTick = -1
                    fetchedWordCount = 1
                }

                break
            }
        }

        if (res !== undefined)
            arr.push(res)
    }
}

FetchValuableWordsAsync()

// module.exports = {
//     FetchValuableWordsAsync,
// }