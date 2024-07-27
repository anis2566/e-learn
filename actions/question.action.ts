"use server";

import { db } from "@/lib/db";
import { QuestionSchema, QuestionSchemaType } from "@/schema/question.schema";
import { sendNotification } from "@/services/notification.service";
import { getAdmin, getUser } from "@/services/user.service";

export const CREATE_QUESTION = async (values: QuestionSchemaType) => {
  const { data, success } = QuestionSchema.safeParse(values);
  if (!success) {
    throw new Error("Invalid input value");
  }

  const { userId, user, clerkId } = await getUser();

  const course = await db.course.findUnique({
    where: {
      id: data.courseId,
    },
    include: {
      teachers: {
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  id: true
                }
              }
            }
          }
        },
      },
    },
  });
  if (!course) {
    throw new Error("Course not found");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: data.chapterId,
    },
  });

  await db.question.create({
    data: {
      userId,
      ...data,
    },
  });

  const teacherIds = course.teachers?.map((item) => item.teacher.user.id);
  const { adminId } = await getAdmin();

  await sendNotification({
    trigger: "question",
    actor: {
      id: clerkId,
      name: user.name,
    },
    recipients: [adminId],
    data: {
      redirectUrl: `/admin/question/${data.courseId}`,
      course: course.title,
      chapter: chapter?.title,
    },
  });

  if (teacherIds.length > 0) {
    await sendNotification({
      trigger: "question",
      actor: {
        id: clerkId,
        name: user.name,
      },
      recipients: [...teacherIds],
      data: {
        redirectUrl: `/teacher/question/${data.courseId}`,
        course: course.title,
        chapter: chapter?.title,
      },
    });
  }

  return {
    success: "Question submitted",
  };
};

type GetQuestion = {
  courseId: string;
  chapterId: string;
  page: number;
};
export const GET_QUESTIONS = async ({
  chapterId,
  courseId,
  page,
}: GetQuestion) => {
  const perPage = 3;

  const questions = await db.question.findMany({
    where: {
      courseId,
      chapterId,
    },
    include: {
      user: true,
      replies: {
        include: {
          user: true,
          teacher: true
        }
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: perPage * page,
  });

  return {
    questions,
  };
};
