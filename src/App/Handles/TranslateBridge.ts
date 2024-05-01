import { DeepTranslateApiKey, SystranTranslateApiKey } from "../../../Keys"
import { DeepTranslateAsync, Language, TranslatedResult } from "../../Common/DeepTranslateApi"
import { SystranTranslateAsync } from "../../Common/SystranTranslateApi"
import { SavedWordData } from "../Types"
import { ToWordLangString } from "./AppUtils"
import { AddOrUpdateLocalizedWordsToDbAsync } from "./LocalizedWordsTable"

const IsLog = true

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
 * * text translated if success (or word is unavailable to translate). but both cases full enough length.
 * * Error() if api failed
*/
export const BridgeTranslateMultiWordAsync = async (
    texts: string[],
    toLang: string,
    fromLang?: string,
): Promise<TranslatedResult[] | Error> => {
    let translatedArrOrError

    if (currentService.service === 'deep') {
        translatedArrOrError = await DeepTranslateAsync(
            currentService.key,
            texts,
            toLang,
            fromLang
        )

        if (!(translatedArrOrError instanceof Error))
            await SaveToDbAsync(toLang, translatedArrOrError)

        return translatedArrOrError
    }
    else if (currentService.service === 'systran') {
        translatedArrOrError = await SystranTranslateAsync(
            currentService.key,
            texts,
            toLang,
            fromLang
        )

        if (!(translatedArrOrError instanceof Error))
            await SaveToDbAsync(toLang, translatedArrOrError)

        return translatedArrOrError
    }
    else {
        throw new Error('[ne] BridgeTranslateMultiWordAsync')
    }
}

const SaveToDbAsync = async (toLang: string, translatedResults: TranslatedResult[]) => {
    if (IsLog)
        console.log('[SaveToDbAsync] add new words to db:')

    await AddOrUpdateLocalizedWordsToDbAsync(translatedResults.map(word => {
        const saved: SavedWordData = {
            wordAndLang: ToWordLangString(word.text, toLang),
            localizedData: {
                translated: word.translated ?? word.text,
            },
            lastNotiTick: -1,
        }

        return saved
    }))
}