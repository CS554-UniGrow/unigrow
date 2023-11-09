"use client";
import React, { createContext, useState, useContext } from "react";

type UserContextType = {
  currentUser: any;
  setCurrentUser: (user: any) => void;
};

const initialState = {
  currentUser: null,
  setCurrentUser: () => {}
};

type Props = {
  children: React.ReactNode;
};

export const UserContext = createContext<UserContextType>(initialState);

export const UserContextProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState();

  //Note: how can i implement here to provide context.provoder with users value without making the APi call from within here

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
