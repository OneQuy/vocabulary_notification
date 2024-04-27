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