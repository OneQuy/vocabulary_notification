import { DeepTranslateApiKey, SystranTranslateApiKey } from "../../../Keys"
import { DeepTranslateAsync, Language, TranslatedResult } from "../../Common/DeepTranslateApi"
import { SystranTranslateAsync } from "../../Common/SystranTranslateApi"

type BridgeTranslateServiceName = 'deep' | 'systran'

type BridgeTranslateService = {
    service: BridgeTranslateServiceName,
    key: string,
}

var currentService: BridgeTranslateService = {
    service: 'deep',
    key: DeepTranslateApiKey,
}

// var currentService: BridgeTranslateService = {
//     service: 'systran',
//     key: SystranTranslateApiKey,
// }

/**
 * ### each element:
 * * text translated if success (or word is unavailable to translate)
 * * Error() if api failed
 */
export const BridgeTranslateMultiWordAsync = async (
    texts: string[],
    toLang: string | Language,
    fromLang?: string | Language,
): Promise<TranslatedResult[] | Error> => {
    if (currentService.service === 'deep') {
        return await DeepTranslateAsync(
            currentService.key,
            texts,
            toLang,
            fromLang
        )
    }
    else if (currentService.service === 'systran') {
        return await SystranTranslateAsync(
            currentService.key,
            texts,
            toLang,
            fromLang
        )
    }
    else {
        throw new Error('[ne] BridgeTranslateMultiWordAsync')
    }
}
