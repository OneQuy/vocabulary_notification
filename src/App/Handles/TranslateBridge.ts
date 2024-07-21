import { DeepTranslateApiKey, DevistyTranslateApiKey, LingvanexTranslateApiKey, MicrosoftTranslateApiKey, SystranTranslateApiKey } from "../../../Keys"
import { GetAlternativeConfig, GetRemoteConfigWithCheckFetchAsync, IsRemoteConfigLoadedRecently } from "../../Common/RemoteConfig"
import { AllSupportedLanguages_Deep, DeepTranslateAsync } from "../../Common/TranslationApis/DeepTranslateApi"
import { AllSupportedLanguages_Devisty, DevistyTranslateAsync } from "../../Common/TranslationApis/DevistyTranslateApi"
import { AllSupportedLanguages_Lingvanex, LingvanexTranslateApiAsync } from "../../Common/TranslationApis/LingvanexTranslateApi"
import { AllSupportedLanguages_Microsoft, MicrosoftTranslateAsync } from "../../Common/TranslationApis/MicrosoftTranslatorApi"
import { GetAllSupportedLanguages_Systran, SystranTranslateAsync } from "../../Common/TranslationApis/SystranTranslateApi"
import { Language, TranslatedResult } from "../../Common/TranslationApis/TranslationLanguages"
import { CapitalizeFirstLetter, IsValuableArrayOrString, SafeArrayLength, ToCanPrint } from "../../Common/UtilsTS"
import { NotLatestConfig } from "../Hooks/useLocalText"
import { SavedWordData, TranslationService } from "../Types"
import { CheckCapabilityLanguage_ByCodeLang, ToWordLangString } from "./AppUtils"
import { AddOrUpdateLocalizedWordsToDbAsync } from "./LocalizedWordsTable"
import { GetSourceLangAsync, GetTargetLangAsync, GetTranslationServiceAsync, SetTargetLangAsyncAsync } from "./Settings"

const IsLog = __DEV__

type GetTranslationServiceSuitResult = {
    key: string,
    supportedLanguages: Language[]
    name: TranslationService,

    translateAsync: (
        key: string,
        texts: string[],
        toLang: string,
        fromLang?: string,
        process?: (process: number) => void,
    ) => Promise<TranslatedResult[] | Error>,
}

export const RedirectTranslationServiceAsync = async (service: TranslationService): Promise<TranslationService> => {
    const remote = await GetRemoteConfigWithCheckFetchAsync()

    const redirectServiceString = remote?.redirectService

    if (!redirectServiceString)
        return service

    // redirectServiceString = 'Microsoft Translation=Lingvanex Translation|Systran Translation=Google Translation'

    const pairs = redirectServiceString.split('|')

    if (!IsValuableArrayOrString(pairs))
        return service

    for (let pair of pairs) {
        const arr = pair.split('=')

        if (SafeArrayLength(arr) !== 2)
            continue

        if (arr[0] === service) {
            if (IsLog)
                console.log('[RedirectTranslationServiceAsync] REDIRECT', ToCanPrint(arr))

            return arr[1] as TranslationService
        }
    }

    return service
}

/**
 * 
 * @returns resetedTargetLang true only reseted target lang.
 */
export const CheckResetTargetLangIfNeedRedirectTranslationServiceAsync = async (): Promise<boolean> => {
    const [
        currentService,
        currentTargetLang,
    ] = await Promise.all([
        GetTranslationServiceAsync(),
        GetTargetLangAsync(),
    ]);

    if (!currentTargetLang) {
        if (IsLog)
            console.log('[CheckResetTargetLangIfNeedRedirectTranslationServiceAsync] not reset due to target lang null currently');

        return false
    }

    var redirectService = await RedirectTranslationServiceAsync(currentService)

    // if (redirectService === currentService) {
    //     if (IsLog)
    //         console.log('[CheckResetTargetLangIfNeedRedirectTranslationServiceAsync] not reset due to not redirect service');

    //     return false
    // }

    const suit = await GetCurrentTranslationServiceSuitAsync(redirectService)

    if (CheckCapabilityLanguage_ByCodeLang(currentTargetLang, suit.supportedLanguages)) {
        if (IsLog)
            console.log('[CheckResetTargetLangIfNeedRedirectTranslationServiceAsync] not reset due to target lang SUPPORTED');

        return false
    }
    else { // not suppport => reset
        if (IsLog)
            console.log('[CheckResetTargetLangIfNeedRedirectTranslationServiceAsync] RESETED due to NOT supported');

        await SetTargetLangAsyncAsync(undefined)

        return true
    }
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
        await SaveToDbNewWordsAsync(toLang, translatedArrOrError, currentService)

    return translatedArrOrError
}

export const GetCurrentTranslationServiceSuitAsync = async (service?: TranslationService): Promise<GetTranslationServiceSuitResult> => {
    if (service === undefined)
        service = await GetTranslationServiceAsync()

    service = await RedirectTranslationServiceAsync(service)

    let result: GetTranslationServiceSuitResult

    if (service === 'Google Translation') { // deep
        result = {
            name: service,
            key: GetAlternativeConfig('deep', DeepTranslateApiKey),
            translateAsync: DeepTranslateAsync,
            supportedLanguages: AllSupportedLanguages_Deep,
        }
    }

    else if (service === 'Devisty Translation') {
        result = {
            name: service,
            key: GetAlternativeConfig('devisty', DevistyTranslateApiKey),
            translateAsync: DevistyTranslateAsync,
            supportedLanguages: AllSupportedLanguages_Devisty,
        }
    }

    else if (service === 'Microsoft Translation') {
        result = {
            name: service,
            key: GetAlternativeConfig('microsoft', MicrosoftTranslateApiKey),
            translateAsync: MicrosoftTranslateAsync,
            supportedLanguages: AllSupportedLanguages_Microsoft,
        }
    }

    else if (service === 'Lingvanex Translation') {
        result = {
            name: service,
            key: GetAlternativeConfig('lingvanex', LingvanexTranslateApiKey),
            translateAsync: LingvanexTranslateApiAsync,
            supportedLanguages: AllSupportedLanguages_Lingvanex,
        }
    }

    else if (service === 'Systran Translation') {
        result = {
            name: service,
            key: GetAlternativeConfig('systran', SystranTranslateApiKey),
            translateAsync: SystranTranslateAsync,
            supportedLanguages: GetAllSupportedLanguages_Systran(await GetSourceLangAsync()),
        }
    }

    else {
        throw new Error('[GetTranslationServiceSuitAsync] no service specificed')
    }

    // if (IsLog)
    //     console.log('[GetTranslationServiceSuitAsync] ' + service, 'key:', result.key);

    return result
}

const SaveToDbNewWordsAsync = async (
    toLang: string, 
    translatedResults: TranslatedResult[],
    service: GetTranslationServiceSuitResult
) => {
    if (IsLog)
        console.log('[SaveToDbNewWordsAsync] just translated by', service.name, ', add new words to db:')

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