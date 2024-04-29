import { DeepTranslateApiKey, SystranTranslateApiKey } from "../../../Keys"
import { DeepTranslateMultiWordAsync, Language, TranslatedResult } from "../../Common/DeepTranslateApi"
import { SystranTranslateAsync } from "../../Common/SystranTranslateApi"

type BridgeTranslateServiceName = 'deep' | 'systran'

type BridgeTranslateService = {
    service: BridgeTranslateServiceName,
    key: string,
}

// var currentService: BridgeTranslateService = {
//     service: 'deep',
//     key: DeepTranslateApiKey,
// }

var currentService: BridgeTranslateService = {
    service: 'systran',
    key: SystranTranslateApiKey,
}

export const BridgeTranslateMultiWordAsync = async (
    words: string[],
    toLang: string | Language,
    fromLang?: string | Language,
): Promise<TranslatedResult[] | Error> => {
    if (currentService.service === 'deep') {
        return await DeepTranslateMultiWordAsync(
            currentService.key,
            words,
            toLang,
            fromLang
        )
    }
    else if (currentService.service === 'systran') {
        return await SystranTranslateAsync(
            currentService.key,
            words,
            toLang,
            fromLang
        )
    }
    else {
        throw new Error('[ne] BridgeTranslateMultiWordAsync')
    }
}
