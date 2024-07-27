"use server";

import { db } from "@/lib/db";
import { getTeacher } from "@/services/user.service";

type GetChapter = {
  courseId: string;
  chapterId: string;
};
export const GET_CHAPTER = async ({ chapterId, courseId }: GetChapter) => {
  try {
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      include: {
        chapters: {
          select: {
            id: true,
          },
        },
      },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
      include: {
        questions: {
          select: {
            id: true,
          },
        },
        attachments: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!chapter || !course) {
      throw new Error("Chapter or course not found");
    }

    let previousChapter = null;

    if (chapter.position !== null) {
      const pre = await db.chapter.findFirst({
        where: {
          courseId,
          position: chapter.position - 1,
        },
      });
      if (pre) {
        previousChapter = pre.id;
      }
    }

    let nextChapter = null;
    if (chapter.position !== null) {
      const nex = await db.chapter.findFirst({
        where: {
          courseId,
          position: chapter.position + 1,
        },
      });

      if (nex) {
        nextChapter = nex.id;
      }
    }

    return {
      chapter,
      course,
      previousChapter,
      nextChapter,
    };
  } catch (error) {
    return {
      chapter: null,
      course: null,
      previousChapter: null,
      nextChapter: null,
    };
  }
};

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

  const { teacherId } = await getTeacher();

  await db.questionReply.create({
    data: {
      questionId: id,
      reply,
      teacherId,
    },
  });

  return {
    success: "Replied",
  };
};
