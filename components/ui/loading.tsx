import React from "react"
import loading from "@/public/loading.gif"
import loadingOldLogo from "@/public/loading_old.gif"
import loadingNewLogo from "@/public/loading_new.gif"
import loadingTransLogo from "@/public/loading_trans.gif"
import RoundImage from "@/components/ui/round_image"

const Loading = () => {
  const imageSources = [
    loading.src,
    loadingOldLogo.src,
    loadingNewLogo.src,
    loadingTransLogo.src
  ]

  const randomIndex = Math.floor(Math.random() * imageSources.length)
  const randomSrc = imageSources[randomIndex]

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <RoundImage
        width={200}
        height={200}
        alt="Loading..."
        src={randomSrc}
        bg="bg-white"
      />
    </div>
  )
}

export default Loading
