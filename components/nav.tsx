"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  useContext,
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef
} from "react";
import { UserContext } from "./userContext";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

import ProfileDropdown from "@/components/profileDropdown";
import Image from "next/image";

const navLinks = [
  { title: "Dashboard", path: "/dashboard" },
  { title: "Courses", path: "/courses" },
  { title: "People", path: "/people" },
  { title: "Resources", path: "/resources" }
];

export default function Nav() {
  const { currentUser } = useContext(UserContext);

  return (
    <NavigationMenu className="border-b- fixed top-0 flex w-full items-center justify-between border-b-2 bg-white px-8 py-2 dark:bg-black">
      {currentUser?.isAuthenticated ? (
        <>
          <NavigationMenuList>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href={"/dashboard"}>
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
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.title}>
                <Link href={link.path} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {link.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
          <NavigationMenuList>
            <NavigationMenuItem>
              <ProfileDropdown />
            </NavigationMenuItem>
          </NavigationMenuList>
        </>
      ) : (
        <>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href={"/dashboard"}>
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
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href={"/signup"}>
                <Button>Login</Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </>
      )}
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
