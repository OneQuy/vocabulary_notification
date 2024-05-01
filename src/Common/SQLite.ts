// https://github.com/craftzdog/react-native-sqlite-2
// https://docs.kony.com/konylibrary/visualizer/viz_api_dev_guide/content/kony.db_functions.htm#SQLStatementErrorCallback

// INSTALL:
// Just: npm i react-native-sqlite-2

import SQLite, { SQLResultSet, WebsqlDatabase } from 'react-native-sqlite-2'
import { ToCanPrint } from './UtilsTS'

export type SqlColumnAndValue = {
    column: string,
    value: any,
}

var db: WebsqlDatabase | undefined

/**
 * @returns (col1, col2, col3)
 */
const GenerateColumnNamesInBracketText = (values: SqlColumnAndValue[]) => {
    return `(${values.map(val => val.column).join(',')})`
}

/**
 * ### note:
 * undefined will be treated as null.
 */
const ConvertValueToSqlType = (val: any) : string => {
    const typee = typeof val

    if (typee === 'number')
        return val.toString()
    // else if (typee === 'undefined')
    //     return 'undefined'
    else if (typee === 'undefined' || val === null)
        return 'null'
    else if (typee === 'object')
        return `'${JSON.stringify(val)}'`
    else
        return `'${val}'`
}

const SQLResultSetToObjects = <T extends object>(result: SQLResultSet) : T[] => {
    const arr: T[] = []
    
    for (let i = 0; i < result.rows.length; i++) {
        arr.push(result.rows.item(i) as T)
    }

    return arr
}

const ConvertObjectToSqlColumnAndValueArr = (obj: object, emptyStringTreatedAsNull = true) : SqlColumnAndValue[] => {
    const entries = Object.entries(obj)

    return entries.map(entry => {
        const value = (emptyStringTreatedAsNull && entry[1] === '') ? null : entry[1]

        const res: SqlColumnAndValue = {
            column: entry[0],
            value
        }

        return res
    })
}

const GenerateValuesInBracketTextFromValues = (values: any[]) => {
    return `(${values.map(val => {
        return ConvertValueToSqlType(val)
    }).join(',')})`
}

/**
 * @returns ('hello', 5, 'lottie')
 */
const GenerateValuesInBracketText = (values: SqlColumnAndValue[]) => {
    return GenerateValuesInBracketTextFromValues(values.map(i => i.value))
}

/**
 * @returns ContactName = 'Alfred Schmidt', City= 'Frankfurt'
 */
const GenerateColumnEqualValueText = (values: SqlColumnAndValue[]) => {
    return `${values.map(val => {
        return `${val.column}=${ConvertValueToSqlType(val.value)}`
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
    const getRowCmd = `SELECT 1 FROM ${table} WHERE ${GenerateColumnEqualValueText([value])};`
    const res = await SqlExecuteAsync(getRowCmd)

    if (res instanceof Error)
        return false
    else
        return res.length > 0
}

export const SqlLogAllRowsAsync = async (table: string): Promise<void> => {
    const allRows = await SqlGetAllRowsAsync(table)

    if (allRows instanceof Error) {
        console.log('[SqlLogAllRowsAsync] ' + allRows)
        return
    }
    
    console.log('[SqlLogAllRowsAsync] -----------------------------')
    
    if (allRows.length <= 0) {
        console.log('[SqlLogAllRowsAsync] table is empty.')
    }
    else {
        for (let i = 0; i < allRows.length; i++)
            console.log(ToCanPrint(allRows[i]))
    }

    console.log('--------------------------------------------------')
}

export const SqlDropTableAsync = async (table: string): Promise<void> => {
    await SqlExecuteAsync(`DROP TABLE IF EXISTS ${table}`)
}

/**
 * ### note:
 * undefinded can be treated as null
 */
export const SqlGetAllRowsWithColumnIncludedInArrayAsync = async <T extends object>(table: string, columnName: string, array: any[]): Promise<T[] | Error> => {
    const cmd = 
        `SELECT * ` +
        `FROM ${table} ` +
        `WHERE ${columnName} IN ${GenerateValuesInBracketTextFromValues(array)};`

    // console.log(cmd);
        
    return await SqlExecuteAsync<T>(cmd)
}

/**
 * ### note:
 * undefinded can be treated as null
 * 
 * @param numRows (<= 0 for get all rows.)
 */
export const SqlGetAllRowsAsync = async <T extends object>(table: string, numRows = -1): Promise<T[] | Error> => {
    const cmd = `SELECT ${numRows <= 0 ? '*' : numRows} FROM ${table}`
    return await SqlExecuteAsync<T>(cmd)
}

/**
 * 
 * @returns success: undefined
 */
export const SqlInsertOrUpdateAsync_Object = async (table: string, obj: object, emptyStringTreatedAsNull = true): Promise<undefined | Error> => { // sub 
    return await SqlInsertOrUpdateAsync(
        table, 
        ConvertObjectToSqlColumnAndValueArr(obj, emptyStringTreatedAsNull)
    )
}

/**
 * 
 * @returns success: undefined
 */
export const SqlInsertOrUpdateAsync = async (table: string, values: SqlColumnAndValue[]): Promise<undefined | Error> => { // main
    if (values.length <= 0 || table.length <= 0)
        return new Error('[SqlInsertOrUpdateAsync] table or values empty.')

    const isExisted = await SqlIsExistedAsync(table, values[0])
    
    let cmd

    if (isExisted) { // to update
        if (values.length <= 1)
            return undefined
        
            cmd =
            `UPDATE ${table} ` +
            `SET ${GenerateColumnEqualValueText(values.slice(1))} ` +
            `WHERE ${GenerateColumnEqualValueText(values.slice(0, 1))};`
    }
    else { // to insert
        cmd =
        `INSERT INTO ${table} ` +
        `${GenerateColumnNamesInBracketText(values)} ` +
        `VALUES` + GenerateValuesInBracketText(values)
    }

    // console.log(cmd);

    const res = await SqlExecuteAsync(cmd)

    return res instanceof Error ? res : undefined
}

/**
 * ### note:
 * undefinded can be treated as null
 */
export const SqlExecuteAsync = async <T extends object>(cmd: string): Promise<T[] | Error> => {
    if (db === undefined) {
        return new Error('[ExecuteSqlAsync] Not OpenDatabase yet.')
    }

    return new Promise((resolve: (res: T[] | Error) => void) => {
        db?.transaction(function (txn) {
            txn.executeSql(
                // cmd

                cmd,
                
                // agrs
                
                undefined, // [],

                // success

                function (_, res) {
                    resolve(SQLResultSetToObjects<T>(res))
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

// CREATE TABLE ----------------------------

// r = await ExecuteSqlAsync('CREATE TABLE IF NOT EXISTS Users(user_id INTEGER PRIMARY KEY NOT NULL, name VARCHAR(30))')

// const CreateTableCmd = 'CREATE TABLE IF NOT EXISTS SeenSavedWords(wordAndLang VARCHAR(255) PRIMARY KEY, lastNotiTick INT, savedWordData TEXT)'

// AGRS ----------------------------
        
// r = await ExecuteSqlAsync('INSERT INTO Users (name) VALUES (:name)', ['takuya'])