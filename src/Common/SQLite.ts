// https://github.com/craftzdog/react-native-sqlite-2
// https://docs.kony.com/konylibrary/visualizer/viz_api_dev_guide/content/kony.db_functions.htm#SQLStatementErrorCallback

// INSTALL:
// Just: npm i react-native-sqlite-2

import SQLite, { SQLResultSet, WebsqlDatabase } from 'react-native-sqlite-2'

var db: WebsqlDatabase | undefined

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