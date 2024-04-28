const fs = require('fs')

const dir = './editor/Assets/vocabs/'

const outputPath = './editor/Assets/merged.txt'

const MergeAsync = async () => {
    const dirInfo = fs.readdirSync(dir)

    let arr = []

    // let c = 0;

    for (let file of dirInfo) {
        const text = fs.readFileSync(dir + file, 'utf-8')

        const words = JSON.parse(text)

        for (let word of words) {
            arr.push(word)
        }

        // if (c > 2)
        //     break
        // else
        //     c++
    }

    const s = JSON.stringify(arr)

    fs.writeFileSync(outputPath, s)

    console.log('files', dirInfo.length, 'words', arr.length);
}

MergeAsync()