"use client";

import { useContext, useState } from "react";
import { UserContext } from "@/components/userContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { writeUserData } from "./data";
import { useRouter } from "next/navigation";
import logger from "@/lib/logger";
import { encrypt } from "@/lib/utils";
import { departmentList, joiningTerms } from "@/lib/constants";
import Loading from "@/components/ui/loading";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  major: z
    .string({
      required_error: "Please select your major."
    })
    .trim()
    .min(1, { message: "Please select your major." }),
  joiningTerm: z
    .string({
      required_error: "Please select your joining term."
    })
    .trim()
    .min(1, { message: "Please select your joining term." }),
  canvasToken: z.string().length(69, { message: "Enter a valid Canvas Token" })
});

type TQuestionaire = z.infer<typeof formSchema>;

function Questions() {
  const { data: session, status } = useSession();
  console.log(session);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<TQuestionaire>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      major: "",
      joiningTerm: "",
      canvasToken: ""
    }
  });

  const onSubmit = async (values) => {
    console.log(values);
  };

  async function handle_submit(event: any) {
    event.preventDefault(); // Prevent default form submission

    // Retrieve form input values
    const major = event.target.elements.major.value;
    const joiningTerm = event.target.elements.joiningTerm.value;
    const canvasToken_hashed = encrypt(event.target.elements.canvasToken.value);

    try {
      setLoading(true);
      const response = await fetch(`/api/questions`, {
        method: "POST",
        body: JSON.stringify({
          canvasToken_hashed: canvasToken_hashed,
          uid: currentUser?.uid
        })
      });

      if (response) {
        setLoading(false);

        const data = await response.json();
        if (data?.primary_email === currentUser?.email) {
          await writeUserData({
            userId: currentUser?.uid, // Use the user ID from the context
            name: currentUser?.username, // Use the user's display name from context
            email: currentUser?.email,
            major: major,
            joiningTerm: joiningTerm,
            graduationDate: "NA",
            canvasToken_hashed: canvasToken_hashed,
            phone_number: currentUser?.phone,
            photo_url: data?.avatar_url,
            metadata: currentUser?.metadata,
            courses: data?.courses
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
    <>
      {loading && <Loading />}
      <div className="grid gap-5">
        <h1 className="text-3xl">Hey! {session?.user?.name}</h1>
        <h2 className="my-10">
          Get started on our platform by answering a few simple questions
        </h2>
        {/* TODO add spinner to disable form when handle submit is running] */}
        {/* <form onSubmit={handle_submit}>
          <ol>
            <li>
              <Label>Major:</Label>
              <select id="major" name="major" required>
                {departmentList.map(({ course_code, department }) => (
                  <option key={course_code} value={course_code}>
                    {department}
                  </option>
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
              <Label>Canvas Token Instructions:</Label>
              <p>
                Generate your Canvas access token. Accessing the Canvas API
                requires a token, which you can think of as your username and
                password squished into one long random string. Do not share your
                token with anyone else!
              </p>
              <p>
                <strong>Steps to generate your token:</strong>
              </p>
              <ul>
                <li>
                  Log into Canvas at{" "}
                  <a
                    href="https://sit.instructure.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://sit.instructure.com/
                  </a>
                  . Click &apos;Account&apos; in the left menu, and then click
                  &apos;Settings&apos;.
                </li>
                <li>
                  Scroll to &apos;Approved Integration&apos; and click &apos;New
                  Access Token&apos;.
                </li>
                <li>
                  Fill in the &apos;Purpose&apos; field. For added security, set
                  an expiry date for your token.
                </li>
                <li>
                  Click &apos;Generate Token&apos;. Now copy your freshly
                  generated token and save it somewhere secure.
                </li>
              </ul>
            </li>
            <li>
              <Label>Canvas Token</Label>
              <Input type="text" id="canvasToken" name="canvasToken"></Input>
            </li>
          </ol>

          <Button type="submit" className="my-10">
            Submit Data
          </Button>
        </form> */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="min-w-lg mx-auto max-w-lg space-y-8 lg:max-w-xl"
          >
            <FormField
              control={form.control}
              name="major"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Major</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Major" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentList.map(({ course_code, department }) => (
                          <SelectItem key={course_code} value={course_code}>
                            {department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Choose the major that you are currently enrolled in
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="joiningTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Joining Term</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Joining Term" />
                      </SelectTrigger>
                      <SelectContent>
                        {joiningTerms.map(({ term, value }) => (
                          <SelectItem key={term} value={value}>
                            {term}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Choose the term that you joined Stevens
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="canvasToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Canvas Token</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Canvas Token" {...field} />
                  </FormControl>
                  <FormDescription>
                    Generate your Canvas access token. Accessing the Canvas API
                    requires a token, which you can think of as your username
                    and password squished into one long random string. Do not
                    share your token with anyone else!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}

export default Questions;
