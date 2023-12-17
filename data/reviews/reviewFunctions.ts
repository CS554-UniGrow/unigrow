import {
  users as usersCollection,
  courses as courseCollection
} from "@/config/mongo/mongoCollections"
import { ObjectId } from "mongodb"
import { v4 as uuidv4 } from "uuid"

async function findReviewByUIDAndCourseID(userId: string, courseId: string) {
  // Access the restaurants collection
  const courses = await courseCollection()

  // Use aggregation to find relevant reviews
  const reviews = await courses
    .aggregate([
      { $match: { _id: courseId } },
      { $unwind: "$course_rating" },
      {
        $match: {
          "course_rating.userId": userId
        }
      },
      { $project: { review: "$reviews" } }
    ])
    .toArray()

  // Return the matching review(s)
  return reviews
}
async function updateOverallRating(courseId: string) {
  // calculate overallRating and updating overallRating key
  const courses = await courseCollection()
  const result = await courses
    .aggregate([
      { $match: { _id: courseId } },
      {
        $addFields: {
          averageRating: {
            $avg: "$course_ratings.rating"
          }
        }
      },
      {
        $set: {
          course_rating: { $ifNull: ["$averageRating", 0] }
        }
      },
      { $project: { reviews: 0 } } // optional: exclude reviews from response
    ])
    .toArray()

  if (result.length > 0) {
    // Get the updated document
    const updatedDocument = result[0]
    console.log(result)
    // Update the document in the collection
    await courses.updateOne(
      { _id: courseId },
      { $set: { course_rating: updatedDocument.course_rating } }
    )
  }

  if (result.length > 0) {
    // Get the updated document
    const updatedDocument = result[0]

    // Update the document in the collection
    await courses.updateOne(
      { _id: courseId },
      { $set: { overallCourseRating: updatedDocument.overallCourseRating } }
    )
  }
}
const createReview = async (
  courseId: string,
  userId: string,
  rating: number,
  courseCode: string
) => {
  const user_data = await usersCollection()
  const course_data = await courseCollection()

  const existingReview = await course_data.findOne(
    { _id: courseId, "course_ratings.user_id": userId },
    { projection: { _id: 1 } }
  )

  if (existingReview) {
    throw new Error("User has already given a review for this course")
  }

  const user_courses = await user_data.findOne(
    { _id: userId },
    { projection: { _id: 1, courses: 1 } }
  )

  const course_taken = user_courses.courses.filter(
    (req: any) => req === courseCode
  )

  if (course_taken.length === 0) {
    throw new Error(
      "User has not taken this course and is not allowed to review"
    )
  }

  const uniqueId = uuidv4()
  const newReview = {
    _id: uniqueId,
    user_id: userId,
    reviewDate: new Date(),
    rating: rating
  }

  const updatedInfo = await course_data.findOneAndUpdate(
    { _id: courseId },
    { $push: { course_ratings: newReview } },
    { returnDocument: "after" } // Return the updated document
  )

  if (!updatedInfo.value) {
    throw new Error("Could not add review")
  }

  return newReview
}

// const getAllReviews = async (restaurantId) => {
//   // check restaurantId
//   helpers.validObjectId(restaurantId)

//   const restaurantsCollection = await restaurants()
//   let restaurant = await restaurantsCollection.findOne({
//     _id: new ObjectId(restaurantId)
//   })
//   if (restaurant == null) throw "No restaurant with the given Id"
//   const reviews = restaurant?.reviews
//   if (reviews) {
//     for (let i of reviews) {
//       i._id = i._id.toString()
//     }
//   }
//   return reviews
// }

// const deleteReview = async (restaurantId, userId) => {
//   const restaurantsCollection = await restaurants()

//   // Update the restaurant document to remove the review
//   const updateResult = await restaurantsCollection.updateOne(
//     { _id: new ObjectId(restaurantId) },
//     { $pull: { reviews: { userId: userId } } }
//   )

//   if (updateResult.modifiedCount === 0) {
//     throw `Error: You have not given any review to this restuarant`
//   }

//   // update the overallRating after deletion
//   updateOverallRating(restaurantId)

//   return { message: "review succesfully deleted" }
// }

const updateReview = async (
  courseId: string,
  userId: string,
  newRating: number
) => {
  const course_data = await courseCollection()

  const existingReview = await course_data.findOne(
    { _id: courseId, "course_ratings.user_id": userId },
    { projection: { _id: 1 } }
  )

  if (!existingReview) {
    throw new Error("Review not found")
  }

  const updatedInfo = await course_data.findOneAndUpdate(
    { _id: courseId, "course_ratings.user_id": userId },
    {
      $set: {
        "course_ratings.$.rating": newRating,
        "course_ratings.$.reviewDate": new Date()
      }
    },
    { returnDocument: "after" } // Return the updated document
  )

  if (!updatedInfo.value) {
    throw new Error("Could not update review")
  }

  return updatedInfo.value.course_ratings.find(
    (review: any) => review.user_id === userId
  )
}

export { createReview, updateReview, findReviewByUIDAndCourseID }
