import { SqlExecuteAsync, OpenDatabaseAsync, SqlInsertOrUpdateAsync, SqlGetAllRowsWithColumnIncludedInArrayAsync, SqlDeleteAllRowsAsync } from "../../Common/SQLite"
import { IsAllValuableString as IsAllValuableStrings, SafeArrayLength, ToCanPrint } from "../../Common/UtilsTS"
import { SavedWordData } from "../Types"
import { ToWordLangString } from "./AppUtils"
import { GetTargetLangAsync } from "./Settings"

const IsLog = true

const DBName = 'LocalizedWordsDB'

const TableName = 'LocalizedWordsTable'

const Column_wordAndLang = 'wordAndLang' // lang is toLang
const Column_lastNotiTick = 'lastNotiTick'
const Column_localizedData = 'localizedData'

/**
 * @wordAndLang 'hello_en'
 * @lastNotiTick -1 (DefaultNotSeenNotiTick), 1788888888 did noti.
 * @localizedData not empty
 */
const CreateTableCmd = `CREATE TABLE IF NOT EXISTS ${TableName}(${Column_wordAndLang} VARCHAR(50) PRIMARY KEY, ${Column_lastNotiTick} INT NOT NULL, ${Column_localizedData} TEXT NOT NULL)`

var inited = false

export const CheckInitDBAsync = async () => {
    if (inited)
        return

    inited = true

    await OpenDatabaseAsync(DBName)

    const res = await SqlExecuteAsync(CreateTableCmd)

    if (IsLog)
        console.log('[CheckInitDBAsync] inited db')
}

export const DeleteAllRowsTableAsync = async () => {
    await CheckInitDBAsync()
    await SqlDeleteAllRowsAsync(TableName)
}

const AddOrUpdateLocalizedWordToDbAsync = async (
    wordAndLang: string,
    lastNotiTick: number,
    localizedData: string
): Promise<undefined | Error> => {
    if (!IsAllValuableStrings(true, wordAndLang, localizedData)) {
        return new Error('[AddOrUpdateLocalizedWordAsync] empty values')
    }

    await CheckInitDBAsync()

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
        console.log('[AddOrUpdateLocalizedWordAsync] ...', wordAndLang, 'success', res === undefined)

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

    const errors = resArr.filter(i => i !== undefined)

    if (errors.length > 0)
        console.error('[AddOrUpdateLocalizedWordsAsync] errors: ' + errors.length, errors);
    else {
        if (IsLog)
            console.log('[AddOrUpdateLocalizedWordsAsync] success all', resArr.length)
    }
}

/**
 * 
 * @param toLang undefined means get current target lang.
 * @param pushed undefined means get all both seen & unseen
 */
export const GetLocalizedWordFromDbAsync = async (
    toLang: string | undefined,
    pushed: boolean | undefined
): Promise<SavedWordData[] | Error> => {
    await CheckInitDBAsync()

    let sql =
        `SELECT * ` +
        `FROM ${TableName} `

    // pushed or not

    if (pushed !== undefined) {
        const now = Date.now()

        if (pushed)
            sql += `WHERE ${Column_lastNotiTick} < ${now} AND ${Column_lastNotiTick} > 0 `
        else
            sql += `WHERE ${Column_lastNotiTick} < 1 `
    }

    // target lang

    if (toLang === undefined) { // current target lang
        const lang = await GetTargetLangAsync()

        if (lang === null)
            return new Error('Please set a language you wish to translate to')

        toLang = lang
    }

    sql += `${pushed !== undefined ? 'AND' : 'WHERE'} ${Column_wordAndLang} LIKE '%\_${toLang}';`

    // console.log(sql);

    const res = await SqlExecuteAsync<SavedWordData>(sql)

    if (IsLog)
        console.log('[GetLocalizedWordFromDbAsync] toLang', toLang,
            'pushed', pushed, 'res length', SafeArrayLength(res)
        );

    return res
}

export const GetLocalizedWordsFromDbIfAvailableAsync = async (toLang: string, wordsToCheck: string[]): Promise<SavedWordData[] | Error> => {
    await CheckInitDBAsync()

    return await SqlGetAllRowsWithColumnIncludedInArrayAsync<SavedWordData>(
        TableName,
        Column_wordAndLang,
        wordsToCheck.map(word => ToWordLangString(word, toLang)))
}