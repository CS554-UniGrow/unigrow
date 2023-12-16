import React from "react"
import loadingLogo from "@/public/loading.gif"
import Image from "next/image"

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="flex flex-col items-center space-y-2 rounded-lg bg-white p-4 shadow-lg">
        <Image width={100} height={100} alt="Loading..." src={loadingLogo} />
        <p className="text-gray-800">
          Loading... Please do not refresh or go back
        </p>
      </div>
    </div>
  )
}

export default Loading
