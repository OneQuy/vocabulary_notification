import { TimePickerResult } from "./Components/TimePicker";

export interface Definition {
    definition: string;
    example?: string;
}

export interface Phonetic {
    text?: string;
    audio?: string;
}

export interface Meaning {
    partOfSpeech?: string;
    definitions: Definition[];
}

export interface Word {
    word: string;
    idx: number,
    count: number,
    phonetics?: Phonetic[],
    meanings: Meaning[],
}

export type LocalizedData = {
    translated: string,
}

export type SavedWordData = {
    wordAndLang: string,
    localizedData: LocalizedData | string,
    lastNotiTick: number,
}

export type TranslationService =
    'Deep Translation' |
    'Microsoft Translation' |
    'Lingvanex Translation' |
    'Systran Translation' |
    'Devisty Translation'

export type PairTime = TimePickerResult[]