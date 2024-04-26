const fs = require('fs')

const outputpath = './editor/Assets/outputs.json'
const srcpath = './editor/Assets/count_1w100k.txt'

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

            if (isValueable_Audio)
                obj.audio = element.audio

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

const FetchWordAsync = async (word, count, wordIdx) => {
    const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word

    const res = await fetch(url)

    const jsonArr = await res.json()

    if (!Array.isArray(jsonArr)) {
        // console.log('tmp, not in dic, word: ' + word, count);
        return undefined
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

    console.log('start, lines of file: ' + lines.length);
    const eachCount = 10

    let arr = []

    for (let iline = 0; iline < 50; iline += eachCount) {

        const eachLines = lines.slice(iline, iline + eachCount)

        let wordAndCountArr = eachLines.map((line, index) => {
            const arr = line.split('\t')

            if (arr.length < 2)
                return ['', -1]

            return [arr[0], Number.parseInt(arr[1]), iline + index]
        })

        wordAndCountArr = wordAndCountArr.filter(e => e[0].length >= 2)

        console.log('fetching, start idx: ', iline, 'word fetch count', wordAndCountArr.length)

        const resArr = await Promise.all(wordAndCountArr.map(e => {
            return FetchWordAsync(e[0], e[1], e[2])
        }))

        const valids = resArr.filter(i => i !== undefined)

        arr = arr.concat(valids)
    }

    const s = JSON.stringify(arr, null, 1)

    fs.writeFileSync(outputpath, s)

    console.log('doneee: ' + arr.length);
}

FetchValuableWordsAsync()

// module.exports = {
//     FetchValuableWordsAsync,
// }