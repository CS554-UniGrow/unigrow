import React from "react";
import loadingLogo from "@/public/loading.png";
import Image from "next/image";
const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
      <div className="flex items-center space-x-1">
        <Image
          className=" animate-spin"
          width={100}
          height={100}
          alt="Loading..."
          src={loadingLogo}
        />
      </div>
    </div>
  );
};

export default Loading;
