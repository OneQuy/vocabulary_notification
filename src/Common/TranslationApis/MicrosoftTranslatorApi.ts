// DOC: https://learn.microsoft.com/en-us/azure/ai-services/translator/quickstart-text-rest-api?tabs=nodejs
// YOUR KEY: https://portal.azure.com/#@onequygmail.onmicrosoft.com/resource/subscriptions/3952d4d4-641f-4014-a32e-a1737e788663/resourceGroups/TranslateResourceGroup/providers/Microsoft.CognitiveServices/accounts/RegionSouthEastAsia/cskeys
// TEST: https://www.bing.com/translator
// FREE TIER: 2,000,000 chars / month (https://portal.azure.com/#@onequygmail.onmicrosoft.com/resource/subscriptions/3952d4d4-641f-4014-a32e-a1737e788663/resourceGroups/TranslateResourceGroup/providers/Microsoft.CognitiveServices/accounts/RegionSouthEastAsia/pricingtier)

// INSTALL:
//      + npm i axios
//      + change Location below

import axios from "axios";
import { CreateError, SafeGetArrayElement, SafeValue } from "../UtilsTS"
import { Language, TranslatedResult } from "./TranslationLanguages";

const Location = "southeastasia"; // change your location (region) here. Required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page. (https://portal.azure.com/#@onequygmail.onmicrosoft.com/resource/subscriptions/3952d4d4-641f-4014-a32e-a1737e788663/resourceGroups/TranslateResourceGroup/providers/Microsoft.CognitiveServices/accounts/RegionSouthEastAsia/cskeys)

const endpoint = "https://api.cognitive.microsofttranslator.com";

/**
 * @returns success: TranslatedResult[] translated (even word is unavailable to translate). but both cases full enough length.
 * @returns error: Error()
 */
export const MicrosoftTranslateAsync = async (
    key: string,
    texts: string[],
    toLang: string | Language,
    fromLang?: string | Language,
): Promise<TranslatedResult[] | Error> => {
    if (!Array.isArray(texts))
        return new Error('[MicrosoftTranslateAsync] texts are empty.')

    const from = fromLang ? (typeof fromLang === 'object' ? fromLang.language : fromLang) : 'en'
    const to = typeof toLang === 'object' ? toLang.language : toLang

    try {
        const res = await axios({
            baseURL: endpoint,
            url: '/translate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                'Ocp-Apim-Subscription-Region': Location,
                'Content-type': 'application/json',
            },
            params: {
                'api-version': '3.0',
                from,
                to,
            },
            data: texts.map(text => { return { text } }),
            responseType: 'json'
        })

        const arr = res.data

        if (Array.isArray(arr)) {
            if (arr.length !== texts.length)
                return new Error('[MicrosoftTranslateAsync] translated arr not same length with texts length')
            else {
                const arrResult: TranslatedResult[] = []

                for (let i = 0; i < arr.length; i++) {
                    const item = arr[i]
                    const firstChild = SafeGetArrayElement(item?.translations)

                    const t: TranslatedResult = {
                        // @ts-ignore
                        translated: SafeValue(firstChild?.text, texts[i]),
                        text: texts[i],
                    }

                    arrResult.push(t)
                }

                return arrResult
            }
        }
        else
            return new Error('[MicrosoftTranslateAsync] response translated arr is not array')
    }
    catch (error) {
        // if (error && error.stack)
        //     error.stack = ''

        return CreateError(error)
    }
}

/**
 * https://learn.microsoft.com/en-us/azure/ai-services/translator/language-support
 */
export const AllSupportedLanguages_Microsoft: Language[] = [
    {
        "language": "af",
        "name": "Afrikaans"
    },
    {
        "language": "sq",
        "name": "Albanian"
    },
    {
        "language": "am",
        "name": "Amharic"
    },
    {
        "language": "ar",
        "name": "Arabic"
    },
    {
        "language": "hy",
        "name": "Armenian"
    },
    {
        "language": "as",
        "name": "Assamese"
    },
    {
        "language": "az",
        "name": "Azerbaijani (Latin)"
    },
    {
        "language": "bn",
        "name": "Bangla"
    },
    {
        "language": "ba",
        "name": "Bashkir"
    },
    {
        "language": "eu",
        "name": "Basque"
    },
    {
        "language": "bho",
        "name": "Bhojpuri"
    },
    {
        "language": "brx",
        "name": "Bodo"
    },
    {
        "language": "bs",
        "name": "Bosnian (Latin)"
    },
    {
        "language": "bg",
        "name": "Bulgarian"
    },
    {
        "language": "yue",
        "name": "Cantonese (Traditional)"
    },
    {
        "language": "ca",
        "name": "Catalan"
    },
    {
        "language": "lzh",
        "name": "Chinese (Literary)"
    },
    {
        "language": "zh-Hans",
        "name": "Chinese Simplified"
    },
    {
        "language": "zh-Hant",
        "name": "Chinese Traditional"
    },
    {
        "language": "sn",
        "name": "chiShona"
    },
    {
        "language": "hr",
        "name": "Croatian"
    },
    {
        "language": "cs",
        "name": "Czech"
    },
    {
        "language": "da",
        "name": "Danish"
    },
    {
        "language": "prs",
        "name": "Dari"
    },
    {
        "language": "dv",
        "name": "Divehi"
    },
    {
        "language": "doi",
        "name": "Dogri"
    },
    {
        "language": "nl",
        "name": "Dutch"
    },
    {
        "language": "en",
        "name": "English"
    },
    {
        "language": "et",
        "name": "Estonian"
    },
    {
        "language": "fo",
        "name": "Faroese"
    },
    {
        "language": "fj",
        "name": "Fijian"
    },
    {
        "language": "fil",
        "name": "Filipino"
    },
    {
        "language": "fi",
        "name": "Finnish"
    },
    {
        "language": "fr",
        "name": "French"
    },
    {
        "language": "fr-ca",
        "name": "French (Canada)"
    },
    {
        "language": "gl",
        "name": "Galician"
    },
    {
        "language": "ka",
        "name": "Georgian"
    },
    {
        "language": "de",
        "name": "German"
    },
    {
        "language": "el",
        "name": "Greek"
    },
    {
        "language": "gu",
        "name": "Gujarati"
    },
    {
        "language": "ht",
        "name": "Haitian Creole"
    },
    {
        "language": "ha",
        "name": "Hausa"
    },
    {
        "language": "he",
        "name": "Hebrew"
    },
    {
        "language": "hi",
        "name": "Hindi"
    },
    {
        "language": "mww",
        "name": "Hmong Daw (Latin)"
    },
    {
        "language": "hu",
        "name": "Hungarian"
    },
    {
        "language": "is",
        "name": "Icelandic"
    },
    {
        "language": "ig",
        "name": "Igbo"
    },
    {
        "language": "id",
        "name": "Indonesian"
    },
    {
        "language": "ikt",
        "name": "Inuinnaqtun"
    },
    {
        "language": "iu",
        "name": "Inuktitut"
    },
    {
        "language": "iu-Latn",
        "name": "Inuktitut (Latin)"
    },
    {
        "language": "ga",
        "name": "Irish"
    },
    {
        "language": "it",
        "name": "Italian"
    },
    {
        "language": "ja",
        "name": "Japanese"
    },
    {
        "language": "kn",
        "name": "Kannada"
    },
    {
        "language": "ks",
        "name": "Kashmiri"
    },
    {
        "language": "kk",
        "name": "Kazakh"
    },
    {
        "language": "km",
        "name": "Khmer"
    },
    {
        "language": "rw",
        "name": "Kinyarwanda"
    },
    {
        "language": "tlh-Latn",
        "name": "Klingon"
    },
    {
        "language": "tlh-Piqd",
        "name": "Klingon (plqaD)"
    },
    {
        "language": "gom",
        "name": "Konkani"
    },
    {
        "language": "ko",
        "name": "Korean"
    },
    {
        "language": "ku",
        "name": "Kurdish (Central)"
    },
    {
        "language": "kmr",
        "name": "Kurdish (Northern)"
    },
    {
        "language": "ky",
        "name": "Kyrgyz (Cyrillic)"
    },
    {
        "language": "lo",
        "name": "Lao"
    },
    {
        "language": "lv",
        "name": "Latvian"
    },
    {
        "language": "lt",
        "name": "Lithuanian"
    },
    {
        "language": "ln",
        "name": "Lingala"
    },
    {
        "language": "dsb",
        "name": "Lower Sorbian"
    },
    {
        "language": "lug",
        "name": "Luganda"
    },
    {
        "language": "mk",
        "name": "Macedonian"
    },
    {
        "language": "mai",
        "name": "Maithili"
    },
    {
        "language": "mg",
        "name": "Malagasy"
    },
    {
        "language": "ms",
        "name": "Malay (Latin)"
    },
    {
        "language": "ml",
        "name": "Malayalam"
    },
    {
        "language": "mt",
        "name": "Maltese"
    },
    {
        "language": "mi",
        "name": "Maori"
    },
    {
        "language": "mr",
        "name": "Marathi"
    },
    {
        "language": "mn-Cyrl",
        "name": "Mongolian (Cyrillic)"
    },
    {
        "language": "mn-Mong",
        "name": "Mongolian (Traditional)"
    },
    {
        "language": "my",
        "name": "Myanmar"
    },
    {
        "language": "ne",
        "name": "Nepali"
    },
    {
        "language": "nb",
        "name": "Norwegian"
    },
    {
        "language": "nya",
        "name": "Nyanja"
    },
    {
        "language": "or",
        "name": "Odia"
    },
    {
        "language": "ps",
        "name": "Pashto"
    },
    {
        "language": "fa",
        "name": "Persian"
    },
    {
        "language": "pl",
        "name": "Polish"
    },
    {
        "language": "pt",
        "name": "Portuguese (Brazil)"
    },
    {
        "language": "pt-pt",
        "name": "Portuguese (Portugal)"
    },
    {
        "language": "pa",
        "name": "Punjabi"
    },
    {
        "language": "otq",
        "name": "Queretaro Otomi"
    },
    {
        "language": "ro",
        "name": "Romanian"
    },
    {
        "language": "run",
        "name": "Rundi"
    },
    {
        "language": "ru",
        "name": "Russian"
    },
    {
        "language": "sm",
        "name": "Samoan (Latin)"
    },
    {
        "language": "sr-Cyrl",
        "name": "Serbian (Cyrillic)"
    },
    {
        "language": "sr-Latn",
        "name": "Serbian (Latin)"
    },
    {
        "language": "st",
        "name": "Sesotho"
    },
    {
        "language": "nso",
        "name": "Sesotho sa Leboa"
    },
    {
        "language": "tn",
        "name": "Setswana"
    },
    {
        "language": "sd",
        "name": "Sindhi"
    },
    {
        "language": "si",
        "name": "Sinhala"
    },
    {
        "language": "sk",
        "name": "Slovak"
    },
    {
        "language": "sl",
        "name": "Slovenian"
    },
    {
        "language": "so",
        "name": "Somali (Arabic)"
    },
    {
        "language": "es",
        "name": "Spanish"
    },
    {
        "language": "sw",
        "name": "Swahili (Latin)"
    },
    {
        "language": "sv",
        "name": "Swedish"
    },
    {
        "language": "ty",
        "name": "Tahitian"
    },
    {
        "language": "ta",
        "name": "Tamil"
    },
    {
        "language": "tt",
        "name": "Tatar (Latin)"
    },
    {
        "language": "te",
        "name": "Telugu"
    },
    {
        "language": "th",
        "name": "Thai"
    },
    {
        "language": "bo",
        "name": "Tibetan"
    },
    {
        "language": "ti",
        "name": "Tigrinya"
    },
    {
        "language": "to",
        "name": "Tongan"
    },
    {
        "language": "tr",
        "name": "Turkish"
    },
    {
        "language": "tk",
        "name": "Turkmen (Latin)"
    },
    {
        "language": "uk",
        "name": "Ukrainian"
    },
    {
        "language": "hsb",
        "name": "Upper Sorbian"
    },
    {
        "language": "ur",
        "name": "Urdu"
    },
    {
        "language": "ug",
        "name": "Uyghur (Arabic)"
    },
    {
        "language": "uz",
        "name": "Uzbek (Latin)"
    },
    {
        "language": "vi",
        "name": "Vietnamese"
    },
    {
        "language": "cy",
        "name": "Welsh"
    },
    {
        "language": "xh",
        "name": "Xhosa"
    },
    {
        "language": "yo",
        "name": "Yoruba"
    },
    {
        "language": "yua",
        "name": "Yucatec Maya"
    },
    {
        "language": "zu",
        "name": "Zulu"
    }
] as const

// EXAMPLE RESPONE:
// [
//     {
//         "translations": [
//             {
//                 "text": "QUÝ TRƯỞNG",
//                 "to": "vi"
//             }
//         ]
//     },
//     {
//         "translations": [
//             {
//                 "text": "NÓI CHUYỆN PHIẾM",
//                 "to": "vi"
//             }
//         ]
//     },
//     {
//         "translations": [
//             {
//                 "text": "ĐOÀN XE",
//                 "to": "vi"
//             }
//         ]
//     }
// ]