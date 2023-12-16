import { FC } from "react";
import Skeleton from "react-loading-skeleton";

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
    <div className="flex h-full flex-col items-center">
      <Skeleton className="mb-4" height={40} width={400} />
      {/* chat messages */}
      <div className="max-h-full w-full flex-1 overflow-y-scroll">
        <div className="flex h-full flex-auto flex-col p-6">
          <div className="flex h-full flex-auto flex-shrink-0 flex-col rounded-2xl bg-gray-50 p-4">
            <div className="mb-4 flex h-full flex-col overflow-x-auto">
              <div className="flex h-full flex-col">
                <div className="grid grid-cols-12 gap-y-2">
                  <div className="col-start-6 col-end-13 rounded-lg p-3">
                    <div className="flex flex-row-reverse items-center justify-start">
                      <div className="relative h-10 w-10">
                        <Skeleton width={40} height={40} borderRadius={999} />
                      </div>
                      <div className="relative mr-3 rounded-xl border border-gray-100 bg-indigo-100 px-4 py-2 text-sm text-black">
                        <Skeleton className="ml-2" width={150} height={20} />
                      </div>
                    </div>
                  </div>
                  <div className="col-start-6 col-end-13 rounded-lg p-3">
                    <div className="flex flex-row-reverse items-center justify-start">
                      <div className="relative h-10 w-10">
                        <Skeleton width={40} height={40} borderRadius={999} />
                      </div>
                      <div className="relative mr-3 rounded-xl border border-gray-100 bg-indigo-100 px-4 py-2 text-sm text-black">
                        <Skeleton className="ml-2" width={150} height={20} />
                      </div>
                    </div>
                  </div>

                  {/* my messages */}
                  <div className="col-start-1 col-end-8 rounded-lg p-3">
                    <div className="flex flex-row items-center">
                      <div className="relative h-10 w-10">
                        <Skeleton width={40} height={40} borderRadius={999} />
                      </div>
                      <div className="relative ml-3 rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm">
                        <Skeleton className="ml-2" width={150} height={20} />
                      </div>
                    </div>
                  </div>
                  <div className="col-start-6 col-end-13 rounded-lg p-3">
                    <div className="flex flex-row-reverse items-center justify-start">
                      <div className="relative h-10 w-10">
                        <Skeleton width={40} height={40} borderRadius={999} />
                      </div>
                      <div className="relative mr-3 rounded-xl border border-gray-100 bg-indigo-100 px-4 py-2 text-sm text-black">
                        <Skeleton className="ml-2" width={150} height={20} />
                      </div>
                    </div>
                  </div>
                  <div className="col-start-1 col-end-8 rounded-lg p-3">
                    <div className="flex flex-row items-center">
                      <div className="relative h-10 w-10">
                        <Skeleton width={40} height={40} borderRadius={999} />
                      </div>
                      <div className="relative ml-3 rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm">
                        <Skeleton className="ml-2" width={150} height={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* chat input */}

      {/* <ChatInput
        chatPartner={chatPartner}
        img={session.user.image}
        chatId={chatId}
      /> */}
    </div>
  );
};

export default loading;
