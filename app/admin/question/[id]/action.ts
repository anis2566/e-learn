"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const DELETE_QUESTION = async (id: string) => {
  const question = await db.question.findUnique({
    where: {
      id,
    },
  });
  if (!question) {
    throw new Error("Question not found");
  }

  await db.question.delete({
    where: {
      id,
    },
  });

  revalidatePath(`/admin/question/${question.courseId}`);

  return {
    success: "Question deleted",
  };
};

export const DELETE_REPLY = async (id: string) => {
  const reply = await db.questionReply.findUnique({
    where: {
      id,
    },
    include: {
      question: true,
    },
  });
  if (!reply) {
    throw new Error("Reply not found");
  }

  await db.questionReply.delete({
    where: {
      id,
    },
  });

  revalidatePath(`/admin/question/${reply.question.courseId}`);

  return {
    success: "Reply deleted",
  };
};
