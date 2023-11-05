// You will need to change the DB name to match the required DB name in the assignment specs!
export const mongoConfig = {
  serverUrl:
    process.env.MONGO_CONNECTION_STRING || "mongodb://localhost:27017/",
  database: process.env.MONGO_DB_NAME || "UniGrow"
};
