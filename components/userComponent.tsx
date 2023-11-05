"use client";
import React, { createContext, useState, useContext } from "react";

export const UserContext = createContext(null);
export const UserContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  //Note: how can i implement here to provide context.provoder with users value without making the APi call from within here

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
