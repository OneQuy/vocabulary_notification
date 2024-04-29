// https://github.com/craftzdog/react-native-sqlite-2
// https://docs.kony.com/konylibrary/visualizer/viz_api_dev_guide/content/kony.db_functions.htm#SQLStatementErrorCallback

// INSTALL:
// Just: npm i react-native-sqlite-2

import SQLite, { SQLResultSet, WebsqlDatabase } from 'react-native-sqlite-2'

var db: WebsqlDatabase | undefined

export const OpenDatabase = (dbName: string) => {
    db = SQLite.openDatabase(dbName)
}

export const ExecuteSqlAsync = async (cmd: string): Promise<SQLResultSet | Error> => {
    if (db === undefined) {
        return new Error('[ExecuteSqlAsync] Not OpenDatabase yet.')
    }

    return new Promise((resolve) => {
        // @ts-ignore
        db.transaction(function (txn) {
            // txn.executeSql('DROP TABLE IF EXISTS Users', [])
            // txn.executeSql(
            //     'CREATE TABLE IF NOT EXISTS Users(user_id INTEGER PRIMARY KEY NOT NULL, name VARCHAR(30))',
            //     []
            // )
            // txn.executeSql('INSERT INTO Users (name) VALUES (:name)', ['nora'])
            // txn.executeSql('INSERT INTO Users (name) VALUES (:name)', ['takuya'])

            // txn.executeSql('SELECT * FROM `users`', [], function (tx, res) {
            //     for (let i = 0; i < res.rows.length; ++i) {
            //         console.log('item:', res.rows.item(i))
            //     }
            // })

            txn.executeSql(
                cmd,
                [],
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