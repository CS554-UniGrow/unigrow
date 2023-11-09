"use client";

import { useContext } from "react";
import { UserContext } from "@/components/userComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { writeUserData } from "./data";

function Questions() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  console.log(currentUser?.user);
  const user_data_string = currentUser?.user;

  async function handle_submit(event: any) {
    event.preventDefault(); // Prevent default form submission

    // Retrieve form input values
    const major = event.target.elements.major.value;
    const joiningTerm = event.target.elements.joiningTerm.value;
    const graduationDate = event.target.elements.graduationDate.value;
    const isAlumni = event.target.elements.alumni.checked;
    const canvasToken = event.target.elements.canvasToken.value;

    try {
      await writeUserData({
        userId: currentUser?.user?.uid, // Use the user ID from the context
        name: currentUser?.user?.displayName, // Use the user's display name from context
        email: currentUser?.user?.email,
        major: major,
        joiningTerm: joiningTerm,
        graduationDate: graduationDate,
        canvasToken: canvasToken,
        phone_number: currentUser?.user?.phoneNumber,
        photo_url: currentUser?.user?.photoURL,
        creation_time: currentUser?.user?.metadata?.creationTime
      });
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div className="grid gap-5">
      <h1>Hey there! {user_data_string?.displayName}</h1>
      <h2 className="my-10">
        Get started on our platform by answering a few simple questions
      </h2>

      <form onSubmit={handle_submit}>
        <ol>
          <li>
            <Label>Major:</Label>
            <Input
              type="text"
              id="major"
              name="major"
              placeholder="Eg: CS/MIS/AI"
            ></Input>
          </li>
          <li>
            <Label>Enter your Joining Term:</Label>
            <Input
              type="text"
              id="joiningTerm"
              name="joiningTerm"
              placeholder="Eg: Fall 23 "
            ></Input>
          </li>
          <li>
            <Label>Expected Graduation</Label>
            <Input
              type="date"
              id="graduationDate"
              name="graduationDate"
            ></Input>
          </li>

          <li>
            <Label>Are you an alumni </Label>
            <Checkbox id="alumni" name="alumni" />
          </li>

          <li>
            <Label>Canvas Token</Label>
            <Input type="text" id="canvasToken" name="canvasToken"></Input>
          </li>
        </ol>

        <Button type="submit" className="my-10">
          Submit Data
        </Button>
      </form>
    </div>
  );
}

export default Questions;
