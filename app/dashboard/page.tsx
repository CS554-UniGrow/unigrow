"use client"
import { getSessionServer } from "@/lib/hooks";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import loadingLogo from "@/public/loading.png";
import { useEffect, useState } from "react";
import Loading from "@/components/ui/loading";
import { departmentMapper } from "@/lib/constants";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@radix-ui/react-navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

function useFetchPerson(user_id: string) {
  const [data, setData] = useState({} as any);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetch(`/api/people/${user_id}`)
        .then((res) => res.json())
        .then((data: any) => {
          setData(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    };
    fetchData();
  }, [user_id]);

  return { data, error, loading };
}

const Dashboard = () => {
  

  const { data: session, status }: any = useSession();
  const user= session.user;
  console.log(user._id)
 
  const user_id= user._id 
  const { data, error, loading } = useFetchPerson(user_id as string);
  // const session = await getSessionServer("/dashboard");
  console.log(data)


  if (error) {
    return <div>Error</div>;
  }
  if (loading) {
    return <Loading />;
  }
  return (
  <div>
  <div className="text-6xl">Welcome to UniGrow, {user.name} 
  </div>
  <p className="text-center text-sm font-medium ">
  {departmentMapper[data?.major]}
  </p>
  <div>
    <p>Your Courses:</p>
    <NavigationMenu>
      <NavigationMenuList className="grid grid-cols-5 gap-5">
          {data?.courses?.map((course: string) => (
            <NavigationMenuItem key={course}>
              <Link legacyBehavior passHref href={`/course/${course}`}>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} rounded border`}
                >
                  {course}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
  </div>

  {/* Write code for "Discover people in your major" */}
  
  </div>
  );
};
export default Dashboard;
