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
    translated?: string,
    lang: string,
}

export type SavedWordData = {
    word: string,
    localized: LocalizedData,
    notiTick: number,
}

export type PairTime = TimePickerResult[]