import { z } from "zod";

export const QuestionSchema = z.object({
  title: z.string().min(5, {
    message: "required",
  }),
  courseId: z.string().min(1, {
    message: "required",
  }),
  chapterId: z.string().min(1, {
    message: "required",
  }),
});

export type QuestionSchemaType = z.infer<typeof QuestionSchema>;
