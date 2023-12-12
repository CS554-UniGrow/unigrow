import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserContext } from "./userContext";
import { useContext } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";
import { useRouter } from "next/navigation";
import { logout } from "@/app/signup/data";
import Link from "next/link";
import loadingLogo from "@/public/loading.png";

export default function ProfileDropdown() {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const router = useRouter();

  const handleLogOut = () => {
    setCurrentUser({ isAuthenticated: false });
    logout();
    router.replace("/signup");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser?.profile_pic} alt="@shadcn" />
            <AvatarFallback>{currentUser.name}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="flex justify-between font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {currentUser?.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser?.email}
            </p>
          </div>
          <ThemeToggle />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/people/${currentUser.uid}`}>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleLogOut()}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
