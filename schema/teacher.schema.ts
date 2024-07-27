import { z } from "zod";

const requiredString = z.string().trim().min(1, {message: "required"})

export const TeacherSchema = z.object({
  name: requiredString,
  email: requiredString.email({message: "invalid email"}),
  phone: requiredString.min(11, "invalid phone number"),
  imageUrl: requiredString,
  bio: requiredString.min(10, {message: "too short"}),
  experience: z.number().min(1, {message: "required"})
});

export type TeacherSchemaType = z.infer<typeof TeacherSchema>;
