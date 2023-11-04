import {
  dbConnection,
  closeConnection
} from "../app/api/mongo/mongoConnection.js";
import { courses as courseColleciton } from "../app/api/mongo/mongoCollections.js";

// good to know !
const rawData = fs.readFileSync("./scripts/course_data_extracted.json");
const seedData = JSON.parse(rawData);

export async function seed() {
  try {
    const db = await dbConnection();
    console.log("Connected to the database.");

    await db.dropDatabase();
    console.log("Database cleared.");

    const courses = await courseColleciton();
    await courses.insertMany(seedData);
    console.log("Data seeded successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await closeConnection();
    console.log("Database connection closed.");
  }
}
