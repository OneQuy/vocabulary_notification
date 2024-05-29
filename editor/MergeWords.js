// node editor/mergewords

const fs = require('fs')

const Full_Or_Simple = false

const dir = './editor/Assets/vocabs/'

const outputPath = './editor/Assets/files/'

const WordsPerFile = 4840

function RemoveEmptyAndFalsyFromObject(obj) {
    /**
     * Creates a new object with empty strings, null, and undefined properties removed.
     * @param {Object} obj The object to filter.
     * @returns {Object} A new object with filtered properties.
     */
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => value !== null && value !== undefined && value !== '')
    );
}

/**
 * @returns number or NaN
 */
const SplitNumberInText = (text) => {
    if (!text)
        return NaN

    let numS = ''

    for (let index = 0; index < text.length; index++) {
        const char = text[index]

        if (char >= '0' && char <= '9') {
            numS += char
        }
        else {
            if (numS === '')
                continue
            else if (char === ',') {
                if (index + 1 < text.length && !Number.isNaN(Number.parseInt(text[index + 1])))
                    continue
                else
                    break
            }
            else if (char === '.') {
                if (index + 1 < text.length && !Number.isNaN(Number.parseInt(text[index + 1])))
                    numS += char
                else
                    break
            }
            else
                break
        }
    }

    return Number.parseFloat(numS)
}

const AudioPath = 'https://api.dictionaryapi.dev/media/pronunciations/en/'

const ShortAudio = (word) => {
    if (!word.phonetics)
        return

    for (let phone of word.phonetics) {
        if (!phone.audio)
            continue

        if (phone.audio.startsWith(AudioPath)) {
            if (phone.audio.endsWith('.mp3'))
                phone.audio = phone.audio.substring(AudioPath.length, phone.audio.length - 4)
            else
                phone.audio = phone.audio.substring(AudioPath.length)
        }
    }
}

const SimplelizeData = (word) => {
    // phonetic

    if (word.phonetics && word.phonetics.length > 0) {
        const phoneticsWithText = word.phonetics.filter(ph => ph.text && ph.text.length > 0)

        if (phoneticsWithText.length >= 1) {
            const firstPhonetic = {
                text: phoneticsWithText[0].text
            }

            word.phonetics = [firstPhonetic]
        }
        else
            word.phonetics = undefined
    }
    else
        word.phonetics = undefined

    // count

    word.count = undefined

    // showDefinitions, showExample, showPartOfSpeech

    if (!word.meanings || word.meanings.length <= 0)
        console.error('aaaaaaaa means empty', word.word)

    for (let meaning of word.meanings) {
        if (!meaning.partOfSpeech || meaning.partOfSpeech.length <= 0) {
            console.error('bbbbbbbbbbb meaning.partOfSpeech empty', word.word)
            continue
        }

        if (!meaning.definitions || meaning.definitions.length <= 0) {
            console.error('cccccc meaning.definitions empty', word.word)
            continue
        }

        let def

        def = meaning.definitions.find(i => i.example && i.example.length > 0)

        if (!def) { // no available examble
            def = meaning.definitions[0]
            def.example = undefined

            def = RemoveEmptyAndFalsyFromObject(def)
        }

        meaning.definitions = [def]
    }

    // remove falsy

    return RemoveEmptyAndFalsyFromObject(word)
}

const MergeAndSplitFilesAsync = async () => {
    let dirInfo = fs.readdirSync(dir)

    dirInfo = dirInfo.sort((a, b) => {
        const an = SplitNumberInText(a)
        const bn = SplitNumberInText(b)

        return an - bn
    })

    let arr = []
    let count = 0
    let preIdx = -1

    for (let file of dirInfo) {
        const text = fs.readFileSync(dir + file, 'utf-8')

        const words = JSON.parse(text)

        for (let word of words) {
            if (word.idx < preIdx) {
                console.error('wrong indexxxxxxxxxxx', word.word)
            }

            preIdx = word.idx

            if (Full_Or_Simple)
                ShortAudio(word)
            else
                word = SimplelizeData(word)

            arr.push(word)

            if (arr.length >= WordsPerFile) {
                const s = JSON.stringify(arr)

                const file = `${outputPath}index-${count++}.json`
                fs.writeFileSync(file, s)

                console.log(file, arr.length)

                arr = []
            }
        }
    }

    console.log('done')
}

MergeAndSplitFilesAsync()