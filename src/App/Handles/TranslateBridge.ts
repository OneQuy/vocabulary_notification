import { DeepTranslateApiKey, DevistyTranslateApiKey, LingvanexTranslateApiKey, MicrosoftTranslateApiKey, SystranTranslateApiKey } from "../../../Keys"
import { GetAlternativeConfig, GetRemoteConfigWithCheckFetchAsync, IsRemoteConfigLoadedRecently } from "../../Common/RemoteConfig"
import { AllSupportedLanguages_Deep, DeepTranslateAsync } from "../../Common/TranslationApis/DeepTranslateApi"
import { AllSupportedLanguages_Devisty, DevistyTranslateAsync } from "../../Common/TranslationApis/DevistyTranslateApi"
import { AllSupportedLanguages_Lingvanex, LingvanexTranslateApiAsync } from "../../Common/TranslationApis/LingvanexTranslateApi"
import { AllSupportedLanguages_Microsoft, MicrosoftTranslateAsync } from "../../Common/TranslationApis/MicrosoftTranslatorApi"
import { GetAllSupportedLanguages_Systran, SystranTranslateAsync } from "../../Common/TranslationApis/SystranTranslateApi"
import { Language, TranslatedResult } from "../../Common/TranslationApis/TranslationLanguages"
import { CapitalizeFirstLetter } from "../../Common/UtilsTS"
import { NotLatestConfig } from "../Hooks/useLocalText"
import { SavedWordData, TranslationService } from "../Types"
import { ToWordLangString } from "./AppUtils"
import { AddOrUpdateLocalizedWordsToDbAsync } from "./LocalizedWordsTable"
import { GetSourceLangAsync, GetTranslationServiceAsync } from "./Settings"

const IsLog = __DEV__

type GetTranslationServiceSuitResult = {
    key: string,
    supportedLanguages: Language[]

    translateAsync: (
        key: string,
        texts: string[],
        toLang: string,
        fromLang?: string,
        process?: (process: number) => void,
    ) => Promise<TranslatedResult[] | Error>,
}

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
    saveToDbNewWords = true,
    process?: (process: number) => void
): Promise<TranslatedResult[] | Error> => {
    // check last update config first 
    
    if (IsLog)
        console.log('[BridgeTranslateMultiWordAsync] check latest config?', IsRemoteConfigLoadedRecently())
    
    if (!IsRemoteConfigLoadedRecently()) {
        await GetRemoteConfigWithCheckFetchAsync(false, true)
        
        if (IsLog)
            console.log('[BridgeTranslateMultiWordAsync] fetched latest config?', IsRemoteConfigLoadedRecently())

        if (!IsRemoteConfigLoadedRecently()) {
            return new Error(NotLatestConfig)
        }
    }

    // start translate

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
        fromLang,
        process
    )

    if (saveToDbNewWords && Array.isArray(translatedArrOrError))
        await SaveToDbNewWordsAsync(toLang, translatedArrOrError)

    return translatedArrOrError
}

export const GetCurrentTranslationServiceSuitAsync = async (service?: TranslationService): Promise<GetTranslationServiceSuitResult> => {
    if (service === undefined)
        service = await GetTranslationServiceAsync()

    let result: GetTranslationServiceSuitResult

    if (service === 'Google Translation') { // deep
        result = {
            key: GetAlternativeConfig('deep', DeepTranslateApiKey),
            translateAsync: DeepTranslateAsync,
            supportedLanguages: AllSupportedLanguages_Deep,
        }
    }

    else if (service === 'Devisty Translation') {
        result = {
            key: GetAlternativeConfig('devisty', DevistyTranslateApiKey),
            translateAsync: DevistyTranslateAsync,
            supportedLanguages: AllSupportedLanguages_Devisty,
        }
    }

    else if (service === 'Microsoft Translation') {
        result = {
            key: GetAlternativeConfig('microsoft', MicrosoftTranslateApiKey),
            translateAsync: MicrosoftTranslateAsync,
            supportedLanguages: AllSupportedLanguages_Microsoft,
        }
    }

    else if (service === 'Lingvanex Translation') {
        result = {
            key: GetAlternativeConfig('lingvanex', LingvanexTranslateApiKey),
            translateAsync: LingvanexTranslateApiAsync,
            supportedLanguages: AllSupportedLanguages_Lingvanex,
        }
    }

    else if (service === 'Systran Translation') {
        result = {
            key: GetAlternativeConfig('systran', SystranTranslateApiKey),
            translateAsync: SystranTranslateAsync,
            supportedLanguages: GetAllSupportedLanguages_Systran(await GetSourceLangAsync()),
        }
    }

    else {
        throw new Error('[GetTranslationServiceSuitAsync] no service specificed')
    }

    if (IsLog)
        console.log('[GetTranslationServiceSuitAsync] ' + service, result.key);

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