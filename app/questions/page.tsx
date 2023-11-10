"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserContext } from "@/components/userComponent";
import { useContext } from "react";
import { writeUserData } from "./data";
import { useRouter } from "next/navigation";

function Questions() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const router = useRouter();

  const user_data_string = currentUser?.user;

  async function handle_submit(event: any) {
    event.preventDefault(); // Prevent default form submission

    // Retrieve form input values
    const major = event.target.elements.major.value;
    const joiningTerm = event.target.elements.joiningTerm.value;
    const graduationDate = event.target.elements.graduationDate.value;
    const canvasToken = event.target.elements.canvasToken.value;

    try {
      const response = await fetch(`/api/questions?canvas=${canvasToken}`);
      if (response) {
        const data = await response.json();
        if (data.primary_email === currentUser?.email) {
          await writeUserData({
            userId: currentUser?.uid, // Use the user ID from the context
            name: currentUser?.username, // Use the user's display name from context
            email: currentUser?.email,
            major: major,
            joiningTerm: joiningTerm,
            graduationDate: graduationDate,
            canvasToken: canvasToken,
            phone_number: currentUser?.phone,
            photo_url: data.avatar_url,
            metadata: currentUser?.metadata
          });
          router.push("/dashboard");
        } else {
          alert("Please enter a valid canvas token");
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div className="grid gap-5">
      <h1>Hey there! {currentUser?.username}</h1>
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
