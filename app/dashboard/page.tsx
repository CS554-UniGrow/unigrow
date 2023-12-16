export async function generateMetadata({ params }: any) {
  return { title: `Unigrow | Dashboard` }
}

import { getSessionServer } from "@/lib/hooks"

const Dashboard = async () => {
  const session = await getSessionServer("/dashboard")
  return <div className="text-6xl">Welcome to UniGrow!</div>
}

export default Dashboard
