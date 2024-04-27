// https://translate.systran.net/en/translationTools/text

// https://docs.systran.net/translateAPI/translation

import { Language } from "./DeepTranslateApi"
import { CreateError } from "./UtilsTS"

/**
 * @returns success: string[] translated (even if word is unavailable to translate)
 * @returns error: Error()
 */
export const SystranTranslateAsync = async (
    key: string,
    words: string[],
    toLang: string | Language,
    fromLang?: string | Language,
): Promise<string[] | Error> => {
    const from = fromLang ? (typeof fromLang === 'object' ? fromLang.language : fromLang) : 'en'
    const to = typeof toLang === 'object' ? toLang.language : toLang

    const url = `https://api-translate.systran.net/translation/text/translate?key=${key}&target=${to}&source=${from}` +
        words.map(word => `&input=${word}`).join('')

    try {
        const res = await fetch(url)

        const json = await res.json()
        const arr = json?.outputs

        if (Array.isArray(arr))
            return arr.map(i => i.output)
        else
            return json as Error
    }
    catch (e) { 
        return CreateError(e)
    }
}