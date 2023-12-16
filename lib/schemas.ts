import z from "zod"

export const questionnaireFormSchema = z.object({
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
})

export type TQuestionnaire = z.infer<typeof questionnaireFormSchema>
