import { ExecuteSqlAsync, OpenDatabaseAsync } from "../../Common/SQLite"
import { ToCanPrint } from "../../Common/UtilsTS"
import { SavedWordData } from "../Types"

const IsLog = true

const DBName = 'SeenWordsDB'

/**
 * @wordAndLang 'hello_en'
 * @lastNotiTick -1 (not noti yet), 1788888888 did noti.
 * @localizedData not empty
 */
const CreateTableCmd = 'CREATE TABLE IF NOT EXISTS LocalizedWordsTable(wordAndLang VARCHAR(50) PRIMARY KEY, lastNotiTick INT, localizedData TEXT NOT NULL)'

var inited = false

export const CheckInitDBAsync = async () => {
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
        const localizedData = null
        // const localizedData = JSON.stringify(word.localized)

        const insertCmd =
            "INSERT OR IGNORE INTO LocalizedWordsTable" +
            "(wordAndLang, lastNotiTick, localizedData) VALUES " +
            `('${wordAndLang}', ${word.notiTick}, '${localizedData}')`

        if (IsLog) {
            console.log('[AddSeenWordsAsync] inserting...', word.word, ToCanPrint(localizedData));
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

    // const r = await ExecuteSqlAsync('SELECT * FROM `LocalizedWordsTable`')

    // if (r instanceof Error)
    //     return r

    // for (let i = 0; i < r.rows.length; i++) {
    //     const row = r.rows.item(i)

    //     console.log(row);

    // }
}


// `ON DUPLICATE KEY UPDATE ` +
// "(lastNotiTick, savedWordData) VALUES " +
// `(${word.notiTick}, '${savedWordData}') `

// `lastNotiTick = ${word.notiTick}, savedWordData = "8"`
// `lastNotiTick = ${word.notiTick}, savedWordData = '${savedWordData}'`
// `savedWordData = VALUES('savedWordData')`;
