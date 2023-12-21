import React from "react"
import Image from "next/image" // Make sure to import the Image component from Next.js

interface RoundImageProps {
  src: string
  width: number
  height: number
  alt: string
  bg?: string
}

const RoundImage: React.FC<RoundImageProps> = ({
  src,
  width,
  height,
  alt,
  bg = ""
}) => {
  return (
    <div className={"inline-block overflow-hidden rounded-full " + bg}>
      <Image
        src={src}
        unoptimized={true}
        width={width}
        height={height}
        className={
          "block justify-self-center rounded-full " +
          "h-" +
          height +
          " " +
          "w-" +
          width
        }
        alt={alt}
      />
    </div>
  )
}

export default RoundImage
