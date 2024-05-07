// DOC: https://docs.lingvanex.com/reference/post_translate-1
// YOUR KEY: https://lingvanex.com/account
// TEST: https://lingvanex.com/translate/
// FREE TIER: 200,000 chars once register. 5$ for 1,000,000 chars.

import { Language, TranslatedResult } from "./DeepTranslateApi"
import { CreateError, SafeValue } from "../UtilsTS"


/**
 * @returns success: TranslatedResult[] translated (even word is unavailable to translate). but both cases full enough length.
 * @returns error: Error()
 */
export const LingvanexTranslateApiAsync = async (
    key: string,
    texts: string[],
    toLang: string | Language,
    fromLang?: string | Language,
): Promise<TranslatedResult[] | Error> => {
    if (!Array.isArray(texts))
        return new Error('[LingvanexTranslateApiAsync] texts are empty.')

    const from = fromLang ? (typeof fromLang === 'object' ? fromLang.language : fromLang) : 'en'
    const to = typeof toLang === 'object' ? toLang.language : toLang

    try {
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: key
            },
            body: JSON.stringify({
                platform: 'api',
                data: texts,
                to,
                from,
            })
        };

        const res = await fetch('https://api-b2b.backenster.com/b1/api/v3/translate', options)

        const arr = (await res.json()).result

        if (Array.isArray(arr)) {
            if (arr.length !== texts.length)
                return new Error('[LingvanexTranslateApiAsync] translated arr not same length with texts length')
            else {
                const arrResult: TranslatedResult[] = []

                for (let i = 0; i < arr.length; i++) {
                    const t: TranslatedResult = {
                        translated: SafeValue(arr[i], texts[i]),
                        text: texts[i],
                    }

                    arrResult.push(t)
                }

                return arrResult
            }
        }
        else
            return new Error('[LingvanexTranslateApiAsync] response translated arr is not array')
    }
    catch (error) {
        // if (error && error.stack)
        //     error.stack = ''

        return CreateError(error)
    }
}

// EXAMPLE RESPONE:
// {
//     "err": null,
//     "result": [
//         "LÂU ĐÀI",
//         "QUÂN TRƯỞNG"
//     ]
// }