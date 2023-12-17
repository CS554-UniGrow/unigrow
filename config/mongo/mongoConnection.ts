import { MongoClient, Db } from "mongodb"
import { mongoConfig } from "./settings"

let _connection: MongoClient | undefined
let _db: Db | undefined

const dbConnection = async (): Promise<Db> => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl)
    _db = _connection.db(mongoConfig.database)
  }

  if (!_db) {
    throw new Error("Database connection not established.")
  }

  return _db
}

const closeConnection = async () => {
  if (_connection) {
    await _connection.close()
  }
}

export { dbConnection, closeConnection }
