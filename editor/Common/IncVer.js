const fs = require('fs')

const Increase = () => {
    const str = fs.readFileSync('./package.json', 'utf-8')
    const lines = str.split('\n')

    for (i = 0; i < lines.length; i++) {
        const line = lines[i]

        if (line.includes('version')) {
            const idxx = line.indexOf(':')
            const s = line.substring(idxx + 3, idxx + 8)
            const arr = s.split('.')
            let res = ''

            if (parseInt(arr[2]) >= 9) {
                if (parseInt(arr[1]) >= 9) {
                    res = (parseInt(arr[0]) + 1) + '.0.0'
                }
                else {
                    res = arr[0] + '.' + (parseInt(arr[1]) + 1) + '.0'
                }
            }
            else {
                res = arr[0] + '.' + arr[1] + '.' + (parseInt(arr[2]) + 1)
            }

            console.log(res);
            
            lines[i] = line.replace(s, res)
            fs.writeFileSync('./package.json', lines.join('\n'))
            break
        }
    }

}

Increase()

// module.exports = Increase