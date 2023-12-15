import Questionnaire from "@/components/Questionnaire";
import { getSessionServer } from "@/lib/hooks";

async function Onboarding() {
  const session = await getSessionServer("/onboarding");

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl">Hey! {session?.user?.name}</h1>
        <h2 className="my-10">
          Get started on our platform by answering a few simple questions
        </h2>
      </div>
      <Questionnaire />
    </>
  );
}

export default Onboarding;
