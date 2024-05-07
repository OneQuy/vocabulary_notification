// DOC: https://learn.microsoft.com/en-us/azure/ai-services/translator/quickstart-text-rest-api?tabs=nodejs
// YOUR KEY: https://portal.azure.com/#@onequygmail.onmicrosoft.com/resource/subscriptions/3952d4d4-641f-4014-a32e-a1737e788663/resourceGroups/TranslateResourceGroup/providers/Microsoft.CognitiveServices/accounts/RegionSouthEastAsia/cskeys
// TEST: https://www.bing.com/translator
// FREE TIER: 2,000,000 chars / month (https://portal.azure.com/#@onequygmail.onmicrosoft.com/resource/subscriptions/3952d4d4-641f-4014-a32e-a1737e788663/resourceGroups/TranslateResourceGroup/providers/Microsoft.CognitiveServices/accounts/RegionSouthEastAsia/pricingtier)

// INSTALL:
//      + npm i axios
//      + change Location below

import axios from "axios";
import { Language, TranslatedResult } from "./DeepTranslateApi"
import { CreateError, SafeGetArrayElement, SafeValue } from "../UtilsTS"

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