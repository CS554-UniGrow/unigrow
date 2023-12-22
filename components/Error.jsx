"use client"

import React from "react"
import Link from "next/link"
import { Button } from "./ui/button"

const Error = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1>Error! Something went wrong</h1>
      </div>
      <div>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2>Here are some solutions you can try :</h2>
          <p>Try signing out and signing in again</p>
          <p>Try clearing your browser cache and reload the website</p>
        </div>
        <Button asChild>
          <Link href="/signout">Login Again</Link>
        </Button>
      </div>

      {/* <Link href="/signup">
        <Button>Signup</Button>
      </Link> */}
    </div>
  )
}

export default Error
