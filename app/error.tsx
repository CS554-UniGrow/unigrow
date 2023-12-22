"use client"
import Error from "@/components/Error"
import React from "react"

const error = ({ error }: any) => {
  console.log({ error })
  return <Error error={error} />
}

export default error
