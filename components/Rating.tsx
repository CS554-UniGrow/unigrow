import React, { useEffect, useState } from "react"
import RatingStars from "react-rating-stars-component"
import { useSession } from "next-auth/react"

const Rating = ({ courseId, courseCode }: any) => {
  const { data: session }: any = useSession()
  const [rating, setRating] = useState(0)
  const [sliderUpdated, setSliderUpdated] = useState(false)
  const user_mongo_id = session?.user._id
  const [prevReview, setPrevReview]: any = useState([])

  const handleSliderChange = (newRating: number) => {
    setRating(newRating)
    setSliderUpdated(true)
  }

  useEffect(() => {
    const updateRatingInDatabase = async (
      userId: string,
      courseId: string,
      newRating: number,
      courseCode: string
    ) => {
      try {
        const object_data = {
          userId: userId,
          courseId: courseId,
          rating: newRating,
          courseCode: courseCode
        }

        const response = await fetch(`/api/reviews`, {
          method: "POST",
          body: JSON.stringify(object_data)
        })

        if (!response.ok) {
          throw new Error("Failed to update rating")
        }

        console.log(response)
      } catch (error) {
        console.error("Error updating rating:", error)
      }
    }

    // Only update the rating in the database if the slider has been updated
    if (sliderUpdated) {
      updateRatingInDatabase(user_mongo_id, courseId, rating, courseCode)
      setSliderUpdated(false)
    }
  }, [sliderUpdated, rating, user_mongo_id, courseId, courseCode])

  useEffect(() => {
    const fetchCurrentReview = async (courseId: string) => {
      try {
        const response = await fetch(`/api/reviews/${courseId}`, {
          method: "GET"
        })

        if (!response.ok) {
          throw new Error("Failed to fetch current review")
        }

        const data = await response.json()
        setPrevReview(data)
      } catch (error) {
        console.error("Error fetching current review:", error)
      }
    }

    fetchCurrentReview(courseId)
  }, [courseId])

  return (
    <div className="flex justify-center">
      <h2>Leave a course Rating</h2>
      {prevReview ? (
        <>
          <RatingStars
            value={prevReview[0]?.rating}
            count={5}
            onChange={handleSliderChange}
            size={30}
            activeColor="#ffd700"
          />
          <p>Current Rating: {rating}</p>
        </>
      ) : (
        <>
          <RatingStars
            value={0}
            count={5}
            onChange={handleSliderChange}
            size={30}
            activeColor="#ffd700"
          />
          <p>Current Rating: {rating}</p>
        </>
      )}
    </div>
  )
}

export default Rating
