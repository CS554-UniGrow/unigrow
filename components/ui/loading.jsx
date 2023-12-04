import React from "react";
import loadingLogo from "@/public/loading.png";
import Image from "next/image";
const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
      <div className="h-64 w-64 animate-spin rounded-full transition-all duration-1000">
        <Image width={100} height={100} alt="Loading..." src={loadingLogo} />
      </div>
    </div>
  );
};

export default Loading;
