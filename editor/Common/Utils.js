// editor
// convert
// file, path, dir
// array / string
// log
// other



// ------------------------------

// editor

function IsParamExist(key) {
    return typeof GetParam(key) === 'string'
}

function GetParam(key, asStringOrNumber) {
    let value
    key = key.toLowerCase()

    for (let i = 0; i < process.argv.length; i++) {
        const param = process.argv[i]
        const paramLower = param.toLowerCase()

        if (paramLower.startsWith(key + '=')) {
            value = param.substring(key.length + 1)
            break
        }
        else if (key === paramLower) {
            value = ''
            break
        }
    }

    if (value === undefined) // not found
        return undefined;

    if (asStringOrNumber === undefined || asStringOrNumber === true) // return as string
        return value
    else // return as number
        return Number.parseFloat(value)
}

function GetParamExcludesDefaults(excludeKey) {
    for (let i = 0; i < process.argv.length; i++) {
        const cur = process.argv[i].toLowerCase()

        if (cur.includes('.js') ||
            cur.includes('node') ||
            cur === excludeKey)
            continue

        return cur;
    }
}

// convert

function ArrayBufferToBuffer(arrayBuffer) {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}

function Uint8ArrayToString(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12: case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }

    return out;
}

// file, path, dir

function GetFileExtensionByFilepath(filepath) {
    var dotIdx = filepath.lastIndexOf('.');

    if (dotIdx == -1)
        return '';

    return filepath.substring(dotIdx + 1, filepath.length);
}

// array

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

export function ArrayAddWithCheckDuplicate(
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

// logs

function LogRed(...msg) {
    const code = process.platform === 'win32' ? 91 : 31

    console.log(`\x1b[${code}m ${msg.join(', ')} \x1b[0m`);
}

function LogGreen(...msg) {
    const code = process.platform === 'win32' ? 92 : 32
    console.log(`\x1b[${code}m ${msg.join(', ')} \x1b[0m`);
}

function LogYellow(...msg) {
    const code = process.platform === 'win32' ? 93 : 33
    console.log(`\x1b[${code}m ${msg.join(', ')} \x1b[0m`);
}

// other

async function DelayAsync(msTime) {
    return new Promise(resolve => setTimeout(resolve, msTime));
}

module.exports = {
    GetParam,
    IsParamExist,
    GetParamExcludesDefaults,
    ArrayBufferToBuffer,
    GetFileExtensionByFilepath,
    Uint8ArrayToString,

    LogRed,
    LogGreen,
    LogYellow,
}