// https://github.com/craftzdog/react-native-sqlite-2
// https://docs.kony.com/konylibrary/visualizer/viz_api_dev_guide/content/kony.db_functions.htm#SQLStatementErrorCallback

// INSTALL:
// Just: npm i react-native-sqlite-2

import SQLite, { SQLResultSet, WebsqlDatabase } from 'react-native-sqlite-2'

export type SqlColumnAndValue = {
    column: string,
    value: string | number,
}

var db: WebsqlDatabase | undefined

/**
 * @returns (col1, col2, col3)
 */
const SqlGenerateColumnNamesInBracketText = (values: SqlColumnAndValue[]) => {
    return `(${values.map(val => val.column).join(',')})`
}

/**
 * @returns ('hello', 5, 'lottie')
 */
const SqlGenerateValuesInBracketText = (values: SqlColumnAndValue[]) => {
    return `(${values.map(val => {
        if (typeof val.value === 'number')
            return val.value
        else
            return `'${val.value}'`
    }).join(',')})`
}

/**
 * @returns ContactName = 'Alfred Schmidt', City= 'Frankfurt'
 */
const SqlGenerateColumnEqualValueText = (values: SqlColumnAndValue[]) => {
    return `${values.map(val => {
        if (typeof val.value === 'number')
            return `${val.column}=${val.value}`
        else
            return `${val.column}='${val.value}'`
    }).join(',')}`
}

export const OpenDatabaseAsync = (dbName: string): Promise<void> => {
    return new Promise((resolve: () => void) => {
        if (db) {
            resolve()
            return
        }

        db = SQLite.openDatabase(
            dbName,
            undefined,
            undefined,
            undefined,
            (_) => {
                resolve()
            })
    })
}

export const SqlIsExistedAsync = async (table: string, value: SqlColumnAndValue): Promise<boolean> => {
    const getRowCmd = `SELECT 1 FROM ${table} WHERE ${value.column} = '${value.value}';`
    const res = await ExecuteSqlAsync(getRowCmd)

    if (res instanceof Error)
        return false

    return res.rows.length >= 1
}

export const SqlLogAllRowsAsync = async (table: string): Promise<void> => {
    const allrows = await SqlGetAllRowsAsync(table)

    if (allrows instanceof Error) {
        console.log('[SqlLogAllRowsAsync] ' + allrows)
        return
    }

    for (let i = 0; i < allrows.rows.length; i++)
        console.log(allrows.rows.item(i));
}

export const SqlGetAllRowsAsync = async (table: string): Promise<SQLResultSet | Error> => {
    const cmd = `SELECT * FROM ${table}`
    const res = await ExecuteSqlAsync(cmd)
    return res
}

export const SqlInsertOrUpdateAsync = async (table: string, values: SqlColumnAndValue[]): Promise<undefined | Error> => {
    if (values.length <= 0 || table.length <= 0)
        return new Error('[SqlInsertOrUpdateAsync] table or values empty.')

    const isExisted = await SqlIsExistedAsync(table, values[0])
    
    let cmd

    if (isExisted) { // to update
        if (values.length <= 1)
            return undefined
        
            cmd =
            `UPDATE ${table} ` +
            `SET ${SqlGenerateColumnEqualValueText(values.slice(1))} ` +
            `WHERE ${SqlGenerateColumnEqualValueText(values.slice(0, 1))};`
    }
    else { // to insert
        cmd =
        `INSERT INTO ${table} ` +
        `${SqlGenerateColumnNamesInBracketText(values)} ` +
        `VALUES` + SqlGenerateValuesInBracketText(values)
    }

    // console.log(cmd);

    const res = await ExecuteSqlAsync(cmd)

    return res instanceof Error ? res : undefined
}

export const ExecuteSqlAsync = async (cmd: string): Promise<SQLResultSet | Error> => {
    if (db === undefined) {
        return new Error('[ExecuteSqlAsync] Not OpenDatabase yet.')
    }

    return new Promise((resolve) => {
        db?.transaction(function (txn) {
            txn.executeSql(
                // cmd

                cmd,
                
                // agrs
                
                undefined, // [],

                // success

                function (_, res) {
                    resolve(res)
                },

                // error

                function (_, err) {
                    resolve(new Error(err.message as string))
                    
                    // SQLStatementErrorCallback returns a boolean value.
                    // - true - ends the execution of the transaction. true is returned if there is no callback function specified as a parameter. Important: When true is returned, the transaction is rolled back.
                    // - false - continues executing the transaction
                    return true
                }
            )
        })
    })
}

// CheckInitDBAsync ----------------------------

// const DBName = 'SeenWordsDB'

// const CreateTableCmd = 'CREATE TABLE IF NOT EXISTS SeenSavedWords(wordAndLang VARCHAR(255) PRIMARY KEY, lastNotiTick INT, savedWordData TEXT)'

// var inited = false

// const CheckInitDBAsync = async () => {
//     if (inited)
//         return

//     if (IsLog)
//         console.log('[CheckInitDBAsync] inited.');

//     inited = true

//     await OpenDatabaseAsync(DBName)
//     await ExecuteSqlAsync(CreateTableCmd)
// }

// DROP TABLE ----------------------------

// let r = await ExecuteSqlAsync('DROP TABLE IF EXISTS Users')

// CREATE TABLE ----------------------------

// r = await ExecuteSqlAsync('CREATE TABLE IF NOT EXISTS Users(user_id INTEGER PRIMARY KEY NOT NULL, name VARCHAR(30))')

// const CreateTableCmd = 'CREATE TABLE IF NOT EXISTS SeenSavedWords(wordAndLang VARCHAR(255) PRIMARY KEY, lastNotiTick INT, savedWordData TEXT)'

// INSERT ----------------------------

// r = await ExecuteSqlAsync(`INSERT INTO Users (name) VALUES ('John')`)

// const cmd = "INSERT OR IGNORE INTO SeenSavedWords" +
// "(wordAndLang, lastNotiTick, savedWordData) VALUES " +
// `('${wordAndLang}', ${word.notiTick}, '${savedWordData}')`

// SELECT ----------------------------

// r = await ExecuteSqlAsync('SELECT * FROM `users`')
// console.log(r.rows)

// AGRS ----------------------------
        
// r = await ExecuteSqlAsync('INSERT INTO Users (name) VALUES (:name)', ['takuya'])