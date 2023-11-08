"use client";

import { useContext } from "react";
import { UserContext } from "@/components/userComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

function Questions() {
  // const { currentUser, setCurrentUser } = useContext(UserContext);
  // console.log(currentUser?.user);
  // const user_data_string = currentUser?.user;

  return (
    <div className="grid gap-5">
      {/* <h1>Hey there! {user_data_string?.displayName}</h1> */}
      <h2 className="my-10">
        Get started on our platform by answering a few simple questions
      </h2>

      <form>
        <ol>
          <li>
            <Label>Major:</Label>
            <Input type="text" placeholder="Eg: CS/MIS/AI"></Input>
          </li>
          <li>
            <Label>Enter your Joining Term:</Label>
            <Input type="text" placeholder="Eg: Fall 23 "></Input>
          </li>
          <li>
            <Label>Expected Graduation</Label>
            <Input type="date"></Input>
          </li>

          <li>
            <Label>Are you an alumni </Label>
            <Checkbox />
          </li>

          <li>
            <Label>Canvas Token</Label>
            <Input type="text"></Input>
          </li>
        </ol>
      </form>
    </div>
  );
}

export default Questions;
