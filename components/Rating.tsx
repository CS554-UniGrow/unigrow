// To do, users should only be able to rate courses they have in their list

"use client"
import React, { useEffect, useState } from "react"
import RatingStars from "react-rating-stars-component"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

const Rating = ({ courseId, courseCode }: any) => {
  const { data: session }: any = useSession()
  const [rating, setRating] = useState(0)
  const [sliderUpdated, setSliderUpdated] = useState(false)
  const user_mongo_id = session?.user._id
  const [prevReview, setPrevReview]: any = useState([])
  const [changeRating, setChangeRating]: any = useState(false)

  const handleSliderChange = async (newRating: number) => {
    setRating(newRating)
    setSliderUpdated(true)
    await updateRatingInDatabase(user_mongo_id, courseId, newRating, courseCode)
    setChangeRating(false)
  }

  const handleUpdateSlider = async (newRating: number) => {
    setRating(newRating)
    setSliderUpdated(true)
    await UpdateReview(user_mongo_id, courseId, newRating)
    setSliderUpdated(false)
  }

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

  const UpdateReview = async (
    userId: string,
    courseId: string,
    newRating: number
  ) => {
    try {
      const object_data = {
        userId: userId,
        courseId: courseId,
        rating: newRating
      }

      const response = await fetch(`/api/reviews/${courseId}`, {
        method: "PATCH",
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

  const handleChangeRating = () => {
    if (changeRating === true) {
      setChangeRating(false)
    } else {
      setChangeRating(true)
    }
  }

  // useEffect(() => {
  //   const updateRatingInDatabase = async (
  //     userId: string,
  //     courseId: string,
  //     newRating: number,
  //     courseCode: string
  //   ) => {
  //     try {
  //       const object_data = {
  //         userId: userId,
  //         courseId: courseId,
  //         rating: newRating,
  //         courseCode: courseCode
  //       }

  //       const response = await fetch(`/api/reviews`, {
  //         method: "POST",
  //         body: JSON.stringify(object_data)
  //       })

  //       if (!response.ok) {
  //         throw new Error("Failed to update rating")
  //       }

  //       console.log(response)
  //     } catch (error) {
  //       console.error("Error updating rating:", error)
  //     }
  //   }

  //   // Only update the rating in the database if the slider has been updated
  //   if (sliderUpdated) {
  //     updateRatingInDatabase(user_mongo_id, courseId, rating, courseCode)
  //     setSliderUpdated(false)
  //   }
  // }, [sliderUpdated, rating, user_mongo_id, courseId, courseCode])

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
  }, [courseId, sliderUpdated])

  return (
    <div className="col-1 text-center">
      {prevReview.length > 0 ? (
        <>
          <Button className="mx-36 mt-5" onClick={handleChangeRating}>
            Change Rating
          </Button>
          <p className="mx-10 my-3 font-bold">
            Current Rating given: {prevReview[0]?.rating}
          </p>
          {changeRating && (
            <div className="">
              <h2 className="my-2">Change Course Rating</h2>
              <RatingStars
                value={0}
                count={5}
                onChange={handleUpdateSlider}
                size={30}
                activeColor="#ffd700"
              />
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="mx-10 my-3 font-bold">Leave a course Rating</h2>
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
