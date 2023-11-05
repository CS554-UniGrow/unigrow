import fs from "fs";
import { dbConnection, closeConnection } from "../../../config/mongo/mongoConnection";
import { courses as courseCollection } from "../../../config/mongo/mongoCollections";
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

export async function POST(request: NextRequest, response: NextResponse) {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey == process.env.NEXT_API_SEED_SECRET) {
    const courses = await seed();
    console.log("Seeding data...");
    return NextResponse.json({ message: courses });
  } else {
    return NextResponse.json({ message: "Invalid API key" });
  }
}
