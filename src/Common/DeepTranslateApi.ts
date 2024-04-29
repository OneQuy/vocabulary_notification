import { SafeValue } from "./UtilsTS";

export type Language = {
    "language": string,
    "name": string,
}

export type TranslatedResult = {
    text: string,
    translated?: string,
    error?: Error,
}

/**
 * @returns text translated if success (or word is unavailable to translate)
 * @returns Error() if api failed
 */
export const DeepTranslateAsync = async (
    key: string,
    text: string,
    toLang: string | Language,
    fromLang?: string | Language,
): Promise<TranslatedResult> => {
    return new Promise((resolve) => {
        const from = fromLang ? (typeof fromLang === 'object' ? fromLang.language : fromLang) : 'en'
        const to = typeof toLang === 'object' ? toLang.language : toLang

        const data = JSON.stringify({
            q: text,
            source: from,
            target: to,
        });

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.onload = function () {
            // console.log(xhr.getAllResponseHeaders());

            const json = JSON.parse(xhr.response)
            const translatedText = SafeValue(json?.data?.translations?.translatedText, '')

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

        xhr.open('POST', 'https://deep-translate1.p.rapidapi.com/language/translate/v2');
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.setRequestHeader('X-RapidAPI-Key', key);
        xhr.setRequestHeader('X-RapidAPI-Host', 'deep-translate1.p.rapidapi.com');

        xhr.send(data);
    })
}

/**
 * ### each element:
 * * text translated if success (or word is unavailable to translate)
 * * Error() if api failed
 */
export const DeepTranslateMultiWordAsync = async (
    key: string,
    words: string[],
    toLang: string | Language,
    fromLang?: string | Language,
): Promise<TranslatedResult[]> => {
    return await Promise.all(words.map(word => {
        return DeepTranslateAsync(key, word, toLang, fromLang)
    }))
}
export const Languages: Language[] = [
    {
        "language": "en",
        "name": "English",
    },
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
        "name": "Azerbaijani"
    },
    {
        "language": "bm",
        "name": "Bambara"
    },
    {
        "language": "eu",
        "name": "Basque"
    },
    {
        "language": "be",
        "name": "Belarusian"
    },
    {
        "language": "bn",
        "name": "Bengali"
    },
    {
        "language": "bho",
        "name": "Bhojpuri"
    },
    {
        "language": "bs",
        "name": "Bosnian"
    },
    {
        "language": "bg",
        "name": "Bulgarian"
    },
    {
        "language": "ca",
        "name": "Catalan"
    },
    {
        "language": "ceb",
        "name": "Cebuano"
    },
    {
        "language": "zh-CN",
        "name": "Chinese (Simplified)"
    },
    {
        "language": "zh-TW",
        "name": "Chinese (Traditional)"
    },
    {
        "language": "co",
        "name": "Corsican"
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
        "language": "dv",
        "name": "Dhivehi"
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
        "language": "eo",
        "name": "Esperanto"
    },
    {
        "language": "et",
        "name": "Estonian"
    },
    {
        "language": "ee",
        "name": "Ewe"
    },
    {
        "language": "fil",
        "name": "Filipino (Tagalog)"
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
        "language": "fy",
        "name": "Frisian"
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
        "language": "gn",
        "name": "Guarani"
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
        "language": "haw",
        "name": "Hawaiian"
    },
    {
        "language": "he",
        "name": "Hebrew"
    },
    {
        "language": "iw",
        "name": "Hebrew"
    },
    {
        "language": "hi",
        "name": "Hindi"
    },
    {
        "language": "hmn",
        "name": "Hmong"
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
        "language": "jv",
        "name": "Javanese"
    },
    {
        "language": "jw",
        "name": "Javanese"
    },
    {
        "language": "kn",
        "name": "Kannada"
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
        "language": "gom",
        "name": "Konkani"
    },
    {
        "language": "ko",
        "name": "Korean"
    },
    {
        "language": "kri",
        "name": "Krio"
    },
    {
        "language": "ku",
        "name": "Kurdish"
    },
    {
        "language": "ckb",
        "name": "Kurdish (Sorani)"
    },
    {
        "language": "ky",
        "name": "Kyrgyz"
    },
    {
        "language": "lo",
        "name": "Lao"
    },
    {
        "language": "la",
        "name": "Latin"
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
        "language": "lg",
        "name": "Luganda"
    },
    {
        "language": "lb",
        "name": "Luxembourgish"
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
        "name": "Malay"
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
        "language": "mni-Mtei",
        "name": "Meiteilon (Manipuri)"
    },
    {
        "language": "lus",
        "name": "Mizo"
    },
    {
        "language": "mn",
        "name": "Mongolian"
    },
    {
        "language": "my",
        "name": "Myanmar (Burmese)"
    },
    {
        "language": "ne",
        "name": "Nepali"
    },
    {
        "language": "no",
        "name": "Norwegian"
    },
    {
        "language": "ny",
        "name": "Nyanja (Chichewa)"
    },
    {
        "language": "or",
        "name": "Odia (Oriya)"
    },
    {
        "language": "om",
        "name": "Oromo"
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
        "name": "Portuguese (Portugal, Brazil)"
    },
    {
        "language": "pa",
        "name": "Punjabi"
    },
    {
        "language": "qu",
        "name": "Quechua"
    },
    {
        "language": "ro",
        "name": "Romanian"
    },
    {
        "language": "ru",
        "name": "Russian"
    },
    {
        "language": "sm",
        "name": "Samoan"
    },
    {
        "language": "sa",
        "name": "Sanskrit"
    },
    {
        "language": "gd",
        "name": "Scots Gaelic"
    },
    {
        "language": "nso",
        "name": "Sepedi"
    },
    {
        "language": "sr",
        "name": "Serbian"
    },
    {
        "language": "st",
        "name": "Sesotho"
    },
    {
        "language": "sn",
        "name": "Shona"
    },
    {
        "language": "sd",
        "name": "Sindhi"
    },
    {
        "language": "si",
        "name": "Sinhala (Sinhalese)"
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
        "name": "Somali"
    },
    {
        "language": "es",
        "name": "Spanish"
    },
    {
        "language": "su",
        "name": "Sundanese"
    },
    {
        "language": "sw",
        "name": "Swahili"
    },
    {
        "language": "sv",
        "name": "Swedish"
    },
    {
        "language": "tl",
        "name": "Tagalog (Filipino)"
    },
    {
        "language": "tg",
        "name": "Tajik"
    },
    {
        "language": "ta",
        "name": "Tamil"
    },
    {
        "language": "tt",
        "name": "Tatar"
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
        "language": "ti",
        "name": "Tigrinya"
    },
    {
        "language": "ts",
        "name": "Tsonga"
    },
    {
        "language": "tr",
        "name": "Turkish"
    },
    {
        "language": "tk",
        "name": "Turkmen"
    },
    {
        "language": "ak",
        "name": "Twi (Akan)"
    },
    {
        "language": "uk",
        "name": "Ukrainian"
    },
    {
        "language": "ur",
        "name": "Urdu"
    },
    {
        "language": "ug",
        "name": "Uyghur"
    },
    {
        "language": "uz",
        "name": "Uzbek"
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
        "language": "yi",
        "name": "Yiddish"
    },
    {
        "language": "yo",
        "name": "Yoruba"
    },
    {
        "language": "zu",
        "name": "Zulu"
    }
] as const