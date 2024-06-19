import { PairTime, TranslationService } from "../Types"

export const PopuplarityLevelNumber = 10


export const MinimumIntervalInMin = 10
export const DefaultIntervalInMin = 120

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


export const DefaultLimitWords = 10

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
            hours: 12,
            minutes: 0,
            seconds: 0,
        },
        {
            hours: 14,
            minutes: 0,
            seconds: 0,
        }
    ],

    [
        {
            hours: 21,
            minutes: 0,
            seconds: 0,
        },
        {
            hours: 8,
            minutes: 0,
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
    'Google Translation',
    'Devisty Translation',
    'Microsoft Translation',
    'Lingvanex Translation',
    'Systran Translation'
]
