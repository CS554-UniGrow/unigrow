import React from "react"
import loadingLogo from "@/public/loading.png"
import Image from "next/image"
const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
      <div className="flex items-center space-x-1 rounded-lg bg-gray-700 p-4 shadow-lg">
        <Image
          className="animate-spin"
          width={100}
          height={100}
          alt="Loading..."
          src={loadingLogo}
        />
        <p className="text-white">
          Loading... Please do not refresh or go back
        </p>
      </div>
    </div>
  )
}

export default Loading
