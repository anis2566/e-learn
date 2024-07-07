import { z } from "zod";

export const AttachmentSchema = z.object({
  title: z.string().min(1, {
    message: "required",
  }),
  url: z.string().min(1, {
    message: "required",
  }),
  chapterId: z.string().min(1, {message: "required"}),
});

export type AttachmentSchemaType = z.infer<typeof AttachmentSchema>;
