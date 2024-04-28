const fs = require('fs')

const dir = './editor/Assets/vocabs/'

const outputPath = './editor/Assets/files/'

const WordsPerFile = 4840


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

            ShortAudio(word)
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