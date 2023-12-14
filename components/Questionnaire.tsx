"use client";

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
import { departmentList, joiningTerms } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { handleSubmitAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "./ui/loading";

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

export type TQuestionnaire = z.infer<typeof formSchema>;

const Questionnaire = () => {
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<TQuestionnaire>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      major: "",
      joiningTerm: "",
      canvasToken: ""
    }
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const result = await handleSubmitAction(
        values,
        session?.user?._id,
        session?.user?.refreshToken
      );
      update({ isOnboarded: true });
      setIsLoading(false);
      router.push("/dashboard");
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
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
                  requires a token, which you can think of as your username and
                  password squished into one long random string. Do not share
                  your token with anyone else!
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
    </>
  );
};

export default Questionnaire;
