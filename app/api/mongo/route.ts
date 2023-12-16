import logger from "@/lib/logger"
import fs from "fs"
import { dbConnection, closeConnection } from "@/config/mongo/mongoConnection"
import { courses as courseCollection } from "@/config/mongo/mongoCollections"
import { users as userCollection } from "@/config/mongo/mongoCollections"
import { NextRequest, NextResponse } from "next/server"
const rawData = fs.readFileSync("./scripts/course_data_extracted.json", "utf8")
const seedData = JSON.parse(rawData)

async function seed() {
  try {
    const db = await dbConnection()
    logger.info("Connected to the database.")

    const courses = await courseCollection()
    const users = await userCollection()
    await courses.deleteMany({}) // Use deleteMany instead of dropDatabase
    await users.deleteMany({})
    logger.info("Collection cleared.")
    await courses.insertMany(seedData)
    return "Data seeded successfully."
  } catch (error) {
    let message = "Error seeding data:" + error
    logger.error(message)
    return message
  }
  // finally {
  //   await closeConnection();
  //   logger.info("Database connection closed.");
  // }
}

export async function POST(request: NextRequest, response: NextResponse) {
  const apiKey = request.headers.get("x-api-key")
  if (apiKey == process.env.NEXT_API_SEED_SECRET) {
    logger.info("Seeding data...")
    const message = await seed()
    logger.info(message)
    return NextResponse.json({ message: message })
  } else {
    return NextResponse.json({ message: "Invalid API key" })
  }
}
