"use server"

import { db } from "@/lib/db";
import { TeacherSchema, TeacherSchemaType } from "@/schema/teacher.schema";
import { revalidatePath } from "next/cache";

type UpdateTeacher = {
  id: string;
  values: TeacherSchemaType;
};
export const UPDATE_TEACHER = async ({ id, values }: UpdateTeacher) => {
  const { data, success } = TeacherSchema.safeParse(values);
  if (!success) {
    throw new Error("Invalid input value");
  }

  const teacher = await db.teacher.findUnique({
    where: {
      id,
    },
  });
  if (!teacher) {
    throw new Error("Teacher not found");
  }

  await db.teacher.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath(`/admin/teacher/edit/${id}`);

  return {
    success: "Updated",
  };
};
