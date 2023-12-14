import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await getServerSession(options);
  if (!session) {
    redirect("/signup");
  }

  return <div className="text-6xl">Welcome to UniGrow!</div>;
};

export default Dashboard;
