"use client"
import React, { useEffect, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { useSession } from "next-auth/react"

const Rating = ({ courseId, courseCode }: any) => {
  const { data: session, status, update }: any = useSession()
  const [rating, setRating] = useState([0])
  const [sliderUpdated, setSliderUpdated] = useState(false)
  const user_mongo_id = session?.user._id

  const handleSliderChange = (value: any) => {
    setRating(value) // Use the callback version of setRating
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

    updateRatingInDatabase(user_mongo_id, courseId, rating, courseCode)
    setSliderUpdated(false)
  }, [sliderUpdated, rating])

  useEffect(() => {
    const fetchCurrentReview = async (courseId: string) => {
      try {
        const response = await fetch(`/api/reviews/${courseId}`, {
          method: "GET"
        })

        if (!response.ok) {
          throw new Error("Failed to update rating")
        }

        console.log(response)
      } catch (error) {
        console.error("Error updating rating:", error)
      }
    }
  })
  return (
    <div className="flex justify-center">
      <h2>Leave a course Rating</h2>
      <Slider
        defaultValue={[0]}
        max={5}
        step={0.5}
        onValueChange={handleSliderChange}
      />
      <p>Current Rating: {rating}</p>
    </div>
  )
}

export default Rating
