import { MongoClient, Db } from "mongodb";
import { mongoConfig } from "./settings.js";

let _connection;
let _db;

const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
  }

  if (!_db) {
    throw new Error("Database connection not established.");
  }

  return _db;
};

const closeConnection = async () => {
  if (_connection) {
    await _connection.close();
  }
};

export { dbConnection, closeConnection };
