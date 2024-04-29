/*
DOC: https://watermelondb.dev/docs/Installation

INSTALL:

npm install @nozbe/watermelondb

npm install -D @babel/plugin-proposal-decorators

add this line to babel.config.js:
  "plugins": [["@babel/plugin-proposal-decorators", { "legacy": true }]]

add this line to ios/Podfile:
pod 'simdjson', path: '../node_modules/@nozbe/simdjson', modular_headers: true
*/

import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import schema, { ModelArr } from './WatermelonDB_ Schema'
import migrations from './WatermelonDB_SchemaMigrations'

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  
  // (You might want to comment it out for development purposes -- see Migrations documentation)
  migrations,
  
  // (optional database name or file system path)
  // dbName: 'myapp',
  
  // (recommended option, should work flawlessly out of the box on iOS. On Android,
  // additional installation steps have to be taken - disable if you run into issues...)
  jsi: true, /* Platform.OS === 'ios' */
  
  // (optional, but you should implement this method)
  onSetUpError: error => {
    console.error('Database failed to load -- Please reload the app or log out: ' + error)
  }
})

// Then, make a Watermelon database from it!
const database = new Database({
  adapter,
  modelClasses: ModelArr,
})