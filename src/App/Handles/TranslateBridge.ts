import { DeepTranslateApiKey, DevistyTranslateApiKey, LingvanexTranslateApiKey, MicrosoftTranslateApiKey, SystranTranslateApiKey } from "../../../Keys"
import { AllSupportedLanguages_Deep, DeepTranslateAsync } from "../../Common/TranslationApis/DeepTranslateApi"
import { AllSupportedLanguages_Devisty, DevistyTranslateAsync } from "../../Common/TranslationApis/DevistyTranslateApi"
import { AllSupportedLanguages_Lingvanex, LingvanexTranslateApiAsync } from "../../Common/TranslationApis/LingvanexTranslateApi"
import { AllSupportedLanguages_Microsoft, MicrosoftTranslateAsync } from "../../Common/TranslationApis/MicrosoftTranslatorApi"
import { GetAllSupportedLanguages_Systran, SystranTranslateAsync } from "../../Common/TranslationApis/SystranTranslateApi"
import { Language, TranslatedResult } from "../../Common/TranslationApis/TranslationLanguages"
import { CapitalizeFirstLetter } from "../../Common/UtilsTS"
import { SavedWordData, TranslationService } from "../Types"
import { ToWordLangString } from "./AppUtils"
import { AddOrUpdateLocalizedWordsToDbAsync } from "./LocalizedWordsTable"
import { GetSourceLangAsync, GetTranslationServiceAsync } from "./Settings"

const IsLog = true

type GetTranslationServiceSuitResult = {
    key: string,
    supportedLanguages: Language[]

    translateAsync: (
        key: string,
        texts: string[],
        toLang: string,
        fromLang?: string,
    ) => Promise<TranslatedResult[] | Error>,
}

var cachedGetTranslationServiceSuitResult: Record<any, any> = {}

/**
 * ### each element:
 * * text translated if success (or word is unavailable to translate). but both cases full enough length.
 * * Error() if api failed
*/
export const BridgeTranslateMultiWordAsync = async (
    texts: string[],
    toLang: string,
    fromLang?: string,
    service?: TranslationService,
    saveToDbNewWords = true
): Promise<TranslatedResult[] | Error> => {
    texts = texts.map(word => CapitalizeFirstLetter(word))

    const currentService = await GetCurrentTranslationServiceSuitAsync(service)

    if (IsLog)
        console.log('[BridgeTranslateMultiWordAsync] translating... toLang', toLang,
            'fromLang', fromLang,
            'saveToDbNewWords', saveToDbNewWords,
            'service', service);

    const translatedArrOrError = await currentService.translateAsync(
        currentService.key,
        texts,
        toLang,
        fromLang
    )

    if (saveToDbNewWords && Array.isArray(translatedArrOrError))
        await SaveToDbNewWordsAsync(toLang, translatedArrOrError)

    return translatedArrOrError
}

export const GetCurrentTranslationServiceSuitAsync = async (service?: TranslationService): Promise<GetTranslationServiceSuitResult> => {
    if (service === undefined)
        service = await GetTranslationServiceAsync()

    if (cachedGetTranslationServiceSuitResult) {
        const cached = cachedGetTranslationServiceSuitResult[service]

        if (cached) {
            if (IsLog)
                console.log('[GetTranslationServiceSuitAsync] cached', service);

            return cached
        }
    }

    if (IsLog)
        console.log(('[GetTranslationServiceSuitAsync] initted... ' + service));

    let result: GetTranslationServiceSuitResult

    if (service === 'Deep Translation') {
        result = {
            key: DeepTranslateApiKey,
            translateAsync: DeepTranslateAsync,
            supportedLanguages: AllSupportedLanguages_Deep,
        }
    }

    else if (service === 'Devisty Translation') {
        result = {
            key: DevistyTranslateApiKey,
            translateAsync: DevistyTranslateAsync,
            supportedLanguages: AllSupportedLanguages_Devisty,
        }
    }

    else if (service === 'Microsoft Translation') {
        result = {
            key: MicrosoftTranslateApiKey,
            translateAsync: MicrosoftTranslateAsync,
            supportedLanguages: AllSupportedLanguages_Microsoft,
        }
    }

    else if (service === 'Lingvanex Translation') {
        result = {
            key: LingvanexTranslateApiKey,
            translateAsync: LingvanexTranslateApiAsync,
            supportedLanguages: AllSupportedLanguages_Lingvanex,
        }
    }

    else if (service === 'Systran Translation') {
        result = {
            key: SystranTranslateApiKey,
            translateAsync: SystranTranslateAsync,
            supportedLanguages: GetAllSupportedLanguages_Systran(await GetSourceLangAsync()),
        }
    }

    else {
        throw new Error('[GetTranslationServiceSuitAsync] no service specificed')
    }

    cachedGetTranslationServiceSuitResult[service] = result

    return result
}

const SaveToDbNewWordsAsync = async (toLang: string, translatedResults: TranslatedResult[]) => {
    const currentService = await GetTranslationServiceAsync()

    if (IsLog)
        console.log('[SaveToDbAsync] just translated by', currentService, ', add new words to db:')

    await AddOrUpdateLocalizedWordsToDbAsync(translatedResults.map(word => {
        const saved: SavedWordData = {
            wordAndLang: ToWordLangString(word.text, toLang),
            localizedData: {
                translated: word.translated ?? word.text,
            },
            lastNotiTick: -1,
        }

        // console.log(`${word.text} (${word.translated})`);

        return saved
    }))
}