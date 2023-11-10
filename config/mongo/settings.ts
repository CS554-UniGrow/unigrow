// You will need to change the DB name to match the required DB name in the assignment specs!
export const mongoConfig = {
  serverUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/",
  database: process.env.MONGO_DB_NAME || "UniGrow"
};
