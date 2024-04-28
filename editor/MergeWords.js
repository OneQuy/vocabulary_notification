const fs = require('fs')

const dir = './editor/Assets/vocabs/'

const outputPath = './editor/Assets/'


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

const MergeAsync = async () => {
    let dirInfo = fs.readdirSync(dir)

    dirInfo = dirInfo.sort((a, b) => {
        const an = SplitNumberInText(a)
        const bn = SplitNumberInText(b)

        return an - bn
    })

    let arr = []

    for (let file of dirInfo) {
        // console.log(file);
        // continue

        const text = fs.readFileSync(dir + file, 'utf-8')

        const words = JSON.parse(text)

        for (let word of words) {
            ShortAudio(word)
            arr.push(word)
        }
    }

    const s = JSON.stringify(arr)

    fs.writeFileSync(`${outputPath}merged-${arr.length}words.json`, s)

    console.log('files', dirInfo.length, 'words', arr.length);
}

MergeAsync()