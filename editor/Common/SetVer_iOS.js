const fs = require('fs')

const GetPackageVersion = () => {
    const str = fs.readFileSync('./package.json', 'utf-8')
    const lines = str.split('\n')

    for (i = 0; i < lines.length; i++) {
        const line = lines[i]

        if (line.includes('version')) {
            const idxx = line.indexOf(':')
            const s = line.substring(idxx + 3, idxx + 8)
            const arr = s.split('.')

            return {
                verString: s,
                verNum: parseInt(s.replaceAll('.', ''))
            }
        }
    }

    return undefined
}

const path = './ios/vocabulary_notification.xcodeproj/project.pbxproj';

const Set = () => {
    // console.log(GetPackageVersion())
    const currentVerObj = GetPackageVersion()

    if (!currentVerObj) {
        console.error('aaaaaaa ');
        return
    }

    const str = fs.readFileSync(path, 'utf-8')
    const lines = str.split('\n')
    let countLineOperation = 0;
    let countLineFixed = 0;

    for (i = 0; i < lines.length; i++) {
        countLineOperation++

        const line = lines[i]

        // CURRENT_PROJECT_VERSION = 37;

        if (line.includes('CURRENT_PROJECT_VERSION')) {
            const idx = line.indexOf('=')
            lines[i] = line.substring(0, idx + 1) + ' ' + currentVerObj.verNum + ';'
            countLineFixed++
            continue;
        }

        // MARKETING_VERSION = 0.3.7;

        if (line.includes('MARKETING_VERSION')) {
            const idx = line.indexOf('=')
            lines[i] = line.substring(0, idx + 1) + ' ' + currentVerObj.verString + ';'
            countLineFixed++
            continue;
        }

        if (countLineFixed >= 4)
            break
    }

    fs.writeFileSync(path, lines.join('\n'))

    // console.log('done', currentVerObj.verString, countLineOperation, countLineFixed);
    // console.log('done', currentVerObj.verString);
}

Set()

// module.exports = Increase