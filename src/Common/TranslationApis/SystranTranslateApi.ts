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