"use client";
import { User, UserWithAuth } from "@/lib/types";
import React, { createContext, useState, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "@/firebase";

type UserContextType = {
  currentUser: any;
  login: () => void;
  register: () => void;
  signout: () => void;
};

const initialState = {
  currentUser: { isAuthenticated: false } as UserWithAuth
};

type Props = {
  children: React.ReactNode;
};

export const UserContext = createContext<UserContextType>(initialState);

export const useUserState = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<UserWithAuth>();
  let router = useRouter();
  const auth = getAuth(app);

  const isAuthenticated = currentUser?.isAuthenticated;
  const pathName = usePathname();
  const openPath = ["/", "/signup"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        setCurrentUser(user);
      } else if (!openPath.includes(pathName)) {
        // User is signed out
        // ...
        router.replace("/signup");
      }
      return () => unsubscribe();
    });
  }, [pathName]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
