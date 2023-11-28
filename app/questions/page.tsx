"use client";

import { useContext } from "react";
import { UserContext } from "@/components/userContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { writeUserData } from "./data";
import { useRouter } from "next/navigation";
import logger from "@/lib/logger";
import { encrypt } from "@/lib/utils";
import { courseList } from '@/lib/constants';


function Questions() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const router = useRouter();

  const user_data_string = currentUser?.user;

  async function handle_submit(event: any) {
    event.preventDefault(); // Prevent default form submission

    // Retrieve form input values
    const major = event.target.elements.major.value;
    const joiningTerm = event.target.elements.joiningTerm.value;
    const canvasToken_hashed = encrypt(event.target.elements.canvasToken.value);

    try {
      const response = await fetch(`/api/questions`, {
        method: "POST",
        body: JSON.stringify({
          canvasToken_hashed: canvasToken_hashed,
          uid: currentUser?.uid
        })
      });
      if (response) {
        const data = await response.json();
        if (data.primary_email === currentUser?.email) {
          await writeUserData({
            userId: currentUser?.uid, // Use the user ID from the context
            name: currentUser?.username, // Use the user's display name from context
            email: currentUser?.email,
            major: major,
            joiningTerm: joiningTerm,
            graduationDate: "NA",
            canvasToken_hashed: canvasToken_hashed,
            phone_number: currentUser?.phone,
            photo_url: data.avatar_url,
            metadata: currentUser?.metadata,
            courses: data.courses
          });
          router.push("/dashboard");
        } else {
          alert("Error, enter valid canvas token ");
        }
      }
    } catch (e) {
      logger.error(e);
    }
  }
  return (
    <div className="grid gap-5">
      <h1>Hey there! {currentUser?.username}</h1>
      <h2 className="my-10">
        Get started on our platform by answering a few simple questions
      </h2>
      {/* TODO add spinner to disable form when handle submit is running] */}
      <form onSubmit={handle_submit}>
        <ol>
          <li>
            <Label>Major:</Label>
            <select id="major" name="major" required>
              {Object.entries(courseList).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </li>
          <li>
            <Label>Enter your Joining Term:</Label>
            <select id="joiningTerm" name="joiningTerm" required>
              <option value="Alumni">Alumni</option>
              <option value="Fall 21">Fall 21</option>
              <option value="Spring 22">Spring 22</option>
              <option value="Fall 22">Fall 22</option>
              <option value="Spring 23">Spring 23</option>
              <option value="Fall 23">Fall 23</option>
              <option value="Spring 24">Spring 24</option>
            </select>
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
