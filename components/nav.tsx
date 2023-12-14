"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  useContext,
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef
} from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

import ProfileDropdown from "@/components/profileDropdown";
import Image from "next/image";

const navLinks = [
  { title: "Dashboard", path: "/dashboard", checkAuth: true },
  { title: "Courses", path: "/courses", checkAuth: true },
  { title: "People", path: "/people", checkAuth: true },
  { title: "Resources", path: "/resources", checkAuth: false },
  { title: "About Us", path: "/aboutus", checkAuth: false },
  { title: "FAQs", path: "/faq", checkAuth: false }
];

import { useSession } from "next-auth/react";

export default function Nav() {
  const { data: session }: any = useSession();

  return (
    <NavigationMenu className="border-b- fixed top-0 flex w-full items-center justify-between border-b-2 bg-white px-8 py-2 dark:bg-black">
      <>
        <NavigationMenuList>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href={session?.user?.isAuthenticated ? "/dashboard" : "/"}>
                <Image
                  src={"student.svg"}
                  width={100}
                  height={100}
                  className="h-10 w-10"
                  alt="Unigrow"
                ></Image>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
          {navLinks.map(({ title, path, checkAuth }) => {
            if (!checkAuth || session?.user?.isAuthenticated) {
              return (
                <NavigationMenuItem key={title}>
                  <Link href={path} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              );
            }
          })}
        </NavigationMenuList>
        <NavigationMenuList>
          <NavigationMenuItem>
            {session?.user?.isAuthenticated && <ProfileDropdown />}
          </NavigationMenuItem>
        </NavigationMenuList>
      </>
    </NavigationMenu>
  );
}

const ListItem = forwardRef<ElementRef<"a">, ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
