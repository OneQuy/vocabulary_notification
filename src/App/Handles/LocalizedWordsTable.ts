import { ExecuteSqlAsync, OpenDatabaseAsync, SqlInsertOrUpdateAsync } from "../../Common/SQLite"
import { IsAllValuableString, ToCanPrint } from "../../Common/UtilsTS"
import { SavedWordData } from "../Types"

const IsLog = true

const DBName = 'LocalizedWordsDB'

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

const AddOrUpdateLocalizedWordToDbAsync = async (
    wordAndLang: string,
    lastNotiTick: number,
    localizedData: string
): Promise<undefined | Error> => {
    if (!IsAllValuableString(true, wordAndLang, localizedData)) {
        return new Error('[AddOrUpdateLocalizedWordAsync] empty values')
    }

    const res = await SqlInsertOrUpdateAsync(
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

    if (IsLog)
        console.log('[AddOrUpdateLocalizedWordAsync] inserting...', wordAndLang, 'success', !(res instanceof Error))

    return res
}

export const AddOrUpdateLocalizedWordsToDbAsync = async (words: SavedWordData[]): Promise<void> => {
    await CheckInitDBAsync()

    const resArr = await Promise.all(words.map(word => {
        if (!word.localizedData)
            return new Error('[AddOrUpdateLocalizedWordsAsync] what? !word.localizedData')

        const localizedData = ToCanPrint(word.localizedData)
        return AddOrUpdateLocalizedWordToDbAsync(word.wordAndLang, word.lastNotiTick, localizedData)
    }))

    const errors = resArr.filter(i => i instanceof Error)

    if (errors.length > 0)
        console.error('[AddOrUpdateLocalizedWordsAsync] errors: ' + errors.length, errors);
    else {
        if (IsLog)
            console.log('[AddOrUpdateLocalizedWordsAsync] success inserted all')
    }
}

export const GetLocalizedWordFromDbAsyncWordsAsync = async (lang: string | undefined, seen: boolean | undefined): Promise<SavedWordData[] | Error> => {
    let sql =
        `SELECT * ` +
        `FROM ${TableName} `

    if (seen !== undefined) {
        const now = Date.now()

        if (seen)
            sql += `WHERE ${Column_lastNotiTick} < ${now} AND ${Column_lastNotiTick} > 0 `
        else
            sql += `WHERE ${Column_lastNotiTick} < 1 `
    }

    if (lang !== undefined) {
        sql += `${seen !== undefined ? 'AND' : 'WHERE'} ${Column_wordAndLang} LIKE '%\_${lang}';`
    }

    // console.log(sql);
    
    return await ExecuteSqlAsync<SavedWordData>(sql)
}