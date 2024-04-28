// https://translate.systran.net/en/translationTools/text

// https://docs.systran.net/translateAPI/translation

import { Language } from "./DeepTranslateApi"
import { CreateError } from "./UtilsTS"

/**
 * @returns success: string[] translated
 * @returns error or word is unavailable to translate: Error()
 */
export const SystranTranslateAsync = async (
    key: string,
    words: string[],
    toLang: string | Language,
    fromLang?: string | Language,
): Promise<(string | Error)[] | Error> => {
    const from = fromLang ? (typeof fromLang === 'object' ? fromLang.language : fromLang) : 'en'
    const to = typeof toLang === 'object' ? toLang.language : toLang

    const url = `https://api-translate.systran.net/translation/text/translate?key=${key}&target=${to}&source=${from}` +
        words.map(word => `&input=${word}`).join('')

    try {
        const res = await fetch(url)

        const json = await res.json()
        const arr = json?.outputs

        if (Array.isArray(arr)) {
            return arr.map((translatedWordRes, index) => {
                if (translatedWordRes.output !== words[index]) { // success translated
                    return translatedWordRes.output
                }
                else // fail
                    return new Error('This word is unavailable to translate.')

            })
        }
        else
            return json as Error
    }
    catch (e) {
        return CreateError(e)
    }
}