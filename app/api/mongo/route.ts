import fs from "fs";
import { dbConnection, closeConnection } from "./mongoConnection";
import { courses as courseCollection } from "./mongoCollections";
import { NextRequest, NextResponse } from "next/server";

const rawData = fs.readFileSync("./scripts/course_data_extracted.json", "utf8");
const seedData = JSON.parse(rawData);

async function seed() {
  try {
    const db = await dbConnection();
    console.log("Connected to the database.");

    const courses = await courseCollection();
    await courses.deleteMany({}); // Use deleteMany instead of dropDatabase
    console.log("Collection cleared.");

    await courses.insertMany(seedData);
    return "Data seeded successfully.";
  } catch (error) {
    return "Error seeding data:" + error;
  } finally {
    await closeConnection();
    console.log("Database connection closed.");
  }
}

export async function GET(request: NextRequest, response: NextResponse) {
  // get request parameters from NextRequest
  console.log(request);
  const courses = await seed();
  return NextResponse.json({ message: courses });
}
