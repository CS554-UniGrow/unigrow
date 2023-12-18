"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { forwardRef, ElementRef, ComponentPropsWithoutRef } from "react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"

import { ThemeToggle } from "./theme-toggle"
import ProfileDropdown from "@/components/profileDropdown"
import logo from "@/public/loading_trans.gif"

const navLinks = [
  { title: "Dashboard", path: "/dashboard", checkAuth: true },
  { title: "Courses", path: "/courses", checkAuth: true },
  { title: "People", path: "/people", checkAuth: true },
  { title: "Resources", path: "/resources", checkAuth: false },
  { title: "About Us", path: "/aboutus", checkAuth: false },
  { title: "FAQs", path: "/faq", checkAuth: false },
  { title: "Chat", path: "/chat", checkAuth: true },
  {
    title: "Complete Onboarding",
    path: "/onboarding",
    checkAuth: false
  }
]

import { useSession } from "next-auth/react"
import RoundImage from "@/components/ui/round_image"

export default function Nav() {
  const { data: session }: any = useSession()
  return (
    <NavigationMenu className="border-b- fixed top-0 flex w-full items-center justify-between border-b-2 bg-white px-8 py-2 dark:bg-black">
      <>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              href={
                session?.user?.isAuthenticated && session?.user?.isOnboarded
                  ? "/dashboard"
                  : session?.user?.isAuthenticated &&
                      !session?.user?.isOnboarded
                    ? "/onboarding"
                    : "/"
              }
            >
              <RoundImage
                bg="bg-white"
                src={logo.src}
                width={10}
                height={10}
                alt="Unigrow"
              />
            </Link>
          </NavigationMenuItem>

          {navLinks.map(({ title, path, checkAuth }) => {
            if (!checkAuth || session?.user?.isOnboarded) {
              if (
                path === "/onboarding" &&
                (session?.user?.isOnboarded || !session?.user?.isAuthenticated)
              ) {
                return null
              }

              return (
                <NavigationMenuItem key={title}>
                  <Link href={path} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`${navigationMenuTriggerStyle()} ${
                        path === "/onboarding" && "bg-red-400"
                      }`}
                    >
                      {title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )
            }
          })}
        </NavigationMenuList>

        <div className="flex items-center space-x-4">
          <NavigationMenuList>
            <NavigationMenuItem>
              <div className="inline-block overflow-hidden rounded-full">
                <ThemeToggle />
              </div>
            </NavigationMenuItem>
          </NavigationMenuList>

          <NavigationMenuList>
            <NavigationMenuItem>
              <ProfileDropdown />
            </NavigationMenuItem>
          </NavigationMenuList>
        </div>
      </>
    </NavigationMenu>
  )
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
    )
  }
)
ListItem.displayName = "ListItem"
