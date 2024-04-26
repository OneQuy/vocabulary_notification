// interface RootObject {
//     word: string;
//     phonetic: string;
//     phonetics: Phonetic[];
//     meanings: Meaning[];
// }
// interface Meaning {
//     partOfSpeech: string;
//     definitions: Definition[];
// }
// interface Definition {
//     definition: string;
//     example?: string;
// }

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
const GetPhoneticsArr = async (json) => {
    // currently just extract from first element

    json = json[0]

    // default value

    const phonetics = json.phonetics

    if (!Array.isArray(phonetics)) {
        if (IsValuableArrayOrString(json.phonetic) > 0) {
            return [
                {
                    text: json.phonetic
                }
            ]
        }
        else
            return undefined
    }

    // extract arr

    const arr = []

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
        }
    })

    if (arr.length > 0)
        return arr
    else
        return undefined
}

const FetchWordAsync = async () => {
    const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/love'

    const res = await fetch(url)

    const json = await res.json()

    if (!Array.isArray(json))
        return undefined

    const phonetics = GetPhoneticsArr(json)

    console.log(phonetics);
}

const FetchValuableWordsAsync = () => {
    FetchWordAsync()
}

FetchValuableWordsAsync()

// module.exports = {
//     FetchValuableWordsAsync,
// }