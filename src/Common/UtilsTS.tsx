/*
CATEGORIES:

const
color
file / dir
convert
check type
string utils
array utils
time
number
view, component utils
object
other utils
*/

import { Alert, Platform, AlertButton, PermissionsAndroid, Linking, Image, Dimensions } from "react-native";
import { Buffer as TheBuffer } from 'buffer'

// const -------------------------

export const TimeOutError = '[time_out]'
export const TimeOutStandardInMs = 5000

export const TempDirName = 'temp_dir';

const DayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TimeUnitNames_Short = ['d', 'h', 'm', 's'] as const
const TimeUnitNames_Full = ['Day', 'Hour', 'Minute', 'Second'] as const

// color ------------------------

export const colorNameToHexDefines = {
    "aliceblue": "#f0f8ff",
    "antiquewhite": "#faebd7",
    "aqua": "#00ffff",
    "aquamarine": "#7fffd4",
    "azure": "#f0ffff",
    "beige": "#f5f5dc",
    "bisque": "#ffe4c4",
    "black": "#000000",
    "blanchedalmond": "#ffebcd",
    "blue": "#0000ff",
    "blueviolet": "#8a2be2",
    "brown": "#a52a2a",
    "burlywood": "#deb887",
    "cadetblue": "#5f9ea0",
    "chartreuse": "#7fff00",
    "chocolate": "#d2691e",
    "coral": "#ff7f50",
    "cornflowerblue": "#6495ed",
    "cornsilk": "#fff8dc",
    "crimson": "#dc143c",
    "cyan": "#00ffff",
    "darkblue": "#00008b",
    "darkcyan": "#008b8b",
    "darkgoldenrod": "#b8860b",
    "darkgray": "#a9a9a9",
    "darkgreen": "#006400",
    "darkkhaki": "#bdb76b",
    "darkmagenta": "#8b008b",
    "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00",
    "darkorchid": "#9932cc",
    "darkred": "#8b0000",
    "darksalmon": "#e9967a",
    "darkseagreen": "#8fbc8f",
    "darkslateblue": "#483d8b",
    "darkslategray": "#2f4f4f",
    "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3",
    "deeppink": "#ff1493",
    "deepskyblue": "#00bfff",
    "dimgray": "#696969",
    "dodgerblue": "#1e90ff",
    "firebrick": "#b22222",
    "floralwhite": "#fffaf0",
    "forestgreen": "#228b22",
    "fuchsia": "#ff00ff",
    "gainsboro": "#dcdcdc",
    "ghostwhite": "#f8f8ff",
    "gold": "#ffd700",
    "goldenrod": "#daa520",
    "gray": "#808080",
    "grey": "#808080",
    "green": "#008000",
    "greenyellow": "#adff2f",
    "honeydew": "#f0fff0",
    "hotpink": "#ff69b4",
    "indianred ": "#cd5c5c",
    "indigo": "#4b0082",
    "ivory": "#fffff0",
    "khaki": "#f0e68c",
    "lavender": "#e6e6fa",
    "lavenderblush": "#fff0f5",
    "lawngreen": "#7cfc00",
    "lemonchiffon": "#fffacd",
    "lightblue": "#add8e6",
    "lightcoral": "#f08080",
    "lightcyan": "#e0ffff",
    "lightgoldenrodyellow": "#fafad2",
    "lightgrey": "#d3d3d3",
    "lightgreen": "#90ee90",
    "lightpink": "#ffb6c1",
    "lightsalmon": "#ffa07a",
    "lightseagreen": "#20b2aa",
    "lightskyblue": "#87cefa",
    "lightslategray": "#778899",
    "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0",
    "lime": "#00ff00",
    "limegreen": "#32cd32",
    "linen": "#faf0e6",
    "magenta": "#ff00ff",
    "maroon": "#800000",
    "mediumaquamarine": "#66cdaa",
    "mediumblue": "#0000cd",
    "mediumorchid": "#ba55d3",
    "mediumpurple": "#9370d8",
    "mediumseagreen": "#3cb371",
    "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a",
    "mediumturquoise": "#48d1cc",
    "mediumvioletred": "#c71585",
    "midnightblue": "#191970",
    "mintcream": "#f5fffa",
    "mistyrose": "#ffe4e1",
    "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead",
    "navy": "#000080",
    "oldlace": "#fdf5e6",
    "olive": "#808000",
    "olivedrab": "#6b8e23",
    "orange": "#ffa500",
    "orangered": "#ff4500",
    "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa",
    "palegreen": "#98fb98",
    "paleturquoise": "#afeeee",
    "palevioletred": "#d87093",
    "papayawhip": "#ffefd5",
    "peachpuff": "#ffdab9",
    "peru": "#cd853f",
    "pink": "#ffc0cb",
    "plum": "#dda0dd",
    "powderblue": "#b0e0e6",
    "purple": "#800080",
    "rebeccapurple": "#663399",
    "red": "#ff0000",
    "rosybrown": "#bc8f8f",
    "royalblue": "#4169e1",
    "saddlebrown": "#8b4513",
    "salmon": "#fa8072",
    "sandybrown": "#f4a460",
    "seagreen": "#2e8b57",
    "seashell": "#fff5ee",
    "sienna": "#a0522d",
    "silver": "#c0c0c0",
    "skyblue": "#87ceeb",
    "slateblue": "#6a5acd",
    "slategray": "#708090",
    "snow": "#fffafa",
    "springgreen": "#00ff7f",
    "steelblue": "#4682b4",
    "tan": "#d2b48c",
    "teal": "#008080",
    "thistle": "#d8bfd8",
    "tomato": "#ff6347",
    "turquoise": "#40e0d0",
    "violet": "#ee82ee",
    "wheat": "#f5deb3",
    "white": "#ffffff",
    "whitesmoke": "#f5f5f5",
    "yellow": "#ffff00",
    "yellowgreen": "#9acd32"
}

export type ColorName = keyof typeof colorNameToHexDefines;

export function RandomColor(): string {
    const arr = Object.values(colorNameToHexDefines)
    const idx = Math.floor(Math.random() * arr.length)

    return arr[idx]
}

export function ColorNameToHex(name: ColorName): string {
    return colorNameToHexDefines[name];
}

export function ColorNameToRgb(name: ColorName, opacity?: number): string {
    const hex = ColorNameToHex(name);
    return HexToRgb(hex, opacity);
}

export function HexToRgb(hex: string, opacity?: number): string {
    // @ts-ignore
    const arr = ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
    const res = 'rgb(' + arr[0] + "," + arr[1] + "," + arr[2] + ')';

    if (opacity !== undefined)
        return RGBToRGBAText(res, opacity);
    else
        return res;
}

/**
 * @usage RGBToRGBAText('rgb(0, 0, 0)', 0.5)
 */
export function RGBToRGBAText(colorText: string, opacity: number): string {
    return colorText.replace(')', ', ' + opacity + ')').replace('rgb', 'rgba');
}

// file / dir ---------------------------

export async function LoadJsonFromURLAsync(jsonURL: string) {
    try {
        var respone = await fetch(jsonURL);
        var jsonObject = await respone.json();

        return {
            json: jsonObject,
            error: null,
        };
    }
    catch (err) {
        return {
            json: null,
            error: err,
        };
    }
}

export function GetFileExtensionByFilepath(filepath: string): string {
    var dotIdx = filepath.lastIndexOf('.');

    if (dotIdx == -1)
        return '';

    return filepath.substring(dotIdx + 1, filepath.length);
}

export function GetBlobFromFLPAsync(flp: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
        if (!flp) {
            reject(new Error('GetBlobFromFLPAsync: flp is null/empty'));
            return;
        }

        if (Platform.OS === 'android' && !flp.startsWith('file://')) {
            flp = 'file://' + flp;
        }

        const xhr = new XMLHttpRequest();

        // If successful -> return with blob
        xhr.onload = function () {
            resolve(xhr.response);
        };

        // reject on error
        xhr.onerror = function () {
            reject(new Error('GetBlobFromFLPAsync failed, flp: ' + flp));
        };

        // Set the response type to 'blob' - this means the server's response 
        // will be accessed as a binary object
        xhr.responseType = 'blob';

        // Initialize the request. The third argument set to 'true' denotes 
        // that the request is asynchronous
        xhr.open('GET', flp, true);

        // Send the request. The 'null' argument means that no body content is given for the request
        xhr.send(null);
    });
}

// convert ---------------------------

export function ArrayBufferToBase64String(buffer: ArrayBuffer) {
    var binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
}

/**
 * binary string to base64 string
 */
export const btoa = (input: string) => {
    let output = '';

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    for (let block = 0, charCode, i = 0, map = chars;
        input.charAt(i | 0) || (map = '=', i % 1);
        output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

        charCode = input.charCodeAt(i += 3 / 4);

        if (charCode > 0xFF) {
            throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
        }

        block = block << 8 | charCode;
    }

    return output;
}

// check type -----------------------------

export const IsNumChar = (c: string) => {
    if (typeof c !== 'string' || c.length !== 1)
        return false

    if (c >= '0' && c <= '9')
        return true
    else
        return false
}

export const IsNumOrDotChar = (c: string) => {
    if (typeof c !== 'string' || c.length !== 1)
        return false

    if (c === '.')
        return true

    if (c >= '0' && c <= '9')
        return true
    else
        return false
}

export const IsChar = (c: string) => {
    if (typeof c !== 'string' || c.length !== 1)
        return false

    const cLower = c.toLowerCase()

    if (cLower >= 'a' && cLower <= 'z')
        return true
    else
        return false
}

export const IsNumType = (o: any) => {
    return typeof o === 'number' && !Number.isNaN(o)
}

// array utils ---------------------------

export const ArrayGroupElements = (array: any[], property: string) => array.reduce((grouped, element) => ({
    ...grouped,
    [element[property]]: [...(grouped[element[property]] || []), element]
}), {})

export function SafeArrayLength<T>(arr: T[] | any): number {
    if (!Array.isArray(arr))
        return 0

    return arr.length
}

export function SafeGetArrayElement_ForceValue<T>(arr: T[] | any, defaultValue: T): T { // sub 
    return SafeGetArrayElement(arr, defaultValue) as T
}

export function SafeGetArrayElement<T>( // main 
    arr: T[] | any,
    defaultValue: T | undefined = undefined,
    index = 0,
    loop = false,
): undefined | T {
    if (!Array.isArray(arr))
        return defaultValue

    if (arr.length === 0)
        return defaultValue

    if (!loop) {
        if (index < 0 || arr.length <= index)
            return defaultValue
        else
            return arr[index]
    }
    else { // loop
        if (index < 0 && index % arr.length !== 0) {
            return arr[arr.length - Math.abs(index) % arr.length]
        }
        else
            return arr[index % arr.length]
    }
}

export function IsAllValuableString(trimString: boolean, ...values: (string | null | undefined | number | object)[]): boolean { // sub 
    return values.every((val => {
        if (typeof val !== 'string')
            return false

        const s = trimString ? val.trim() : val

        return s.length > 0
    }))
}

export function IsValuableArrayOrString(value: any, trimString: boolean = true) { // main 
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

export function PickRandomElement<T>(arr: T[], excludeElement?: T) {
    while (true) {
        let idx = Math.floor(Math.random() * arr.length);

        if (arr.length <= 1 || excludeElement === undefined || excludeElement === null || !Object.is(arr[idx], excludeElement))
            return arr[idx];
    }
}

/**
 * 
 * @param arr 
 * @param item 
 * @returns true if have the item in arr after handling
 */
export function AddOrRemoveItemInArray<T>(arr: T[], item: T): boolean {
    if (arr.includes(item)) {
        ArrayRemove(arr, item)
        return false
    }
    else {
        arr.push(item)
        return true
    }
}

export function ArrayAddWithCheckDuplicate<T>(
    arr: NonNullable<T>[],
    itemsToAdd: NonNullable<T> | NonNullable<T>[],
    propertyForCompareIfTypeIsObject?: string,
    stringifyCompare?: boolean,
    pushOrUnshift = true
): boolean {
    const arrToAdd = Array.isArray(itemsToAdd) ? itemsToAdd : [itemsToAdd]
    let added = false
    const property = propertyForCompareIfTypeIsObject as keyof T

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

export function ShuffleArray<T>(arr: T[]): void {
    if (!Array.isArray(arr))
        return

    arr.sort((_, __) => Math.random() > 0.5 ? 1 : -1)
}

/**
 * 
 * @param arr 
 * @param value 
 * @returns true if did remove item
 */
export function ArrayRemove<T>(arr: T[], value: T): boolean {
    const idx = arr.indexOf(value)

    if (idx < 0)
        return false

    arr.splice(idx, 1)
    return true
}

// string utils ---------------------------

export function PrependZero(num: number): string {
    if (num < 10 && num >= 0)
        return '0' + num;
    else
        return num.toString();
}

export function AddS(word: string, count: number): string {
    if (count > 1)
        return word + 's'
    else
        return word
}

export function RemoveHTMLTags(text: string): string {
    const regex = /<[^>]*>/mgi
    return text.replace(regex, "")
}

/**
 ## Usage:
 ```tsx
console.log(GetTextBetween('aaaa#1234@cccc', '#', '@')) // return 1234
console.log(GetTextBetween('aaaa#@cccc', '#', '@')) // return ''
console.log(GetTextBetween('aaaa##cccc', '#', '@')) // return ''
console.log(GetTextBetween('aaaa#hihi#cccc', '#', '@')) // return 'hihi'
console.log(GetTextBetween('aaaa#hihi#cccc', '*', '%')) // return undefined
console.log(GetTextBetween('aaaa#hihi#cccc', '#', '%')) // return undefined
console.log(GetTextBetween('aaaa#hihi#cccc', '%', '#')) // return undefined
 ```
 */
export function GetTextBetween(text: string, afterThisString: string, beforeThisString?: string): string | undefined {
    const startIdx = text.indexOf(afterThisString)

    if (startIdx < 0)
        return undefined

    const s = text.substring(startIdx + afterThisString.length)

    if (!IsValuableArrayOrString(s))
        return undefined

    const endIdx = s.indexOf(beforeThisString ?? afterThisString)

    if (endIdx < 0)
        return undefined

    return s.substring(0, endIdx)
}

/**
 ## Usage:
 ```tsx
if (RegexUrl(url)) {
    // validable url
}
 ```
 */
export function RegexUrl(url: string) {
    var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);

    return url.match(regex)
}

export function HTMLCharConvert(text: string) {
    var swapCodes = new Array(8211, 8212, 8216, 8217, 8220, 8221, 8226, 8230, 8482, 61558, 8226, 61607, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 338, 339, 352, 353, 376, 402);
    var swapStrings = new Array("--", "--", "'", "'", '"', '"', "*", "...", "&trade;", "&bull;", "&bull;", "&bull;", "&iexcl;", "&cent;", "&pound;", "&curren;", "&yen;", "&brvbar;", "&sect;", "&uml;", "&copy;", "&ordf;", "&laquo;", "&not;", "&shy;", "&reg;", "&macr;", "&deg;", "&plusmn;", "&sup2;", "&sup3;", "&acute;", "&micro;", "&para;", "&middot;", "&cedil;", "&sup1;", "&ordm;", "&raquo;", "&frac14;", "&frac12;", "&frac34;", "&iquest;", "&Agrave;", "&Aacute;", "&Acirc;", "&Atilde;", "&Auml;", "&Aring;", "&AElig;", "&Ccedil;", "&Egrave;", "&Eacute;", "&Ecirc;", "&Euml;", "&Igrave;", "&Iacute;", "&Icirc;", "&Iuml;", "&ETH;", "&Ntilde;", "&Ograve;", "&Oacute;", "&Ocirc;", "&Otilde;", "&Ouml;", "&times;", "&Oslash;", "&Ugrave;", "&Uacute;", "&Ucirc;", "&Uuml;", "&Yacute;", "&THORN;", "&szlig;", "&agrave;", "&aacute;", "&acirc;", "&atilde;", "&auml;", "&aring;", "&aelig;", "&ccedil;", "&egrave;", "&eacute;", "&ecirc;", "&euml;", "&igrave;", "&iacute;", "&icirc;", "&iuml;", "&eth;", "&ntilde;", "&ograve;", "&oacute;", "&ocirc;", "&otilde;", "&ouml;", "&divide;", "&oslash;", "&ugrave;", "&uacute;", "&ucirc;", "&uuml;", "&yacute;", "&thorn;", "&yuml;", "&#338;", "&#339;", "&#352;", "&#353;", "&#376;", "&#402;");

    for (let i = 0; i < swapCodes.length; i++) {
        const rep = '&#' + swapCodes[i] + ';'
        const idx = text.indexOf(rep)

        if (idx < 0)
            continue

        text = text.replaceAll(rep, swapStrings[i])
    }

    text = text.replaceAll('&#039;', '\'')

    return text
}

/**
 * base64 string to string
 */
export const atob = (text: string) => {
    return TheBuffer.from(text, 'base64').toString()
}

/**
 * @param version 0.1.1
 * @returns 11 or NaN
 */
export function VersionToNumber(version: string): number {
    try {
        const nums = version.split('.')
        return parseInt(nums[0]) * 100 + parseInt(nums[1]) * 10 + parseInt(nums[2])
    }
    catch {
        return NaN
    }
}

export function GetFirstLetters(inputString: string) {
    // Step 1: Split the string into an array of words
    const wordsArray = inputString.split(' ');

    // Step 2: Iterate through the array and extract the first letter of each word
    const firstLettersArray = wordsArray.map(word => word.charAt(0));

    // Step 3: Concatenate the extracted letters to form the result
    const result = firstLettersArray.join('');

    return result;
}

/**
 * @param wholeTxt 
 * @aa
 * @bb
 * @
 * @cc
 * @dd
 * 
 * @returns 
 * [[aa, bb], [cc, dd]]
 */
export function SplitSectionsFromText(wholeTxt: string): string[][] {
    const lines = wholeTxt.split('\n')

    const arrRes: string[][] = []
    let curElement: string[] | undefined = undefined

    for (let iline = 0; iline < lines.length; iline++) {
        const lineTrim = lines[iline].trim()

        if (!lineTrim) {
            curElement = undefined
            continue
        }

        if (!curElement) {
            curElement = []
            arrRes.push(curElement)
        }

        curElement.push(lineTrim)
    }

    return arrRes
}

export function FilterOnlyLetterAndNumberFromString(str: string) {
    let s = ''

    for (let i = 0; i < str.length; i++) {
        if (IsChar(str[i]) || IsNumChar(str[i]))
            s += str[i]
    }

    return s
}

export function StringReplaceCharAt(str: string, index: number, replacement: string) {
    if (index > str.length - 1)
        return str

    return str.substring(0, index) + replacement + str.substring(index + 1);
}

/**
 * @returns number or NaN
 */
export const SplitNumberInText = (text: string) => {
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

export const ExtractAllNumbersInText = (textOrAnthing: any): number[] => {
    if (typeof textOrAnthing !== 'string')
        return []

    const regex = /[+-]?\d+(\.\d+)?/g;
    let floats = textOrAnthing.match(regex)?.map(function (v) { return parseFloat(v); });

    if (!floats)
        return []

    floats = floats.filter(i => IsNumType(i))
    return floats
}

// time ---------------------------

/**
 * 
 * @returns days between 2 dates
 */
export const DistanceFrom2Dates = (d1: Date | number, d2: Date | number): number => {
    const tick1 = typeof d1 === 'number' ? d1 : d1.getTime()
    const tick2 = typeof d2 === 'number' ? d2 : d2.getTime()

    const distanceMs = Math.abs(tick1 - tick2)

    return distanceMs / 24 / 3600 / 1000
}

export const DateDiff_InMinute = (d1: Date | number, d2: Date | number): number => {
    const tick1 = typeof d1 === 'number' ? d1 : d1.getTime()
    const tick2 = typeof d2 === 'number' ? d2 : d2.getTime()

    const distanceMs = Math.abs(tick1 - tick2)

    return distanceMs / 1000 / 60
}

export const DateDiff_InMinute_WithNow = (d: Date | number): number => {
    return DateDiff_InMinute(Date.now(), d)
}

export const DateDiff_InHour_WithNow = (d: Date | number): number => {
    return DateDiff_InHour(Date.now(), d)
}

export const DateDiff_InHour = (d1: Date | number, d2: Date | number): number => {
    const tick1 = typeof d1 === 'number' ? d1 : d1.getTime()
    const tick2 = typeof d2 === 'number' ? d2 : d2.getTime()

    const distanceMs = Math.abs(tick1 - tick2)

    return distanceMs / 1000 / 60 / 60
}

export const DateDiff = (d1: Date | number, d2: Date | number): number => {
    const tick1 = typeof d1 === 'number' ? d1 : d1.getTime()
    const tick2 = typeof d2 === 'number' ? d2 : d2.getTime()

    const distanceMs = Math.abs(tick1 - tick2)

    return distanceMs / 1000 / 60 / 60 / 24
}

export const DateDiff_WithNow = (d: Date | number): number => {
    return DateDiff(Date.now(), d)
}

export const IsTodayAndSameHour = (date: Date): boolean => {
    if (!IsToday(date))
        return false

    const now = new Date()

    return date.getHours() === now.getHours()
}

export const IsToday = (date: Date): boolean => {
    return IsSameDateMonthYear(date, new Date())
}

export const IsYesterday = (date: Date, today: Date = new Date()): boolean => {
    const cloneDate = new Date(date)
    cloneDate.setDate(cloneDate.getDate() + 1)

    return IsSameDateMonthYear(cloneDate, today)
}

export const IsSameDateMonthYear = (a: Date, b: Date): boolean => {
    if (a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()) {
        return true
    }
    else
        return false
}

export const SafeDateString = (date: Date, join: string = '-'): string => {
    const arr = [date.getDate(), MonthName(date.getMonth(), false), date.getFullYear()]
    return arr.join(join)
}

export const MonthName = (monthIndex: number, fullNameOr3Char: boolean): string => {
    if (monthIndex < 0 || monthIndex > 11)
        throw new Error('monthIndex out of months')

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    return monthNames[monthIndex].substring(0, fullNameOr3Char ? 100 : 3)
}

export const DayName = (date?: Date, is3Char?: boolean): string => {
    if (date === undefined)
        date = new Date()

    const name = DayNames[date.getDay()]

    if (is3Char === true)
        return name.substring(0, 3)
    else
        return name
}

export const GetDayHourMinSecFromMs_ToString = (
    ms: number,
    separator = '_',
    removeZeroElement = true,
    unitNameIsShortOrFull = true,
    unitChar = '',
): string => {
    let s = ''

    const arr = GetDayHourMinSecFromMs(ms)
    const units = unitNameIsShortOrFull ? TimeUnitNames_Short : TimeUnitNames_Full

    for (let i = 0; i < 4; i++) {
        if (arr[i] > 0 || !removeZeroElement) {
            if (s.length > 0)
                s += separator

            s += `${arr[i]}${unitChar}${units[i]}`
        }
    }

    return s
}

export const GetDayHourMinSecFromMs = (ms: number): [number, number, number, number] => {
    let sec = ms / 1000

    const day = Math.floor(sec / 3600 / 24)

    sec = sec - day * 3600 * 24

    const hour = Math.floor(sec / 3600)

    sec = sec - hour * 3600

    const min = Math.floor(sec / 60)

    sec = Math.floor(sec - min * 60)

    return [day, hour, min, sec]
}

// number ---------------------------

export function RandomBool() {
    return Math.random() > 0.5
}

export function RandomInt(min: number, max: number) {
    if (max < min) {
        const tmp = min;
        min = max;
        max = tmp;
    }

    var rand = Math.round(Math.random() * (max - min));
    return min + rand;
}

export function RandomIntExcept(min: number, max: number, except: number) {
    for (; ;) {
        let r = RandomInt(min, max);

        if (r !== except)
            return r;
    }
}

export function NumberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const Clamp01 = (value: number) => {
    return Clamp(value, 0, 1)
}

export const Clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value))
}

// view, component utils ---------------------

export function GetWindowSize_Max() {
    const window = Dimensions.get('window')
    return Math.max(window.width, window.height)
}

export async function GetImageSizeAsync(uri: any): Promise<{ width: number, height: number } | Error> {
    if (typeof uri !== 'string')
        return new Error('[GetImageSizeAsync] uri is not a string')

    return new Promise(resolve => {
        Image.getSize(uri,
            (w, h) => {
                resolve({
                    width: w,
                    height: h,
                })
            },
            (error: any) => {
                resolve(CreateError(error))
            })
    })
}

/**
## Usage:
1.
```tsx
const getItemLayout = useCallback((
    data: ArrayLike<ItemType[]> | null | undefined,
    index: number,
) => {
    return FlatlistGetItemLayout(data, index, ITEM_SIZE)
}, [])

2.
<FlatList
    ...
    getItemLayout={getItemLayout}
/>
```
 */
export function FlatlistGetItemLayout<T>(
    data: ArrayLike<T> | null | undefined,
    index: number,
    itemOrientationSize: number,
    gap = 0,
    headPadding = 0,
) {
    return {
        length: itemOrientationSize,
        offset: headPadding + itemOrientationSize * index + (index * gap),
        index,
    }
}

export const ViewSizeOfImageInContainMode = (
    /**
     * imageRatio = image or view H / image or view W
     */
    imageRatio: number,

    containerViewW: number,
    containerViewH: number,
) => {
    if (imageRatio <= 0) {
        console.error('[ViewSizeOfImageInContainMode] imageRatio can not be <= 0')

        return {
            width: containerViewW,
            height: containerViewH,
        }
    }

    let width, height: number

    const isPortrait = imageRatio > 1

    if (isPortrait) {
        height = containerViewH
        width = height / imageRatio

        if (width > containerViewW) {
            width = containerViewW
            height = width * imageRatio
        }
    }
    else {
        width = containerViewW
        height = width * imageRatio

        if (height > containerViewH) {
            height = containerViewH
            width = height / imageRatio
        }
    }

    return { width, height }
}

// object ---------------------------

export function CloneObject<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj)) as T
}

export function RemoveEmptyAndFalsyFromObject(obj: object) {
    /**
     * Creates a new object with empty strings, null, and undefined properties removed.
     * @param {Object} obj The object to filter.
     * @returns {Object} A new object with filtered properties.
     */
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => value !== null && value !== undefined && value !== '')
    );
}

// other utils ---------------------------

export const IsPointInRect = ( // main
    x: number,
    y: number,
    rectX: number,
    rectY: number,
    rectW: number,
    rectH: number) => {
    if (x >= rectX && x <= rectX + rectW &&
        y >= rectY && y <= rectY + rectH)
        return true
    else
        return false
}

export const ToCanPrintError = (erroObj: any) => {
    const err: string = erroObj?.code
    const msg: string = erroObj?.message

    if (!err && !msg)
        return ToCanPrint(erroObj)
    else if (err && msg)
        return err + ' - ' + msg
    else if (err)
        return err
    else
        return msg
}

export const ToCanPrint = (something: any) => {
    if (typeof something === 'object') {
        const res = JSON.stringify(something);

        if (res === '{}') {
            return '' + something;
        }
        else
            return res;
    }

    return something;
}

export const OpenYoutubeAsync = async (videoID: string, openBrowserIfFail: boolean = true): Promise<boolean> => {
    const url = (Platform.OS === 'android' ? 'vnd.youtube:///' : 'youtube://') + videoID

    const can = await Linking.canOpenURL(url)

    if (!can) {
        if (openBrowserIfFail === true)
            Linking.openURL('https://youtu.be/' + videoID)

        return false
    }

    Linking.openURL(url)
    return true
}

/**
 * @usage const isPressRight = await AlertAsync('title', 'message', 'cancel', 'OK');
 */
export const AlertAsync = async (
    title: string,
    msg?: string,
    rightText?: string,
    leftText?: string,
) => new Promise((resolve) => {
    const rightBtn: AlertButton = {
        text: rightText ?? 'OK',
        onPress: () => resolve(true)
    }

    Alert.alert(
        title,
        msg,
        leftText ?
            [ // case 2 btns
                {
                    text: leftText,
                    onPress: () => resolve(false)
                },
                rightBtn
            ] :
            [ // case 1 btn
                rightBtn
            ],
        {
            cancelable: false,
        }
    );
})

/**
 * 
 * @returns if granted: true, cancel: false, else return error
 */
export const RequestCameraPermissionAsync = async () => {
    try {
        if (Platform.OS !== 'android')
            return true

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: "App Camera Permission",
                message: "App needs access to your camera. Please accept it to take photo.",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "Accept"
            }
        )

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true
        } else {
            return false
        }
    } catch (err) {
        return err
    }
}

/**
 * @returns string if success
 * @returns undefined if response not ok
 * @returns any if other error
 */
export const GetIPAsync = async (): Promise<string | undefined | any> => {
    try {
        const res = await fetch('https://api.ipify.org')

        if (!res.ok)
            return undefined

        const text = await res.text()
        return text
    }
    catch (e) {
        return e
    }
}

/**
 * @usage:
    const res = await ExecuteWithTimeoutAsync(
        async () => await FirebaseDatabase_GetValueAsync(...),
        3000)
 
    if (res.isTimeOut || res.result === undefined) {
        // handle time out or other error here
        return false
    }
    else {
        // handle susccess here
        // result = res.result
    }
 */
export async function ExecuteWithTimeoutAsync<T>(asyncFunction: () => Promise<T>, timeoutMs: number) {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(TimeOutError));
        }, timeoutMs);
    });

    try {
        const result = await Promise.race([asyncFunction(), timeoutPromise]);

        return {
            result: result as T,
            isTimeOut: false,
        }
    } catch (error) {
        return {
            result: undefined,
            isTimeOut: error instanceof Error && error.message === TimeOutError
        }
    }
}

/**
 * 
 * @returns if anything === undefined => defaultValue
 * @returns if anything !== undefined => anythhing
 */
export function SafeValue<T>(anything: any, defaultValue: T, forceNaNToDefault = true): T {
    if (typeof anything === typeof defaultValue) {
        if (Number.isNaN(anything) && forceNaNToDefault)
            return defaultValue
        else
            return anything
    }
    else
        return defaultValue
}

export const CreateError = (anything: any): Error => {
    if (anything instanceof Error)
        return anything
    else
        return new Error(ToCanPrint(anything))
}

export async function DelayAsync(msTime: number) {
    return new Promise(resolve => setTimeout(resolve, msTime));
}

export function LogStringify<T>(anything: any) {
    console.log(JSON.stringify(anything, null, 1));
}