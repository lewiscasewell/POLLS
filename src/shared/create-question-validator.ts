import { z } from "zod";

export const createQuestionValidator = z.object({
  question: z.string().min(5).max(600),
  options: z
    .array(z.object({ text: z.string().min(1).max(200) }))
    .min(2)
    .max(20),
  endsAt: z
    .date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date",
    })
    .min(new Date()),
});

export type CreateQuestionInputType = z.infer<typeof createQuestionValidator>;
