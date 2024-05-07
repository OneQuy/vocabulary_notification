import { PairTime, TranslationService } from "../Types"

export const PopuplarityLevelNumber = 10 // todo


export const DefaultIntervalInMin = 60

export const IntervalInMinPresets: (undefined | number)[] = [
    10,
    30,
    60,
    120,
    180,
    240,
    300,
    360,
    420,
    480,
    60 * 24,
    undefined // custom
]


export const DefaultLimitWords = 5

export const LimitWordsPerDayPresets: (number)[] = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
]


export const DefaultExcludedTimePairs: PairTime[] = [
    [
        {
            hours: 0,
            minutes: 0,
            seconds: 0,
        },
        {
            hours: 7,
            minutes: 0,
            seconds: 0,
        }
    ],

    [
        {
            hours: 22,
            minutes: 0,
            seconds: 0,
        },
        {
            hours: 23,
            minutes: 59,
            seconds: 0,
        }
    ],
]


export const DefaultNumDaysToPush = 5

export const NumDaysToPushPresets: (number)[] = [
    5,
    10,
    20
]


export const TranslationServicePresets: TranslationService[] = [
    'Deep Translation',
    'Devisty Translation',
    'Microsoft Translation',
    'Lingvanex Translation',
    'Systran Translation'
]
