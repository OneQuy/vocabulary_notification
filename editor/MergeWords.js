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
            arr.push(word)
        }
    }

    const s = JSON.stringify(arr)

    fs.writeFileSync(`${outputPath}merged-${arr.length}words.json`, s)

    console.log('files', dirInfo.length, 'words', arr.length);
}

MergeAsync()