import Dashboard from "@/app/dashboard/page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
    <main className="flex">
      <h1>
        This is the landing page. Will think a way to remove navbar from this
        component.
      </h1>
      <Link href="/signup">
        <Button>Signup</Button>
      </Link>
    </main>
  );
}
