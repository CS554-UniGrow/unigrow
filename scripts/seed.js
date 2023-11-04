import {
  dbConnection,
  closeConnection
} from "../app/api/mongo/mongoConnection.js";
import { courses as courseColleciton } from "../app/api/mongo//mongoCollections.js";

const seedData = [
  {
    course_title: "AAI 551 Engineering Programming: Python",
    course_description:
      "This course presents tool, techniques, algorithms, and programming techniques using the Python programming language for data intensive applications and decision making. The course formally introduces techniques to: (i) gather,(ii) store, and (iii) process large volumes of data to make informed decisions. Such techniques find applicability in many engineering application areas, including communications systems, embedded systems, smart grids, robotics, Internet, and enterprise networks, or any network where information flows and alters decision making.",
    course_credits: "3",
    course_prereqs: [],
    course_offered_in: [],
    course_code: "AAI 551",
    course_level: "500",
    course_rating: null,
    course_professors: [],
    course_syllabus: "",
    currently_enrolled: [],
    previous_enrolled: [],
    stevens_course_link:
      "https://stevens.smartcatalogiq.com/en/2023-2024/Academic-Catalog/Courses/AAI-Applied-Artificial-Intelligence/500/AAI-551"
  }
  // Add more data as needed
];

export async function seed() {
  const db = await dbConnection(); // Connect to the database

  try {
    await db.dropDatabase();
    const courses = await courseColleciton();
    await courses.insertMany(seedData); // Insert data into the database using your model
    console.log("Data seeded successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await closeConnection();
  }
}
