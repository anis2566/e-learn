"use server";

import { db } from "@/lib/db";
import { sendNotification } from "@/services/notification.service";
import { getUser } from "@/services/user.service";
import { revalidatePath } from "next/cache";

type QuestionReply = {
  id: string;
  reply: string;
};
export const QUESTION_REPLY = async ({ id, reply }: QuestionReply) => {
  const question = await db.question.findUnique({
    where: {
      id,
    },
  });
  if (!question) {
    throw new Error("Question not found");
  }

  const { userId, user } = await getUser();

  await db.questionReply.create({
    data: {
      questionId: id,
      reply,
      userId,
    },
  });

  if (question.userId !== userId) {
    await sendNotification({
      trigger: "question-reply",
      actor: {
        id: userId,
        name: user.name,
      },
      recipients: [question.userId],
      data: {
        redirectUrl: `/dashboard/courses/${question.courseId}/chapters/${question.chapterId}`,
      },
    });
  }

  revalidatePath(`/admin/questions/${question.courseId}`)

  return {
    success: "Replied",
  };
};
