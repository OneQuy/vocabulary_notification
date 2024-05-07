const fs = require('fs')

const outputPath = './editor/Assets/tmp.json'

const obj =
{
    "err": null,
    "result": [
        {
            "full_code": "af_ZA",
            "code_alpha_1": "af",
            "englishName": "Afrikaans",
            "codeName": "Afrikaans",
            "flagPath": "static/flags/afrikaans",
            "testWordForSyntezis": "Hallo",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "sq_AL",
            "code_alpha_1": "sq",
            "englishName": "Albanian",
            "codeName": "Albanian",
            "flagPath": "static/flags/albanian",
            "testWordForSyntezis": "Përshëndetje",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                }
            ]
        },
        {
            "full_code": "am_ET",
            "code_alpha_1": "am",
            "englishName": "Amharic",
            "codeName": "Amharic",
            "flagPath": "static/flags/amharic",
            "testWordForSyntezis": "ሰላም",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ar_EG",
            "code_alpha_1": "ar",
            "englishName": "Arabic (Egypt)",
            "codeName": "Arabic",
            "flagPath": "static/flags/arabic_eg",
            "testWordForSyntezis": "مرحبا",
            "rtl": "true",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ar_SA",
            "code_alpha_1": "ar",
            "englishName": "Arabic (Saudi Arabia)",
            "codeName": "Arabic",
            "flagPath": "static/flags/arabic_sa",
            "testWordForSyntezis": "مرحبا",
            "rtl": "true",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ar_AE",
            "code_alpha_1": "ar",
            "englishName": "Arabic (United Arab Emirates)",
            "codeName": "Arabic",
            "flagPath": "static/flags/arabic_ae",
            "testWordForSyntezis": "مرحبا",
            "rtl": "true",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "hy_AM",
            "code_alpha_1": "hy",
            "englishName": "Armenian",
            "codeName": "Armenian",
            "flagPath": "static/flags/armenian",
            "testWordForSyntezis": "Բարեւ",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "az_AZ",
            "code_alpha_1": "az",
            "englishName": "Azerbaijani",
            "codeName": "Azerbaijani",
            "flagPath": "static/flags/azerbaijani",
            "testWordForSyntezis": "Salam",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "eu_ES",
            "code_alpha_1": "eu",
            "englishName": "Basque",
            "codeName": "Basque",
            "flagPath": "static/flags/basque",
            "testWordForSyntezis": "Kaixo",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                }
            ]
        },
        {
            "full_code": "be_BY",
            "code_alpha_1": "be",
            "englishName": "Belarusian",
            "codeName": "Belarusian",
            "flagPath": "static/flags/belarusian",
            "testWordForSyntezis": "Прывітанне",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "bn_BD",
            "code_alpha_1": "bn",
            "englishName": "Bengali",
            "codeName": "Bengali",
            "flagPath": "static/flags/bengali",
            "testWordForSyntezis": "হ্যালো",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "bs_BA",
            "code_alpha_1": "bs",
            "englishName": "Bosnian",
            "codeName": "Bosnian",
            "flagPath": "static/flags/bosnian",
            "testWordForSyntezis": "Zdravo",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "bg_BG",
            "code_alpha_1": "bg",
            "englishName": "Bulgarian",
            "codeName": "Bulgarian",
            "flagPath": "static/flags/bulgarian",
            "testWordForSyntezis": "Здравейте",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ca_ES",
            "code_alpha_1": "ca",
            "englishName": "Catalan",
            "codeName": "Catalan",
            "flagPath": "static/flags/catalan",
            "testWordForSyntezis": "Hola",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ceb_PH",
            "code_alpha_1": "ceb",
            "englishName": "Cebuano",
            "codeName": "Cebuano",
            "flagPath": "static/flags/cebuano",
            "testWordForSyntezis": "Hello",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ny_MW",
            "code_alpha_1": "ny",
            "englishName": "Chichewa (Nyanja)",
            "codeName": "Chichewa",
            "flagPath": "static/flags/chichewa",
            "testWordForSyntezis": "Moni",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "zh-Hans_CN",
            "code_alpha_1": "zh-Hans",
            "englishName": "Chinese (simplified)",
            "codeName": "Chinese (Simplified)",
            "flagPath": "static/flags/chinese_mandarin",
            "testWordForSyntezis": "你好",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                }
            ]
        },
        {
            "full_code": "zh-Hant_TW",
            "code_alpha_1": "zh-Hant",
            "englishName": "Chinese (traditional)",
            "codeName": "Chinese (Traditional)",
            "flagPath": "static/flags/chinese_taiwan",
            "testWordForSyntezis": "你好",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "co_FR",
            "code_alpha_1": "co",
            "englishName": "Corsican",
            "codeName": "Corsican",
            "flagPath": "static/flags/corsican",
            "testWordForSyntezis": "Bonghjornu",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ht_HT",
            "code_alpha_1": "ht",
            "englishName": "Creole",
            "codeName": "Haitian Creole",
            "flagPath": "static/flags/haitian_creole",
            "testWordForSyntezis": "Bonjou",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                }
            ]
        },
        {
            "full_code": "hr_HR",
            "code_alpha_1": "hr",
            "englishName": "Croatian",
            "codeName": "Croatian",
            "flagPath": "static/flags/croatian",
            "testWordForSyntezis": "Zdravo",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "cs_CZ",
            "code_alpha_1": "cs",
            "englishName": "Czech",
            "codeName": "Czech",
            "flagPath": "static/flags/czech",
            "testWordForSyntezis": "Dobrý den",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "da_DK",
            "code_alpha_1": "da",
            "englishName": "Danish",
            "codeName": "Danish",
            "flagPath": "static/flags/danish",
            "testWordForSyntezis": "Hej",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "nl_NL",
            "code_alpha_1": "nl",
            "englishName": "Dutch",
            "codeName": "Dutch",
            "flagPath": "static/flags/dutch",
            "testWordForSyntezis": "Hallo",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "en_AU",
            "code_alpha_1": "en",
            "englishName": "English (Australian)",
            "codeName": "English",
            "flagPath": "static/flags/english_au",
            "testWordForSyntezis": "Hello",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "en_GB",
            "code_alpha_1": "en",
            "englishName": "English (Great Britain)",
            "codeName": "English",
            "flagPath": "static/flags/english_uk",
            "testWordForSyntezis": "Hello",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "en_US",
            "code_alpha_1": "en",
            "englishName": "English (USA)",
            "codeName": "English",
            "flagPath": "static/flags/english_us",
            "testWordForSyntezis": "Hello",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "eo_WORLD",
            "code_alpha_1": "eo",
            "englishName": "Esperanto",
            "codeName": "Esperanto",
            "flagPath": "static/flags/esperanto",
            "testWordForSyntezis": "Saluton",
            "rtl": "false",
            "modes": [
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "et_EE",
            "code_alpha_1": "et",
            "englishName": "Estonian",
            "codeName": "Estonian",
            "flagPath": "static/flags/estonian",
            "testWordForSyntezis": "Tere",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "fi_FI",
            "code_alpha_1": "fi",
            "englishName": "Finnish",
            "codeName": "Finnish",
            "flagPath": "static/flags/finnish",
            "testWordForSyntezis": "Hei",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "fr_CA",
            "code_alpha_1": "fr",
            "englishName": "French (Canada)",
            "codeName": "French",
            "flagPath": "static/flags/french_canada",
            "testWordForSyntezis": "Salut",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "fr_FR",
            "code_alpha_1": "fr",
            "englishName": "French (France)",
            "codeName": "French",
            "flagPath": "static/flags/french",
            "testWordForSyntezis": "Salut",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "fy_NL",
            "code_alpha_1": "fy",
            "englishName": "Frisian",
            "codeName": "Frisian",
            "flagPath": "static/flags/frisian",
            "testWordForSyntezis": "Hoi",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "gl_ES",
            "code_alpha_1": "gl",
            "englishName": "Galician",
            "codeName": "Galician",
            "flagPath": "static/flags/galician",
            "testWordForSyntezis": "Ola",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ka_GE",
            "code_alpha_1": "ka",
            "englishName": "Georgian",
            "codeName": "Georgian",
            "flagPath": "static/flags/georgian",
            "testWordForSyntezis": "გამარჯობა",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "de_DE",
            "code_alpha_1": "de",
            "englishName": "German",
            "codeName": "German",
            "flagPath": "static/flags/german",
            "testWordForSyntezis": "Hallo",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "el_GR",
            "code_alpha_1": "el",
            "englishName": "Greek",
            "codeName": "Greek",
            "flagPath": "static/flags/greek",
            "testWordForSyntezis": "Γεια σου",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "gu_IN",
            "code_alpha_1": "gu",
            "englishName": "Gujarati",
            "codeName": "Gujarati",
            "flagPath": "static/flags/gujarati",
            "testWordForSyntezis": "નમસ્તે",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ha_NE",
            "code_alpha_1": "ha",
            "englishName": "Hausa",
            "codeName": "Hausa",
            "flagPath": "static/flags/hausa",
            "testWordForSyntezis": "Sannu",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "haw_US",
            "code_alpha_1": "haw",
            "englishName": "Hawaiian",
            "codeName": "Hawaiian",
            "flagPath": "static/flags/hawaii",
            "testWordForSyntezis": "Aloha",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "he_IL",
            "code_alpha_1": "he",
            "englishName": "Hebrew",
            "codeName": "Hebrew",
            "flagPath": "static/flags/israel",
            "testWordForSyntezis": "שלום",
            "rtl": "true",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "hi_IN",
            "code_alpha_1": "hi",
            "englishName": "Hindi",
            "codeName": "Hindi",
            "flagPath": "static/flags/hindi",
            "testWordForSyntezis": "नमस्कार",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "hmn_CN",
            "code_alpha_1": "hmn",
            "englishName": "Hmong",
            "codeName": "Hmong",
            "flagPath": "static/flags/hmong",
            "testWordForSyntezis": "Nyob zoo",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "hu_HU",
            "code_alpha_1": "hu",
            "englishName": "Hungarian",
            "codeName": "Hungarian",
            "flagPath": "static/flags/hungarian",
            "testWordForSyntezis": "helló",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "is_IS",
            "code_alpha_1": "is",
            "englishName": "Icelandic",
            "codeName": "Icelandic",
            "flagPath": "static/flags/icelandic",
            "testWordForSyntezis": "Halló",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ig_NG",
            "code_alpha_1": "ig",
            "englishName": "Igbo",
            "codeName": "Igbo",
            "flagPath": "static/flags/igbo",
            "testWordForSyntezis": "Nnọọ",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "id_ID",
            "code_alpha_1": "id",
            "englishName": "Indonesian",
            "codeName": "Indonesian",
            "flagPath": "static/flags/indonesian",
            "testWordForSyntezis": "Halo",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ga_IE",
            "code_alpha_1": "ga",
            "englishName": "Irish",
            "codeName": "Irish",
            "flagPath": "static/flags/irish",
            "testWordForSyntezis": "Dia dhuit",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "it_IT",
            "code_alpha_1": "it",
            "englishName": "Italian",
            "codeName": "Italian",
            "flagPath": "static/flags/italian",
            "testWordForSyntezis": "Ciao",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ja_JP",
            "code_alpha_1": "ja",
            "englishName": "Japanese",
            "codeName": "Japanese",
            "flagPath": "static/flags/japanese",
            "testWordForSyntezis": "こんにちは",
            "rtl": "false",
            "modes": [
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "jv_ID",
            "code_alpha_1": "jv",
            "englishName": "Javanese",
            "codeName": "Javanese",
            "flagPath": "static/flags/javanese",
            "testWordForSyntezis": "Halo",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "kn_IN",
            "code_alpha_1": "kn",
            "englishName": "Kannada",
            "codeName": "Kannada",
            "flagPath": "static/flags/kannada",
            "testWordForSyntezis": "ನಮಸ್ಕಾರ",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                }
            ]
        },
        {
            "full_code": "kk_KZ",
            "code_alpha_1": "kk",
            "englishName": "Kazakh",
            "codeName": "Kazakh",
            "flagPath": "static/flags/kazakh",
            "testWordForSyntezis": "Сәлеметсіз бе",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "km_KH",
            "code_alpha_1": "km",
            "englishName": "Khmer",
            "codeName": "Khmer",
            "flagPath": "static/flags/khmer",
            "testWordForSyntezis": "ជំរាបសួរ",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "rw_RW",
            "code_alpha_1": "rw",
            "englishName": "Kinyarwanda",
            "codeName": "Kinyarwanda",
            "flagPath": "static/flags/kinyarwanda",
            "testWordForSyntezis": "Muraho",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ko_KR",
            "code_alpha_1": "ko",
            "englishName": "Korean",
            "codeName": "Korean",
            "flagPath": "static/flags/korean",
            "testWordForSyntezis": "안녕하세요",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ku_IR",
            "code_alpha_1": "ku",
            "englishName": "Kurdish",
            "codeName": "Kurdish (Kurmanji)",
            "flagPath": "static/flags/kurdish",
            "testWordForSyntezis": "Slav",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ky_KG",
            "code_alpha_1": "ky",
            "englishName": "Kyrgyz",
            "codeName": "Kyrgyz",
            "flagPath": "static/flags/kyrgyz",
            "testWordForSyntezis": "Салам",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "lo_LA",
            "code_alpha_1": "lo",
            "englishName": "Lao",
            "codeName": "Lao",
            "flagPath": "static/flags/lao",
            "testWordForSyntezis": "ສະບາຍດີ",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "la_VAT",
            "code_alpha_1": "la",
            "englishName": "Latin",
            "codeName": "Latin",
            "flagPath": "static/flags/latin",
            "testWordForSyntezis": "Salve",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "lv_LV",
            "code_alpha_1": "lv",
            "englishName": "Latvian",
            "codeName": "Latvian",
            "flagPath": "static/flags/latvian",
            "testWordForSyntezis": "Sveiki",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                }
            ]
        },
        {
            "full_code": "lt_LT",
            "code_alpha_1": "lt",
            "englishName": "Lithuanian",
            "codeName": "Lithuanian",
            "flagPath": "static/flags/lithuanian",
            "testWordForSyntezis": "Sveiki",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "lb_LU",
            "code_alpha_1": "lb",
            "englishName": "Luxembourgish",
            "codeName": "Luxembourgish",
            "flagPath": "static/flags/luxembourgish",
            "testWordForSyntezis": "Hallo",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "mk_MK",
            "code_alpha_1": "mk",
            "englishName": "Macedonian",
            "codeName": "Macedonian",
            "flagPath": "static/flags/macedonian",
            "testWordForSyntezis": "Здраво",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "mg_MG",
            "code_alpha_1": "mg",
            "englishName": "Malagasy",
            "codeName": "Malagasy",
            "flagPath": "static/flags/malagasy",
            "testWordForSyntezis": "Salama",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ms_MY",
            "code_alpha_1": "ms",
            "englishName": "Malay",
            "codeName": "Malay",
            "flagPath": "static/flags/malay",
            "testWordForSyntezis": "Hello",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ml_IN",
            "code_alpha_1": "ml",
            "englishName": "Malayalam",
            "codeName": "Malayalam",
            "flagPath": "static/flags/malayalam",
            "testWordForSyntezis": "ഹലോ",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "mt_MT",
            "code_alpha_1": "mt",
            "englishName": "Maltese",
            "codeName": "Maltese",
            "flagPath": "static/flags/maltese",
            "testWordForSyntezis": "Bongu",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                }
            ]
        },
        {
            "full_code": "mi_NZ",
            "code_alpha_1": "mi",
            "englishName": "Maori",
            "codeName": "Maori",
            "flagPath": "static/flags/maori",
            "testWordForSyntezis": "Kia ora",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "mr_IN",
            "code_alpha_1": "mr",
            "englishName": "Marathi",
            "codeName": "Marathi",
            "flagPath": "static/flags/marathi",
            "testWordForSyntezis": "नमस्कार",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "mn_MN",
            "code_alpha_1": "mn",
            "englishName": "Mongolian",
            "codeName": "Mongolian",
            "flagPath": "static/flags/mongolian",
            "testWordForSyntezis": "Сайн уу",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "my_MM",
            "code_alpha_1": "my",
            "englishName": "Myanmar (Burmese)",
            "codeName": "Myanmar (Burmese)",
            "flagPath": "static/flags/myanmar",
            "testWordForSyntezis": "မင်္ဂလာပါ",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ne_NP",
            "code_alpha_1": "ne",
            "englishName": "Nepali",
            "codeName": "Nepali",
            "flagPath": "static/flags/nepali",
            "testWordForSyntezis": "नमस्कार",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                }
            ]
        },
        {
            "full_code": "no_NO",
            "code_alpha_1": "no",
            "englishName": "Norwegian",
            "codeName": "Norwegian",
            "flagPath": "static/flags/norwegian",
            "testWordForSyntezis": "hallo",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "or_OR",
            "code_alpha_1": "or",
            "englishName": "Odia",
            "codeName": "Odia",
            "flagPath": "static/flags/odia",
            "testWordForSyntezis": "ନମସ୍କାର",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ps_AF",
            "code_alpha_1": "ps",
            "englishName": "Pashto",
            "codeName": "Pashto",
            "flagPath": "static/flags/pashto",
            "testWordForSyntezis": "سلام",
            "rtl": "true",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "fa_IR",
            "code_alpha_1": "fa",
            "englishName": "Persian",
            "codeName": "Persian",
            "flagPath": "static/flags/persian",
            "testWordForSyntezis": "سلام",
            "rtl": "true",
            "modes": [
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "pl_PL",
            "code_alpha_1": "pl",
            "englishName": "Polish",
            "codeName": "Polish",
            "flagPath": "static/flags/polish",
            "testWordForSyntezis": "Cześć",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "pt_PT",
            "code_alpha_1": "pt",
            "englishName": "Portuguese",
            "codeName": "Portuguese",
            "flagPath": "static/flags/portuguese",
            "testWordForSyntezis": "Olá",
            "rtl": "false",
            "modes": [
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "pt_BR",
            "code_alpha_1": "pt",
            "englishName": "Portuguese (Brazil)",
            "codeName": "Portuguese",
            "flagPath": "static/flags/portuguese_brazil",
            "testWordForSyntezis": "Olá",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "pa_PK",
            "code_alpha_1": "pa",
            "englishName": "Punjabi",
            "codeName": "Punjabi",
            "flagPath": "static/flags/punjabi",
            "testWordForSyntezis": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ro_RO",
            "code_alpha_1": "ro",
            "englishName": "Romanian",
            "codeName": "Romanian",
            "flagPath": "static/flags/romanian",
            "testWordForSyntezis": "Buna ziua",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ru_RU",
            "code_alpha_1": "ru",
            "englishName": "Russian",
            "codeName": "Russian",
            "flagPath": "static/flags/russian",
            "testWordForSyntezis": "Привет",
            "rtl": "false",
            "modes": [
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "sm_WS",
            "code_alpha_1": "sm",
            "englishName": "Samoan",
            "codeName": "Samoan",
            "flagPath": "static/flags/samoan",
            "testWordForSyntezis": "Talofa",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "gd_GB",
            "code_alpha_1": "gd",
            "englishName": "Scottish",
            "codeName": "Scots Gaelic",
            "flagPath": "static/flags/scottish_gaelic",
            "testWordForSyntezis": "Halò",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "sr-Cyrl_RS",
            "code_alpha_1": "sr-Cyrl",
            "englishName": "Serbian Kyrilic",
            "codeName": "Serbian Cyrilic",
            "flagPath": "static/flags/serbian",
            "testWordForSyntezis": "Здраво",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "st_LS",
            "code_alpha_1": "st",
            "englishName": "Sesotho",
            "codeName": "Sesotho",
            "flagPath": "static/flags/sesotho",
            "testWordForSyntezis": "Lumela",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "sn_ZW",
            "code_alpha_1": "sn",
            "englishName": "Shona",
            "codeName": "Shona",
            "flagPath": "static/flags/shona",
            "testWordForSyntezis": "Mhoro",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                }
            ]
        },
        {
            "full_code": "sd_PK",
            "code_alpha_1": "sd",
            "englishName": "Sindhi",
            "codeName": "Sindhi",
            "flagPath": "static/flags/sindhi",
            "testWordForSyntezis": "سلام",
            "rtl": "true",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "si_LK",
            "code_alpha_1": "si",
            "englishName": "Sinhala",
            "codeName": "Sinhala",
            "flagPath": "static/flags/sinhala",
            "testWordForSyntezis": "ආයුබෝවන්",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "sk_SK",
            "code_alpha_1": "sk",
            "englishName": "Slovak",
            "codeName": "Slovak",
            "flagPath": "static/flags/slovak",
            "testWordForSyntezis": "Ahoj",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "sl_SI",
            "code_alpha_1": "sl",
            "englishName": "Slovenian",
            "codeName": "Slovenian",
            "flagPath": "static/flags/slovenian",
            "testWordForSyntezis": "zdravo",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                }
            ]
        },
        {
            "full_code": "so_SO",
            "code_alpha_1": "so",
            "englishName": "Somali",
            "codeName": "Somali",
            "flagPath": "static/flags/somali",
            "testWordForSyntezis": "Hello",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "es_ES",
            "code_alpha_1": "es",
            "englishName": "Spanish",
            "codeName": "Spanish",
            "flagPath": "static/flags/spanish",
            "testWordForSyntezis": "Hola",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "es_MX",
            "code_alpha_1": "es",
            "englishName": "Spanish (Mexico)",
            "codeName": "Spanish",
            "flagPath": "static/flags/spanish_mexico",
            "testWordForSyntezis": "Hola",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "es_US",
            "code_alpha_1": "es",
            "englishName": "Spanish (United States)",
            "codeName": "Spanish",
            "flagPath": "static/flags/english_us",
            "testWordForSyntezis": "Hola",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "su_ID",
            "code_alpha_1": "su",
            "englishName": "Sundanese",
            "codeName": "Sundanese",
            "flagPath": "static/flags/sundanese",
            "testWordForSyntezis": "Halo",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "sw_TZ",
            "code_alpha_1": "sw",
            "englishName": "Swahili",
            "codeName": "Swahili",
            "flagPath": "static/flags/swahili",
            "testWordForSyntezis": "Habari",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "sv_SE",
            "code_alpha_1": "sv",
            "englishName": "Swedish",
            "codeName": "Swedish",
            "flagPath": "static/flags/swedish",
            "testWordForSyntezis": "Hallå",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "tl_PH",
            "code_alpha_1": "tl",
            "englishName": "Tagalog",
            "codeName": "Tagalog",
            "flagPath": "static/flags/tagalog",
            "testWordForSyntezis": "Kamusta",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "tg_TJ",
            "code_alpha_1": "tg",
            "englishName": "Tajik",
            "codeName": "Tajik",
            "flagPath": "static/flags/tajik",
            "testWordForSyntezis": "Салом",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ta_IN",
            "code_alpha_1": "ta",
            "englishName": "Tamil",
            "codeName": "Tamil",
            "flagPath": "static/flags/tamil",
            "testWordForSyntezis": "வணக்கம்",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "tt_TT",
            "code_alpha_1": "tt",
            "englishName": "Tatar",
            "codeName": "Tatar",
            "flagPath": "static/flags/tatar",
            "testWordForSyntezis": "Сәлам",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "te_IN",
            "code_alpha_1": "te",
            "englishName": "Telugu",
            "codeName": "Telugu",
            "flagPath": "static/flags/telugu",
            "testWordForSyntezis": "హలో",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "th_TH",
            "code_alpha_1": "th",
            "englishName": "Thai",
            "codeName": "Thai",
            "flagPath": "static/flags/thai",
            "testWordForSyntezis": "สวัสดี",
            "rtl": "false",
            "modes": [
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "tr_TR",
            "code_alpha_1": "tr",
            "englishName": "Turkish",
            "codeName": "Turkish",
            "flagPath": "static/flags/turkish",
            "testWordForSyntezis": "Merhaba",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                }
            ]
        },
        {
            "full_code": "tk_TM",
            "code_alpha_1": "tk",
            "englishName": "Turkmen",
            "codeName": "Turkmen",
            "flagPath": "static/flags/turkmen",
            "testWordForSyntezis": "Salam",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "uk_UA",
            "code_alpha_1": "uk",
            "englishName": "Ukrainian",
            "codeName": "Ukrainian",
            "flagPath": "static/flags/ukrainian",
            "testWordForSyntezis": "Вітаю",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ur_PK",
            "code_alpha_1": "ur",
            "englishName": "Urdu",
            "codeName": "Urdu",
            "flagPath": "static/flags/urdu",
            "testWordForSyntezis": "خوش آمدید",
            "rtl": "true",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                }
            ]
        },
        {
            "full_code": "ug_CN",
            "code_alpha_1": "ug",
            "englishName": "Uyghur",
            "codeName": "Uyghur",
            "flagPath": "static/flags/uyghur",
            "testWordForSyntezis": "ياخشىمۇسىز",
            "rtl": "true",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "uz_UZ",
            "code_alpha_1": "uz",
            "englishName": "Uzbek",
            "codeName": "Uzbek",
            "flagPath": "static/flags/uzbek",
            "testWordForSyntezis": "Salom",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "vi_VN",
            "code_alpha_1": "vi",
            "englishName": "Vietnamese",
            "codeName": "Vietnamese",
            "flagPath": "static/flags/vietnamese",
            "testWordForSyntezis": "Xin chào",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Speech recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "cy_GB",
            "code_alpha_1": "cy",
            "englishName": "Welsh",
            "codeName": "Welsh",
            "flagPath": "static/flags/welsh",
            "testWordForSyntezis": "Helo",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "xh_ZA",
            "code_alpha_1": "xh",
            "englishName": "Xhosa",
            "codeName": "Xhosa",
            "flagPath": "static/flags/xhosa",
            "testWordForSyntezis": "Mholo",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "yi_IL",
            "code_alpha_1": "yi",
            "englishName": "Yiddish",
            "codeName": "Yiddish",
            "flagPath": "static/flags/yiddish",
            "testWordForSyntezis": "העלא",
            "rtl": "true",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Image recognition",
                    "value": true
                }
            ]
        },
        {
            "full_code": "yo_NG",
            "code_alpha_1": "yo",
            "englishName": "Yoruba",
            "codeName": "Yoruba",
            "flagPath": "static/flags/yoruba",
            "testWordForSyntezis": "Pẹlẹ o",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translate web site",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                }
            ]
        },
        {
            "full_code": "zu_ZA",
            "code_alpha_1": "zu",
            "englishName": "Zulu",
            "codeName": "Zulu",
            "flagPath": "static/flags/afrikaans",
            "testWordForSyntezis": "Sawubona",
            "rtl": "false",
            "modes": [
                {
                    "name": "Translation",
                    "value": true
                },
                {
                    "name": "Translation document",
                    "value": true
                },
                {
                    "name": "Image object recognition",
                    "value": true
                },
                {
                    "name": "Translate web site",
                    "value": true
                }
            ]
        }
    ]
}

const Test = async () => {
    const arr = []

    for (let item of obj.result) {
        const Translation = item.modes.find(i => i.name === 'Translation')

        if (!Translation || !Translation.value) {
            console.error(item);
            continue
        }

        arr.push({
            language: item.full_code,
            name: item.englishName
        })
    }

    fs.writeFileSync(outputPath, JSON.stringify(arr, null, 1))

    console.log('done')
}

Test()