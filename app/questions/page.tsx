"use client";

import { useContext } from "react";
import { UserContext } from "@/components/userComponent";

function Questions() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  console.log(currentUser.user);
  const user_data_string = currentUser.user;

  return <div>Hi my name is {user_data_string.displayName}</div>;
}

export default Questions;
