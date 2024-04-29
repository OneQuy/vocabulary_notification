// https://github.com/craftzdog/react-native-sqlite-2
// https://docs.kony.com/konylibrary/visualizer/viz_api_dev_guide/content/kony.db_functions.htm#SQLStatementErrorCallback

// INSTALL:
// Just: npm i react-native-sqlite-2

import SQLite, { SQLResultSet, WebsqlDatabase } from 'react-native-sqlite-2'

var db: WebsqlDatabase | undefined

export const OpenDatabaseAsync = (dbName: string): Promise<void> => {
    return new Promise((resolve: () => void) => {
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
                cmd,
                undefined, // [],
                function (_, res) {
                    resolve(res)
                },

                // SQLStatementErrorCallback returns a boolean value.

                // - true - ends the execution of the transaction. true is returned if there is no callback function specified as a parameter. Important: When true is returned, the transaction is rolled back.
                // - false - continues executing the transaction
                function (_, err) {
                    resolve(new Error(err.message as string))
                    return true
                }
            )
        })
    })
}

// let r = await ExecuteSqlAsync('DROP TABLE IF EXISTS Users')

// r = await ExecuteSqlAsync('CREATE TABLE IF NOT EXISTS Users(user_id INTEGER PRIMARY KEY NOT NULL, name VARCHAR(30))')

// r = await ExecuteSqlAsync(`INSERT INTO Users (name) VALUES ('John')`)

// r = await ExecuteSqlAsync('SELECT * FROM `users`')
// console.log(r.rows)

// ------------

// txn.executeSql('SELECT * FROM `users`', [], function (tx, res) {
    //     for (let i = 0; i < res.rows.length; ++i) {
        //         console.log('item:', res.rows.item(i))
        //     }
        // })
        
// r = await ExecuteSqlAsync('INSERT INTO Users (name) VALUES (:name)', ['takuya'])