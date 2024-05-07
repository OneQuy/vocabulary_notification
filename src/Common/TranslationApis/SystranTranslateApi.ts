// https://translate.systran.net/en/translationTools/text

// https://docs.systran.net/translateAPI/translation

import { Language, TranslatedResult } from "./DeepTranslateApi"
import { CreateError } from "../UtilsTS"

/**
 * @returns success: string[] translated (even word is unavailable to translate). but both cases full enough length.
 * @returns error: Error()
 */
export const SystranTranslateAsync = async (
    key: string,
    texts: string[],
    toLang: string | Language,
    fromLang?: string | Language,
): Promise<TranslatedResult[] | Error> => {
    const from = fromLang ? (typeof fromLang === 'object' ? fromLang.language : fromLang) : 'en'
    const to = typeof toLang === 'object' ? toLang.language : toLang

    const url = `https://api-translate.systran.net/translation/text/translate?key=${key}&target=${to}&source=${from}` +
        texts.map(word => `&input=${word}`).join('')

    try {
        const res = await fetch(url)

        const json = await res.json()
        const arr = json?.outputs

        if (Array.isArray(arr)) {
            if (arr.length !== texts.length)
                return new Error('[SystranTranslateAsync] translated arr not same length with texts length')
            else {
                return arr.map((translatedWordRes, index) => {
                    return {
                        translated: translatedWordRes.output,
                        text: texts[index],
                    } as TranslatedResult
                })
            }
        }
        else
            return json as Error
    }
    catch (e) {
        return CreateError(e)
    }
}

const SystranSupportedLanguagePairs = [
    {
        "source": "ar",
        "target": "cs"
    },
    {
        "source": "ar",
        "target": "de"
    },
    {
        "source": "ar",
        "target": "en"
    },
    {
        "source": "ar",
        "target": "es"
    },
    {
        "source": "ar",
        "target": "fr"
    },
    {
        "source": "bg",
        "target": "en"
    },
    {
        "source": "bn",
        "target": "de"
    },
    {
        "source": "bn",
        "target": "en"
    },
    {
        "source": "bn",
        "target": "es"
    },
    {
        "source": "bn",
        "target": "fr"
    },
    {
        "source": "ca",
        "target": "en"
    },
    {
        "source": "cs",
        "target": "de"
    },
    {
        "source": "cs",
        "target": "en"
    },
    {
        "source": "cs",
        "target": "es"
    },
    {
        "source": "cs",
        "target": "fr"
    },
    {
        "source": "da",
        "target": "de"
    },
    {
        "source": "da",
        "target": "en"
    },
    {
        "source": "da",
        "target": "es"
    },
    {
        "source": "da",
        "target": "fr"
    },
    {
        "source": "de",
        "target": "ar"
    },
    {
        "source": "de",
        "target": "bn"
    },
    {
        "source": "de",
        "target": "cs"
    },
    {
        "source": "de",
        "target": "da"
    },
    {
        "source": "de",
        "target": "el"
    },
    {
        "source": "de",
        "target": "en"
    },
    {
        "source": "de",
        "target": "es"
    },
    {
        "source": "de",
        "target": "et"
    },
    {
        "source": "de",
        "target": "fa"
    },
    {
        "source": "de",
        "target": "fi"
    },
    {
        "source": "de",
        "target": "fr"
    },
    {
        "source": "de",
        "target": "ha"
    },
    {
        "source": "de",
        "target": "he"
    },
    {
        "source": "de",
        "target": "hi"
    },
    {
        "source": "de",
        "target": "hr"
    },
    {
        "source": "de",
        "target": "hu"
    },
    {
        "source": "de",
        "target": "hy"
    },
    {
        "source": "de",
        "target": "id"
    },
    {
        "source": "de",
        "target": "it"
    },
    {
        "source": "de",
        "target": "ja"
    },
    {
        "source": "de",
        "target": "ka"
    },
    {
        "source": "de",
        "target": "ko"
    },
    {
        "source": "de",
        "target": "lt"
    },
    {
        "source": "de",
        "target": "lv"
    },
    {
        "source": "de",
        "target": "my"
    },
    {
        "source": "de",
        "target": "nl"
    },
    {
        "source": "de",
        "target": "no"
    },
    {
        "source": "de",
        "target": "pl"
    },
    {
        "source": "de",
        "target": "ps"
    },
    {
        "source": "de",
        "target": "pt"
    },
    {
        "source": "de",
        "target": "ro"
    },
    {
        "source": "de",
        "target": "ru"
    },
    {
        "source": "de",
        "target": "sk"
    },
    {
        "source": "de",
        "target": "sl"
    },
    {
        "source": "de",
        "target": "sr"
    },
    {
        "source": "de",
        "target": "sv"
    },
    {
        "source": "de",
        "target": "sw"
    },
    {
        "source": "de",
        "target": "ta"
    },
    {
        "source": "de",
        "target": "tg"
    },
    {
        "source": "de",
        "target": "th"
    },
    {
        "source": "de",
        "target": "tr"
    },
    {
        "source": "de",
        "target": "uk"
    },
    {
        "source": "de",
        "target": "ur"
    },
    {
        "source": "de",
        "target": "vi"
    },
    {
        "source": "de",
        "target": "zh"
    },
    {
        "source": "de",
        "target": "zt"
    },
    {
        "source": "el",
        "target": "de"
    },
    {
        "source": "el",
        "target": "en"
    },
    {
        "source": "el",
        "target": "es"
    },
    {
        "source": "el",
        "target": "fr"
    },
    {
        "source": "en",
        "target": "ar"
    },
    {
        "source": "en",
        "target": "bg"
    },
    {
        "source": "en",
        "target": "bn"
    },
    {
        "source": "en",
        "target": "ca"
    },
    {
        "source": "en",
        "target": "cs"
    },
    {
        "source": "en",
        "target": "da"
    },
    {
        "source": "en",
        "target": "de"
    },
    {
        "source": "en",
        "target": "el"
    },
    {
        "source": "en",
        "target": "es"
    },
    {
        "source": "en",
        "target": "et"
    },
    {
        "source": "en",
        "target": "fa"
    },
    {
        "source": "en",
        "target": "fi"
    },
    {
        "source": "en",
        "target": "fr"
    },
    {
        "source": "en",
        "target": "ha"
    },
    {
        "source": "en",
        "target": "he"
    },
    {
        "source": "en",
        "target": "hi"
    },
    {
        "source": "en",
        "target": "hr"
    },
    {
        "source": "en",
        "target": "hu"
    },
    {
        "source": "en",
        "target": "hy"
    },
    {
        "source": "en",
        "target": "id"
    },
    {
        "source": "en",
        "target": "it"
    },
    {
        "source": "en",
        "target": "ja"
    },
    {
        "source": "en",
        "target": "ka"
    },
    {
        "source": "en",
        "target": "ko"
    },
    {
        "source": "en",
        "target": "lt"
    },
    {
        "source": "en",
        "target": "lv"
    },
    {
        "source": "en",
        "target": "ms"
    },
    {
        "source": "en",
        "target": "my"
    },
    {
        "source": "en",
        "target": "nl"
    },
    {
        "source": "en",
        "target": "no"
    },
    {
        "source": "en",
        "target": "pa"
    },
    {
        "source": "en",
        "target": "pl"
    },
    {
        "source": "en",
        "target": "ps"
    },
    {
        "source": "en",
        "target": "pt"
    },
    {
        "source": "en",
        "target": "ro"
    },
    {
        "source": "en",
        "target": "ru"
    },
    {
        "source": "en",
        "target": "sk"
    },
    {
        "source": "en",
        "target": "sl"
    },
    {
        "source": "en",
        "target": "so"
    },
    {
        "source": "en",
        "target": "sq"
    },
    {
        "source": "en",
        "target": "sr"
    },
    {
        "source": "en",
        "target": "sv"
    },
    {
        "source": "en",
        "target": "sw"
    },
    {
        "source": "en",
        "target": "ta"
    },
    {
        "source": "en",
        "target": "tg"
    },
    {
        "source": "en",
        "target": "th"
    },
    {
        "source": "en",
        "target": "tl"
    },
    {
        "source": "en",
        "target": "tr"
    },
    {
        "source": "en",
        "target": "uk"
    },
    {
        "source": "en",
        "target": "ur"
    },
    {
        "source": "en",
        "target": "vi"
    },
    {
        "source": "en",
        "target": "zh"
    },
    {
        "source": "en",
        "target": "zt"
    },
    {
        "source": "es",
        "target": "ar"
    },
    {
        "source": "es",
        "target": "bn"
    },
    {
        "source": "es",
        "target": "cs"
    },
    {
        "source": "es",
        "target": "da"
    },
    {
        "source": "es",
        "target": "de"
    },
    {
        "source": "es",
        "target": "el"
    },
    {
        "source": "es",
        "target": "en"
    },
    {
        "source": "es",
        "target": "et"
    },
    {
        "source": "es",
        "target": "fa"
    },
    {
        "source": "es",
        "target": "fi"
    },
    {
        "source": "es",
        "target": "fr"
    },
    {
        "source": "es",
        "target": "ha"
    },
    {
        "source": "es",
        "target": "he"
    },
    {
        "source": "es",
        "target": "hi"
    },
    {
        "source": "es",
        "target": "hr"
    },
    {
        "source": "es",
        "target": "hu"
    },
    {
        "source": "es",
        "target": "hy"
    },
    {
        "source": "es",
        "target": "id"
    },
    {
        "source": "es",
        "target": "it"
    },
    {
        "source": "es",
        "target": "ja"
    },
    {
        "source": "es",
        "target": "ka"
    },
    {
        "source": "es",
        "target": "ko"
    },
    {
        "source": "es",
        "target": "lt"
    },
    {
        "source": "es",
        "target": "lv"
    },
    {
        "source": "es",
        "target": "my"
    },
    {
        "source": "es",
        "target": "nl"
    },
    {
        "source": "es",
        "target": "no"
    },
    {
        "source": "es",
        "target": "pl"
    },
    {
        "source": "es",
        "target": "ps"
    },
    {
        "source": "es",
        "target": "pt"
    },
    {
        "source": "es",
        "target": "ro"
    },
    {
        "source": "es",
        "target": "ru"
    },
    {
        "source": "es",
        "target": "sk"
    },
    {
        "source": "es",
        "target": "sl"
    },
    {
        "source": "es",
        "target": "sr"
    },
    {
        "source": "es",
        "target": "sv"
    },
    {
        "source": "es",
        "target": "sw"
    },
    {
        "source": "es",
        "target": "ta"
    },
    {
        "source": "es",
        "target": "tg"
    },
    {
        "source": "es",
        "target": "th"
    },
    {
        "source": "es",
        "target": "tr"
    },
    {
        "source": "es",
        "target": "uk"
    },
    {
        "source": "es",
        "target": "ur"
    },
    {
        "source": "es",
        "target": "vi"
    },
    {
        "source": "es",
        "target": "zh"
    },
    {
        "source": "es",
        "target": "zt"
    },
    {
        "source": "et",
        "target": "de"
    },
    {
        "source": "et",
        "target": "en"
    },
    {
        "source": "et",
        "target": "es"
    },
    {
        "source": "et",
        "target": "fr"
    },
    {
        "source": "fa",
        "target": "de"
    },
    {
        "source": "fa",
        "target": "en"
    },
    {
        "source": "fa",
        "target": "es"
    },
    {
        "source": "fa",
        "target": "fr"
    },
    {
        "source": "fi",
        "target": "de"
    },
    {
        "source": "fi",
        "target": "en"
    },
    {
        "source": "fi",
        "target": "es"
    },
    {
        "source": "fi",
        "target": "fr"
    },
    {
        "source": "fr",
        "target": "ar"
    },
    {
        "source": "fr",
        "target": "bn"
    },
    {
        "source": "fr",
        "target": "cs"
    },
    {
        "source": "fr",
        "target": "da"
    },
    {
        "source": "fr",
        "target": "de"
    },
    {
        "source": "fr",
        "target": "el"
    },
    {
        "source": "fr",
        "target": "en"
    },
    {
        "source": "fr",
        "target": "es"
    },
    {
        "source": "fr",
        "target": "et"
    },
    {
        "source": "fr",
        "target": "fa"
    },
    {
        "source": "fr",
        "target": "fi"
    },
    {
        "source": "fr",
        "target": "ha"
    },
    {
        "source": "fr",
        "target": "he"
    },
    {
        "source": "fr",
        "target": "hi"
    },
    {
        "source": "fr",
        "target": "hr"
    },
    {
        "source": "fr",
        "target": "hu"
    },
    {
        "source": "fr",
        "target": "hy"
    },
    {
        "source": "fr",
        "target": "id"
    },
    {
        "source": "fr",
        "target": "it"
    },
    {
        "source": "fr",
        "target": "ja"
    },
    {
        "source": "fr",
        "target": "ka"
    },
    {
        "source": "fr",
        "target": "ko"
    },
    {
        "source": "fr",
        "target": "lt"
    },
    {
        "source": "fr",
        "target": "lv"
    },
    {
        "source": "fr",
        "target": "my"
    },
    {
        "source": "fr",
        "target": "nl"
    },
    {
        "source": "fr",
        "target": "no"
    },
    {
        "source": "fr",
        "target": "pl"
    },
    {
        "source": "fr",
        "target": "ps"
    },
    {
        "source": "fr",
        "target": "pt"
    },
    {
        "source": "fr",
        "target": "ro"
    },
    {
        "source": "fr",
        "target": "ru"
    },
    {
        "source": "fr",
        "target": "sk"
    },
    {
        "source": "fr",
        "target": "sl"
    },
    {
        "source": "fr",
        "target": "sr"
    },
    {
        "source": "fr",
        "target": "sv"
    },
    {
        "source": "fr",
        "target": "sw"
    },
    {
        "source": "fr",
        "target": "ta"
    },
    {
        "source": "fr",
        "target": "tg"
    },
    {
        "source": "fr",
        "target": "th"
    },
    {
        "source": "fr",
        "target": "tr"
    },
    {
        "source": "fr",
        "target": "uk"
    },
    {
        "source": "fr",
        "target": "ur"
    },
    {
        "source": "fr",
        "target": "vi"
    },
    {
        "source": "fr",
        "target": "zh"
    },
    {
        "source": "fr",
        "target": "zt"
    },
    {
        "source": "ha",
        "target": "de"
    },
    {
        "source": "ha",
        "target": "en"
    },
    {
        "source": "ha",
        "target": "es"
    },
    {
        "source": "ha",
        "target": "fr"
    },
    {
        "source": "he",
        "target": "de"
    },
    {
        "source": "he",
        "target": "en"
    },
    {
        "source": "he",
        "target": "es"
    },
    {
        "source": "he",
        "target": "fr"
    },
    {
        "source": "hi",
        "target": "de"
    },
    {
        "source": "hi",
        "target": "en"
    },
    {
        "source": "hi",
        "target": "es"
    },
    {
        "source": "hi",
        "target": "fr"
    },
    {
        "source": "hr",
        "target": "de"
    },
    {
        "source": "hr",
        "target": "en"
    },
    {
        "source": "hr",
        "target": "es"
    },
    {
        "source": "hr",
        "target": "fr"
    },
    {
        "source": "hu",
        "target": "de"
    },
    {
        "source": "hu",
        "target": "en"
    },
    {
        "source": "hu",
        "target": "es"
    },
    {
        "source": "hu",
        "target": "fr"
    },
    {
        "source": "hy",
        "target": "de"
    },
    {
        "source": "hy",
        "target": "en"
    },
    {
        "source": "hy",
        "target": "es"
    },
    {
        "source": "hy",
        "target": "fr"
    },
    {
        "source": "id",
        "target": "de"
    },
    {
        "source": "id",
        "target": "en"
    },
    {
        "source": "id",
        "target": "es"
    },
    {
        "source": "id",
        "target": "fr"
    },
    {
        "source": "id",
        "target": "ko"
    },
    {
        "source": "it",
        "target": "de"
    },
    {
        "source": "it",
        "target": "el"
    },
    {
        "source": "it",
        "target": "en"
    },
    {
        "source": "it",
        "target": "es"
    },
    {
        "source": "it",
        "target": "fr"
    },
    {
        "source": "ja",
        "target": "de"
    },
    {
        "source": "ja",
        "target": "en"
    },
    {
        "source": "ja",
        "target": "es"
    },
    {
        "source": "ja",
        "target": "fr"
    },
    {
        "source": "ja",
        "target": "ko"
    },
    {
        "source": "ka",
        "target": "de"
    },
    {
        "source": "ka",
        "target": "en"
    },
    {
        "source": "ka",
        "target": "es"
    },
    {
        "source": "ka",
        "target": "fr"
    },
    {
        "source": "ko",
        "target": "de"
    },
    {
        "source": "ko",
        "target": "en"
    },
    {
        "source": "ko",
        "target": "es"
    },
    {
        "source": "ko",
        "target": "fr"
    },
    {
        "source": "ko",
        "target": "id"
    },
    {
        "source": "ko",
        "target": "ja"
    },
    {
        "source": "ko",
        "target": "vi"
    },
    {
        "source": "ko",
        "target": "zh"
    },
    {
        "source": "lt",
        "target": "de"
    },
    {
        "source": "lt",
        "target": "en"
    },
    {
        "source": "lt",
        "target": "es"
    },
    {
        "source": "lt",
        "target": "fr"
    },
    {
        "source": "lv",
        "target": "de"
    },
    {
        "source": "lv",
        "target": "en"
    },
    {
        "source": "lv",
        "target": "es"
    },
    {
        "source": "lv",
        "target": "fr"
    },
    {
        "source": "ms",
        "target": "en"
    },
    {
        "source": "my",
        "target": "de"
    },
    {
        "source": "my",
        "target": "en"
    },
    {
        "source": "my",
        "target": "es"
    },
    {
        "source": "my",
        "target": "fr"
    },
    {
        "source": "nl",
        "target": "de"
    },
    {
        "source": "nl",
        "target": "en"
    },
    {
        "source": "nl",
        "target": "es"
    },
    {
        "source": "nl",
        "target": "fr"
    },
    {
        "source": "no",
        "target": "de"
    },
    {
        "source": "no",
        "target": "en"
    },
    {
        "source": "no",
        "target": "es"
    },
    {
        "source": "no",
        "target": "fr"
    },
    {
        "source": "pa",
        "target": "en"
    },
    {
        "source": "pl",
        "target": "de"
    },
    {
        "source": "pl",
        "target": "en"
    },
    {
        "source": "pl",
        "target": "es"
    },
    {
        "source": "pl",
        "target": "fr"
    },
    {
        "source": "ps",
        "target": "de"
    },
    {
        "source": "ps",
        "target": "en"
    },
    {
        "source": "ps",
        "target": "es"
    },
    {
        "source": "ps",
        "target": "fr"
    },
    {
        "source": "pt",
        "target": "de"
    },
    {
        "source": "pt",
        "target": "en"
    },
    {
        "source": "pt",
        "target": "es"
    },
    {
        "source": "pt",
        "target": "fr"
    },
    {
        "source": "ro",
        "target": "de"
    },
    {
        "source": "ro",
        "target": "en"
    },
    {
        "source": "ro",
        "target": "es"
    },
    {
        "source": "ro",
        "target": "fr"
    },
    {
        "source": "ru",
        "target": "cs"
    },
    {
        "source": "ru",
        "target": "de"
    },
    {
        "source": "ru",
        "target": "en"
    },
    {
        "source": "ru",
        "target": "es"
    },
    {
        "source": "ru",
        "target": "fr"
    },
    {
        "source": "sk",
        "target": "de"
    },
    {
        "source": "sk",
        "target": "en"
    },
    {
        "source": "sk",
        "target": "es"
    },
    {
        "source": "sk",
        "target": "fr"
    },
    {
        "source": "sl",
        "target": "de"
    },
    {
        "source": "sl",
        "target": "en"
    },
    {
        "source": "sl",
        "target": "es"
    },
    {
        "source": "sl",
        "target": "fr"
    },
    {
        "source": "sr",
        "target": "de"
    },
    {
        "source": "sr",
        "target": "en"
    },
    {
        "source": "sr",
        "target": "es"
    },
    {
        "source": "sr",
        "target": "fr"
    },
    {
        "source": "sv",
        "target": "de"
    },
    {
        "source": "sv",
        "target": "en"
    },
    {
        "source": "sv",
        "target": "es"
    },
    {
        "source": "sv",
        "target": "fr"
    },
    {
        "source": "sw",
        "target": "de"
    },
    {
        "source": "sw",
        "target": "en"
    },
    {
        "source": "sw",
        "target": "es"
    },
    {
        "source": "sw",
        "target": "fr"
    },
    {
        "source": "ta",
        "target": "de"
    },
    {
        "source": "ta",
        "target": "en"
    },
    {
        "source": "ta",
        "target": "es"
    },
    {
        "source": "ta",
        "target": "fr"
    },
    {
        "source": "tg",
        "target": "de"
    },
    {
        "source": "tg",
        "target": "en"
    },
    {
        "source": "tg",
        "target": "es"
    },
    {
        "source": "tg",
        "target": "fr"
    },
    {
        "source": "th",
        "target": "de"
    },
    {
        "source": "th",
        "target": "en"
    },
    {
        "source": "th",
        "target": "es"
    },
    {
        "source": "th",
        "target": "fr"
    },
    {
        "source": "tl",
        "target": "en"
    },
    {
        "source": "tr",
        "target": "de"
    },
    {
        "source": "tr",
        "target": "en"
    },
    {
        "source": "tr",
        "target": "es"
    },
    {
        "source": "tr",
        "target": "fr"
    },
    {
        "source": "uk",
        "target": "cs"
    },
    {
        "source": "uk",
        "target": "de"
    },
    {
        "source": "uk",
        "target": "en"
    },
    {
        "source": "uk",
        "target": "es"
    },
    {
        "source": "uk",
        "target": "fr"
    },
    {
        "source": "ur",
        "target": "de"
    },
    {
        "source": "ur",
        "target": "en"
    },
    {
        "source": "ur",
        "target": "es"
    },
    {
        "source": "ur",
        "target": "fr"
    },
    {
        "source": "vi",
        "target": "de"
    },
    {
        "source": "vi",
        "target": "en"
    },
    {
        "source": "vi",
        "target": "es"
    },
    {
        "source": "vi",
        "target": "fr"
    },
    {
        "source": "vi",
        "target": "ko"
    },
    {
        "source": "zh",
        "target": "de"
    },
    {
        "source": "zh",
        "target": "en"
    },
    {
        "source": "zh",
        "target": "es"
    },
    {
        "source": "zh",
        "target": "fr"
    },
    {
        "source": "zh",
        "target": "ko"
    },
    {
        "source": "zt",
        "target": "en"
    }
]

export const IsSupportedLanguagePairs_Systran = (
    sourceLangCode: string,
    targetLangCode: string
): boolean => {
    return SystranSupportedLanguagePairs.find(pair => pair.source === sourceLangCode && pair.target === targetLangCode) !== undefined
}
