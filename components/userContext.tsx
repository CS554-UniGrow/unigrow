"use client";
import { User, UserWithAuth } from "@/lib/types";
import React, { createContext, useState, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "@/firebase";
import { fetchUserDetails } from "@/lib/utils";

type UserContextType = {
  currentUser: any;
  login: () => void;
  register: () => void;
  signout: () => void;
  setCurrentUser: (user: any) => void;
};

const initialState = {
  currentUser: { isAuthenticated: false } as UserWithAuth,
  login: () => {},
  register: () => {},
  signout: () => {},
  setCurrentUser: (user: any) => {}
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
        const userDetails = fetchUserDetails(user) as unknown as UserWithAuth;
        setCurrentUser({ ...userDetails, isAuthenticated: true });
      } else if (!openPath.includes(pathName)) {
        // When user is not signed in, and the path is not open path, redirect to signup
        router.replace("/signup");
      } else {
        setCurrentUser({ isAuthenticated: false } as UserWithAuth);
      }
      return () => unsubscribe();
    });
  }, [pathName]);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login: () => {},
        register: () => {},
        signout: () => {}
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
