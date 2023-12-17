import logger from "@/lib/logger"
import fs from "fs"
import { dbConnection, closeConnection } from "@/config/mongo/mongoConnection"
import {
  courses as courseCollection,
  users as userCollection
} from "@/config/mongo/mongoCollections"
import { NextRequest, NextResponse } from "next/server"

async function seed() {
  try {
    const filePath = "./lib/course_data_extracted.json" // Adjust the path based on your project structure
    const rawData = await fs.readFileSync(filePath, "utf8")
    const seedData = JSON.parse(rawData)
    const db = await dbConnection()
    logger.info("Connected to the database.")

    const courses = await courseCollection()
    const users = await userCollection()

    await courses.deleteMany({})
    await users.deleteMany({})
    logger.info("Collections cleared.")

    await courses.insertMany(seedData)

    return "Data seeded successfully."
  } catch (error: any) {
    const message = `Error seeding data: ${error.message}`
    logger.error(message)
    throw new Error(message) // Rethrow the error to be caught by the caller
  }
  // finally {
  //   await closeConnection()
  //   logger.info("Database connection closed.")
  // }
}

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const apiKey = request.headers.get("Authorization")
    logger.info(apiKey)
    logger.info(`Bearer ${process.env.NEXT_API_SEED_SECRET}`)

    if (apiKey === `Bearer ${process.env.NEXT_API_SEED_SECRET}`) {
      logger.info("Seeding data...")
      const message = await seed()
      logger.info(message)
      return NextResponse.json({ message, completed: true }, { status: 200 })
    } else {
      return NextResponse.json(
        { message: "Invalid API key", completed: true },
        { status: 403 }
      )
    }
  } catch (error: any) {
    const message = `Error handling request: ${error.message}`
    logger.error(message)
    return NextResponse.json({ message, completed: true }, { status: 500 })
  }
}
