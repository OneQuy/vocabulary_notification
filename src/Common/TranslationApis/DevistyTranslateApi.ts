// https://rapidapi.com/dickyagustin/api/text-translator2

import { SafeValue } from "../UtilsTS";
import { Language, TranslatedResult } from "./TranslationLanguages";

/**
 * @returns text translated if success (even word is unavailable to translate)
 * @returns Error() if api failed
 */
const DevistyTranslateSingleTextAsync = async (
    key: string,
    text: string,
    toLang: string | Language,
    fromLang?: string | Language,
): Promise<TranslatedResult> => {
    return new Promise((resolve) => {
        const from = fromLang ? (typeof fromLang === 'object' ? fromLang.language : fromLang) : 'en'
        const to = typeof toLang === 'object' ? toLang.language : toLang

        const data = `source_language=${from}&target_language=${to}&text=${text}`

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.onload = function () {
            const json = JSON.parse(xhr.response)
            const translatedText = SafeValue(json?.data?.translatedText, '')

            if (translatedText === '')
                resolve({
                    error: new Error(xhr.response),
                    text,
                } as TranslatedResult)
            else
                resolve({
                    translated: translatedText,
                    text,
                } as TranslatedResult)
        };

        xhr.onerror = function () {
            resolve({
                error: new Error('DeepTranslateAsync failed'),
                text,
            } as TranslatedResult)
        };

        xhr.open('POST', 'https://text-translator2.p.rapidapi.com/translate');
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-RapidAPI-Key', key);
        xhr.setRequestHeader('X-RapidAPI-Host', 'text-translator2.p.rapidapi.com');

        xhr.send(data);
    })
}

/**
 * ### each element:
 * * text translated arr if success (even word is unavailable to translate). but both cases full enough length.
 * * Error() if api failed
 */
export const DevistyTranslateAsync = async (
    key: string,
    texts: string[],
    toLang: string | Language,
    fromLang?: string | Language,
): Promise<TranslatedResult[] | Error> => {
    const resArr = await Promise.all(texts.map(text => {
        return DevistyTranslateSingleTextAsync(key, text, toLang, fromLang)
    }))

    for (let i of resArr) {
        if (i.error !== undefined)
            return i.error
    }

    if (resArr.length !== texts.length)
        return new Error('[DevistyTranslateAsync] translated arr not same length with texts length')

    return resArr
}

export const AllSupportedLanguages_Devisty: Language[] = [
    {
        language: "af",
        "name": "Afrikaans"
    },
    {
        language: "sq",
        "name": "Albanian"
    },
    {
        language: "am",
        "name": "Amharic"
    },
    {
        language: "ar",
        "name": "Arabic"
    },
    {
        language: "hy",
        "name": "Armenian"
    },
    {
        language: "az",
        "name": "Azerbaijani"
    },
    {
        language: "eu",
        "name": "Basque"
    },
    {
        language: "be",
        "name": "Belarusian"
    },
    {
        language: "bn",
        "name": "Bengali"
    },
    {
        language: "bs",
        "name": "Bosnian"
    },
    {
        language: "bg",
        "name": "Bulgarian"
    },
    {
        language: "ca",
        "name": "Catalan"
    },
    {
        language: "ceb",
        "name": "Cebuano"
    },
    {
        language: "ny",
        "name": "Chichewa"
    },
    {
        language: "zh-CN",
        "name": "Chinese (Simplified)"
    },
    {
        language: "zh-TW",
        "name": "Chinese (Traditional)"
    },
    {
        language: "co",
        "name": "Corsican"
    },
    {
        language: "hr",
        "name": "Croatian"
    },
    {
        language: "cs",
        "name": "Czech"
    },
    {
        language: "da",
        "name": "Danish"
    },
    {
        language: "nl",
        "name": "Dutch"
    },
    {
        language: "en",
        "name": "English"
    },
    {
        language: "eo",
        "name": "Esperanto"
    },
    {
        language: "et",
        "name": "Estonian"
    },
    {
        language: "tl",
        "name": "Filipino"
    },
    {
        language: "fi",
        "name": "Finnish"
    },
    {
        language: "fr",
        "name": "French"
    },
    {
        language: "fy",
        "name": "Frisian"
    },
    {
        language: "gl",
        "name": "Galician"
    },
    {
        language: "ka",
        "name": "Georgian"
    },
    {
        language: "de",
        "name": "German"
    },
    {
        language: "el",
        "name": "Greek"
    },
    {
        language: "gu",
        "name": "Gujarati"
    },
    {
        language: "ht",
        "name": "Haitian Creole"
    },
    {
        language: "ha",
        "name": "Hausa"
    },
    {
        language: "haw",
        "name": "Hawaiian"
    },
    {
        language: "iw",
        "name": "Hebrew"
    },
    {
        language: "hi",
        "name": "Hindi"
    },
    {
        language: "hmn",
        "name": "Hmong"
    },
    {
        language: "hu",
        "name": "Hungarian"
    },
    {
        language: "is",
        "name": "Icelandic"
    },
    {
        language: "ig",
        "name": "Igbo"
    },
    {
        language: "id",
        "name": "Indonesian"
    },
    {
        language: "ga",
        "name": "Irish"
    },
    {
        language: "it",
        "name": "Italian"
    },
    {
        language: "ja",
        "name": "Japanese"
    },
    {
        language: "jw",
        "name": "Javanese"
    },
    {
        language: "kn",
        "name": "Kannada"
    },
    {
        language: "kk",
        "name": "Kazakh"
    },
    {
        language: "km",
        "name": "Khmer"
    },
    {
        language: "rw",
        "name": "Kinyarwanda"
    },
    {
        language: "ko",
        "name": "Korean"
    },
    {
        language: "ku",
        "name": "Kurdish (Kurmanji)"
    },
    {
        language: "ky",
        "name": "Kyrgyz"
    },
    {
        language: "lo",
        "name": "Lao"
    },
    {
        language: "la",
        "name": "Latin"
    },
    {
        language: "lv",
        "name": "Latvian"
    },
    {
        language: "lt",
        "name": "Lithuanian"
    },
    {
        language: "lb",
        "name": "Luxembourgish"
    },
    {
        language: "mk",
        "name": "Macedonian"
    },
    {
        language: "mg",
        "name": "Malagasy"
    },
    {
        language: "ms",
        "name": "Malay"
    },
    {
        language: "ml",
        "name": "Malayalam"
    },
    {
        language: "mt",
        "name": "Maltese"
    },
    {
        language: "mi",
        "name": "Maori"
    },
    {
        language: "mr",
        "name": "Marathi"
    },
    {
        language: "mn",
        "name": "Mongolian"
    },
    {
        language: "my",
        "name": "Myanmar (Burmese)"
    },
    {
        language: "ne",
        "name": "Nepali"
    },
    {
        language: "no",
        "name": "Norwegian"
    },
    {
        language: "or",
        "name": "Odia (Oriya)"
    },
    {
        language: "ps",
        "name": "Pashto"
    },
    {
        language: "fa",
        "name": "Persian"
    },
    {
        language: "pl",
        "name": "Polish"
    },
    {
        language: "pt",
        "name": "Portuguese"
    },
    {
        language: "pa",
        "name": "Punjabi"
    },
    {
        language: "ro",
        "name": "Romanian"
    },
    {
        language: "ru",
        "name": "Russian"
    },
    {
        language: "sm",
        "name": "Samoan"
    },
    {
        language: "gd",
        "name": "Scots Gaelic"
    },
    {
        language: "sr",
        "name": "Serbian"
    },
    {
        language: "st",
        "name": "Sesotho"
    },
    {
        language: "sn",
        "name": "Shona"
    },
    {
        language: "sd",
        "name": "Sindhi"
    },
    {
        language: "si",
        "name": "Sinhala"
    },
    {
        language: "sk",
        "name": "Slovak"
    },
    {
        language: "sl",
        "name": "Slovenian"
    },
    {
        language: "so",
        "name": "Somali"
    },
    {
        language: "es",
        "name": "Spanish"
    },
    {
        language: "su",
        "name": "Sundanese"
    },
    {
        language: "sw",
        "name": "Swahili"
    },
    {
        language: "sv",
        "name": "Swedish"
    },
    {
        language: "tg",
        "name": "Tajik"
    },
    {
        language: "ta",
        "name": "Tamil"
    },
    {
        language: "tt",
        "name": "Tatar"
    },
    {
        language: "te",
        "name": "Telugu"
    },
    {
        language: "th",
        "name": "Thai"
    },
    {
        language: "tr",
        "name": "Turkish"
    },
    {
        language: "tk",
        "name": "Turkmen"
    },
    {
        language: "uk",
        "name": "Ukrainian"
    },
    {
        language: "ur",
        "name": "Urdu"
    },
    {
        language: "ug",
        "name": "Uyghur"
    },
    {
        language: "uz",
        "name": "Uzbek"
    },
    {
        language: "vi",
        "name": "Vietnamese"
    },
    {
        language: "cy",
        "name": "Welsh"
    },
    {
        language: "xh",
        "name": "Xhosa"
    },
    {
        language: "yi",
        "name": "Yiddish"
    },
    {
        language: "yo",
        "name": "Yoruba"
    },
    {
        language: "zu",
        "name": "Zulu"
    },
    {
        language: "he",
        "name": "Hebrew"
    },
    {
        language: "zh",
        "name": "Chinese (Simplified)"
    }
] as const