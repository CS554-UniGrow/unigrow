import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";

import Loading from "@/components/ui/loading";
import Questionnaire from "@/components/Questionnaire";
import { redirect } from "next/navigation";

async function Questions() {
  const session = await getServerSession(options);

  if (session?.user?.isAuthenticated && session?.user?.isOnboarded) {
    redirect("/dashboard");
  } else if (!session?.user?.isAuthenticated) {
    redirect("/signup");
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl">Hey! {session?.user?.name}</h1>
        <h2 className="my-10">
          Get started on our platform by answering a few simple questions
        </h2>
        {/* TODO add spinner to disable form when handle submit is running] */}
      </div>
      <Questionnaire />
    </>
  );
}

export default Questions;
