import { DeepTranslateApiKey } from "../../../Keys"
import { DeepTranslateMultiWordAsync, Language } from "../../Common/DeepTranslateApi"

type BridgeTranslateService = {
    service: string,
    key: string,
}

var currentService: BridgeTranslateService = {
    service: 'deep',
    key: DeepTranslateApiKey,
}

export const BridgeTranslateMultiWordAsync = async (
    words: string[],
    toLang: string | Language,
    fromLang?: string | Language,
): Promise<(string | Error)[]> => {
    if (currentService.service === 'deep') {
        return await DeepTranslateMultiWordAsync(
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