import { ExecuteSqlAsync, OpenDatabaseAsync, SqlInsertOrUpdateAsync } from "../../Common/SQLite"
import { IsAllValuableString, ToCanPrint } from "../../Common/UtilsTS"
import { SavedWordData } from "../Types"

const IsLog = true

const DBName = 'SeenWordsDB'

const TableName = 'LocalizedWordsTable'

const Column_wordAndLang = 'wordAndLang'
const Column_lastNotiTick = 'lastNotiTick'
const Column_localizedData = 'localizedData'

/**
 * @wordAndLang 'hello_en'
 * @lastNotiTick -1 (not noti yet), 1788888888 did noti.
 * @localizedData not empty
 */
const CreateTableCmd = `CREATE TABLE IF NOT EXISTS ${TableName}(${Column_wordAndLang} VARCHAR(50) PRIMARY KEY, ${Column_lastNotiTick} INT NOT NULL, ${Column_localizedData} TEXT NOT NULL)`

var inited = false

export const CheckInitDBAsync = async () => {
    if (inited)
        return

    if (IsLog)
        console.log('[CheckInitDBAsync] inited.');

    inited = true

    await OpenDatabaseAsync(DBName)

    // await SqlDropTableAsync(TableName)

    await ExecuteSqlAsync(CreateTableCmd)
}

const AddOrUpdateLocalizedWordAsync = async (
    wordAndLang: string,
    lastNotiTick: number,
    localizedData: string
): Promise<undefined | Error> => {
    if (!IsAllValuableString(true, wordAndLang, localizedData)) {
        return new Error('[AddSeenWordAsync] empty values')
    }

    return await SqlInsertOrUpdateAsync(
        TableName,
        [
            {
                column: Column_wordAndLang,
                value: wordAndLang,
            },
            {
                column: Column_lastNotiTick,
                value: lastNotiTick,
            },
            {
                column: Column_localizedData,
                value: localizedData,
            }
        ]
    )
}

export const AddOrUpdateLocalizedWordsAsync = async (words: SavedWordData[]): Promise<void> => {
    await CheckInitDBAsync()

    const resArr = await Promise.all(words.map(word => {
        const localizedData = ToCanPrint(word.localizedData)
        return AddOrUpdateLocalizedWordAsync(word.wordAndLang, word.lastNotiTick, localizedData)
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
