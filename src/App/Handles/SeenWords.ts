import { ExecuteSqlAsync, OpenDatabaseAsync } from "../../Common/SQLite"
import { ToCanPrint } from "../../Common/UtilsTS"
import { SavedWordData } from "../Types"

const IsLog = true

const DBName = 'SeenWordsDB'

const CreateTableCmd = 'CREATE TABLE IF NOT EXISTS SeenSavedWords(wordAndLang VARCHAR(255) PRIMARY KEY, lastNotiTick INT, savedWordData TEXT)'

var inited = false

const CheckInitDBAsync = async () => {
    if (inited)
        return

    if (IsLog)
        console.log('[CheckInitDBAsync] inited.');

    inited = true

    await OpenDatabaseAsync(DBName)
    await ExecuteSqlAsync(CreateTableCmd)
}

/**
 * current using: INSERT OR IGNORE
 */
export const AddSeenWordsAsync = async (addWords: SavedWordData[]): Promise<void> => {
    await CheckInitDBAsync()

    const resArr = await Promise.all(addWords.map(word => {
        const wordAndLang = `${word.word}_${word.localized.lang}`
        const savedWordData = JSON.stringify(word)

        const insertCmd =
            // "INSERT INTO SeenSavedWords" +

            "INSERT OR IGNORE INTO SeenSavedWords" +
            "(wordAndLang, lastNotiTick, savedWordData) VALUES " +
            `('${wordAndLang}', ${word.notiTick}, '${savedWordData}')`

        // `ON DUPLICATE KEY UPDATE ` +
        // "(lastNotiTick, savedWordData) VALUES " +
        // `(${word.notiTick}, '${savedWordData}') `

        // `lastNotiTick = ${word.notiTick}, savedWordData = "8"`
        // `lastNotiTick = ${word.notiTick}, savedWordData = '${savedWordData}'`
        // `savedWordData = VALUES('savedWordData')`;

        if (IsLog) {
            console.log('[AddSeenWordsAsync] inserting...', ToCanPrint(savedWordData));
            // console.log(insertCmd);
        }

        return ExecuteSqlAsync(insertCmd)
    }))

    const errors = resArr.filter(i => i instanceof Error)

    if (errors.length > 0)
        console.error('[AddSeenWordsAsync] errors: ' + errors.length, errors);
    else {
        if (IsLog)
            console.log('[AddSeenWordsAsync] success inserted all')
    }
}

export const LoadAllSeenWordsAsync = async (): Promise<SavedWordData[] | Error> => {
    return []

    // await CheckInitDBAsync()

    // const r = await ExecuteSqlAsync('SELECT * FROM `SeenSavedWords`')

    // if (r instanceof Error)
    //     return r

    // for (let i = 0; i < r.rows.length; i++) {
    //     const row = r.rows.item(i)

    //     console.log(row);

    // }
}