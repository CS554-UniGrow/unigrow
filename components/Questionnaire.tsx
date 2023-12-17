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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { checkCanvasToken, handleSubmitAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import React, { useState, ReactNode } from "react";
import Loading from "./ui/loading";

import { questionnaireFormSchema, TQuestionnaire } from "@/lib/schemas";

interface FaqItemProps {
  question: string;
  answer?: string;
  children?: ReactNode;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="faq-question py-4">
      <h3 className="text-base font-semibold mb-8 cursor-pointer" onClick={toggleOpen}>
        {question}
      </h3>
      {isOpen && (
        <div className="text-base">
          {children ? children : <p>{answer}</p>}
        </div>
      )}
    </div>
  );
};


const Questionnaire = () => {
  const { data: session, status, update }: any = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<TQuestionnaire>({
    resolver: zodResolver(questionnaireFormSchema),
    defaultValues: {
      major: "",
      joiningTerm: "",
      canvasToken: ""
    }
  });

  const onSubmit = async (values: TQuestionnaire) => {
    setIsLoading(true);
    try {
      const isTokenValid = await checkCanvasToken(values.canvasToken);

      if (!isTokenValid) {
        form.setError("canvasToken", {
          type: "manual",
          message: "Seems like you have entered an invalid token."
        });
        setIsLoading(false);
        return;
      }
      // values.canvasToken = encrypt(values.canvasToken);
      const result = await handleSubmitAction(
        values,
        session?.user?._id,
        session?.user?.refreshToken
      );
      await update({ isOnboarded: true, avatar_url: result?.avatar_url });

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
                  <br />
                  <br />
                  
                  <FaqItem question="How to Obtain My Canvas Token">
                    <p>Getting your Canvas key is simple. You can also watch our step-by-step guide on YouTube for detailed instructions.</p>

                    <ol className="list-decimal pl-6">
                      <li>
                        Log into Canvas at <a href="https://sit.instructure.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">https://sit.instructure.com</a>.
                      </li>
                      <li>
                        Click &quot;Account&quot; in the left menu, then select &quot;Settings.&quot;
                      </li>
                      <li>
                        Scroll down to &quot;Approved Integration&quot; and click on &quot;New Access Token.&quot;
                      </li>
                      <li>
                        Fill in the &quot;Purpose&quot; field and, for added security, set an expiry date for your token.
                      </li>
                      <li>
                        Click &quot;Generate Token,&quot; then copy and securely save your newly generated token.
                      </li>
                    </ol>
                    {/* Embed a YouTube video */}
                    <div className="video-container my-4">
                      <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/_yt8rfD7MTk"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </FaqItem>
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
