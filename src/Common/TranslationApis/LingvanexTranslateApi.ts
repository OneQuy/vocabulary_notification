// DOC: https://docs.lingvanex.com/reference/post_translate-1
// YOUR KEY: https://lingvanex.com/account
// TEST: https://lingvanex.com/translate/
// FREE TIER: 200,000 chars once register. 5$ for 1,000,000 chars.

import { CreateError, SafeValue } from "../UtilsTS"
import { Language, TranslatedResult } from "./TranslationLanguages"


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

/**
 * https://docs.lingvanex.com/reference/get_getlanguages-1
 */
export const AllSupportedLanguages_Lingvanex: Language[] = [
    {
        "language": "af_ZA",
        "name": "Afrikaans"
    },
    {
        "language": "sq_AL",
        "name": "Albanian"
    },
    {
        "language": "am_ET",
        "name": "Amharic"
    },
    {
        "language": "ar_EG",
        "name": "Arabic (Egypt)"
    },
    {
        "language": "ar_SA",
        "name": "Arabic (Saudi Arabia)"
    },
    {
        "language": "ar_AE",
        "name": "Arabic (United Arab Emirates)"
    },
    {
        "language": "hy_AM",
        "name": "Armenian"
    },
    {
        "language": "az_AZ",
        "name": "Azerbaijani"
    },
    {
        "language": "eu_ES",
        "name": "Basque"
    },
    {
        "language": "be_BY",
        "name": "Belarusian"
    },
    {
        "language": "bn_BD",
        "name": "Bengali"
    },
    {
        "language": "bs_BA",
        "name": "Bosnian"
    },
    {
        "language": "bg_BG",
        "name": "Bulgarian"
    },
    {
        "language": "ca_ES",
        "name": "Catalan"
    },
    {
        "language": "ceb_PH",
        "name": "Cebuano"
    },
    {
        "language": "ny_MW",
        "name": "Chichewa (Nyanja)"
    },
    {
        "language": "zh-Hans_CN",
        "name": "Chinese (simplified)"
    },
    {
        "language": "zh-Hant_TW",
        "name": "Chinese (traditional)"
    },
    {
        "language": "co_FR",
        "name": "Corsican"
    },
    {
        "language": "ht_HT",
        "name": "Creole"
    },
    {
        "language": "hr_HR",
        "name": "Croatian"
    },
    {
        "language": "cs_CZ",
        "name": "Czech"
    },
    {
        "language": "da_DK",
        "name": "Danish"
    },
    {
        "language": "nl_NL",
        "name": "Dutch"
    },
    {
        "language": "en_AU",
        "name": "English (Australian)"
    },
    {
        "language": "en_GB",
        "name": "English (Great Britain)"
    },
    {
        "language": "en_US",
        "name": "English (USA)"
    },
    {
        "language": "eo_WORLD",
        "name": "Esperanto"
    },
    {
        "language": "et_EE",
        "name": "Estonian"
    },
    {
        "language": "fi_FI",
        "name": "Finnish"
    },
    {
        "language": "fr_CA",
        "name": "French (Canada)"
    },
    {
        "language": "fr_FR",
        "name": "French (France)"
    },
    {
        "language": "fy_NL",
        "name": "Frisian"
    },
    {
        "language": "gl_ES",
        "name": "Galician"
    },
    {
        "language": "ka_GE",
        "name": "Georgian"
    },
    {
        "language": "de_DE",
        "name": "German"
    },
    {
        "language": "el_GR",
        "name": "Greek"
    },
    {
        "language": "gu_IN",
        "name": "Gujarati"
    },
    {
        "language": "ha_NE",
        "name": "Hausa"
    },
    {
        "language": "haw_US",
        "name": "Hawaiian"
    },
    {
        "language": "he_IL",
        "name": "Hebrew"
    },
    {
        "language": "hi_IN",
        "name": "Hindi"
    },
    {
        "language": "hmn_CN",
        "name": "Hmong"
    },
    {
        "language": "hu_HU",
        "name": "Hungarian"
    },
    {
        "language": "is_IS",
        "name": "Icelandic"
    },
    {
        "language": "ig_NG",
        "name": "Igbo"
    },
    {
        "language": "id_ID",
        "name": "Indonesian"
    },
    {
        "language": "ga_IE",
        "name": "Irish"
    },
    {
        "language": "it_IT",
        "name": "Italian"
    },
    {
        "language": "ja_JP",
        "name": "Japanese"
    },
    {
        "language": "jv_ID",
        "name": "Javanese"
    },
    {
        "language": "kn_IN",
        "name": "Kannada"
    },
    {
        "language": "kk_KZ",
        "name": "Kazakh"
    },
    {
        "language": "km_KH",
        "name": "Khmer"
    },
    {
        "language": "rw_RW",
        "name": "Kinyarwanda"
    },
    {
        "language": "ko_KR",
        "name": "Korean"
    },
    {
        "language": "ku_IR",
        "name": "Kurdish"
    },
    {
        "language": "ky_KG",
        "name": "Kyrgyz"
    },
    {
        "language": "lo_LA",
        "name": "Lao"
    },
    {
        "language": "la_VAT",
        "name": "Latin"
    },
    {
        "language": "lv_LV",
        "name": "Latvian"
    },
    {
        "language": "lt_LT",
        "name": "Lithuanian"
    },
    {
        "language": "lb_LU",
        "name": "Luxembourgish"
    },
    {
        "language": "mk_MK",
        "name": "Macedonian"
    },
    {
        "language": "mg_MG",
        "name": "Malagasy"
    },
    {
        "language": "ms_MY",
        "name": "Malay"
    },
    {
        "language": "ml_IN",
        "name": "Malayalam"
    },
    {
        "language": "mt_MT",
        "name": "Maltese"
    },
    {
        "language": "mi_NZ",
        "name": "Maori"
    },
    {
        "language": "mr_IN",
        "name": "Marathi"
    },
    {
        "language": "mn_MN",
        "name": "Mongolian"
    },
    {
        "language": "my_MM",
        "name": "Myanmar (Burmese)"
    },
    {
        "language": "ne_NP",
        "name": "Nepali"
    },
    {
        "language": "no_NO",
        "name": "Norwegian"
    },
    {
        "language": "or_OR",
        "name": "Odia"
    },
    {
        "language": "ps_AF",
        "name": "Pashto"
    },
    {
        "language": "fa_IR",
        "name": "Persian"
    },
    {
        "language": "pl_PL",
        "name": "Polish"
    },
    {
        "language": "pt_PT",
        "name": "Portuguese"
    },
    {
        "language": "pt_BR",
        "name": "Portuguese (Brazil)"
    },
    {
        "language": "pa_PK",
        "name": "Punjabi"
    },
    {
        "language": "ro_RO",
        "name": "Romanian"
    },
    {
        "language": "ru_RU",
        "name": "Russian"
    },
    {
        "language": "sm_WS",
        "name": "Samoan"
    },
    {
        "language": "gd_GB",
        "name": "Scottish"
    },
    {
        "language": "sr-Cyrl_RS",
        "name": "Serbian Kyrilic"
    },
    {
        "language": "st_LS",
        "name": "Sesotho"
    },
    {
        "language": "sn_ZW",
        "name": "Shona"
    },
    {
        "language": "sd_PK",
        "name": "Sindhi"
    },
    {
        "language": "si_LK",
        "name": "Sinhala"
    },
    {
        "language": "sk_SK",
        "name": "Slovak"
    },
    {
        "language": "sl_SI",
        "name": "Slovenian"
    },
    {
        "language": "so_SO",
        "name": "Somali"
    },
    {
        "language": "es_ES",
        "name": "Spanish"
    },
    {
        "language": "es_MX",
        "name": "Spanish (Mexico)"
    },
    {
        "language": "es_US",
        "name": "Spanish (United States)"
    },
    {
        "language": "su_ID",
        "name": "Sundanese"
    },
    {
        "language": "sw_TZ",
        "name": "Swahili"
    },
    {
        "language": "sv_SE",
        "name": "Swedish"
    },
    {
        "language": "tl_PH",
        "name": "Tagalog"
    },
    {
        "language": "tg_TJ",
        "name": "Tajik"
    },
    {
        "language": "ta_IN",
        "name": "Tamil"
    },
    {
        "language": "tt_TT",
        "name": "Tatar"
    },
    {
        "language": "te_IN",
        "name": "Telugu"
    },
    {
        "language": "th_TH",
        "name": "Thai"
    },
    {
        "language": "tr_TR",
        "name": "Turkish"
    },
    {
        "language": "tk_TM",
        "name": "Turkmen"
    },
    {
        "language": "uk_UA",
        "name": "Ukrainian"
    },
    {
        "language": "ur_PK",
        "name": "Urdu"
    },
    {
        "language": "ug_CN",
        "name": "Uyghur"
    },
    {
        "language": "uz_UZ",
        "name": "Uzbek"
    },
    {
        "language": "vi_VN",
        "name": "Vietnamese"
    },
    {
        "language": "cy_GB",
        "name": "Welsh"
    },
    {
        "language": "xh_ZA",
        "name": "Xhosa"
    },
    {
        "language": "yi_IL",
        "name": "Yiddish"
    },
    {
        "language": "yo_NG",
        "name": "Yoruba"
    },
    {
        "language": "zu_ZA",
        "name": "Zulu"
    }
] as const

// EXAMPLE RESPONE:
// {
//     "err": null,
//     "result": [
//         "LÂU ĐÀI",
//         "QUÂN TRƯỞNG"
//     ]
// }