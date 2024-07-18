"use server";

import { db } from "@/lib/db";
import { getUser } from "@/services/user.service";
import { revalidatePath } from "next/cache";

type ToggleProgress = {
  courseId: string;
  chapterId: string;
};
export const MARK_COMPLETE = async ({
  chapterId,
  courseId,
}: ToggleProgress) => {
  const chapter = await db.chapter.findUnique({
    where: {
      courseId,
      id: chapterId,
      isPublished: true,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  const { userId } = await getUser();

  await db.userProgress.upsert({
    where: {
      userId_chapterId: {
        userId,
        chapterId,
      },
    },
    create: {
      userId,
      chapterId,
      isCompleted: true,
    },
    update: {
      isCompleted: true,
    },
  });

  revalidatePath(`/dashboard/courses/${chapter.courseId}/chapters/${chapter.id}`)

  return {
    success: "Chapter completed",
  };
};


export const MARK_INCOMPLETE = async ({
  chapterId,
  courseId,
}: ToggleProgress) => {
  const chapter = await db.chapter.findUnique({
    where: {
      courseId,
      id: chapterId,
      isPublished: true,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  const { userId } = await getUser();

  await db.userProgress.update({
    where: {
      userId_chapterId: {
        userId,
        chapterId,
      },
    },
    data: {
      isCompleted: false,
    },
  });

  revalidatePath(`/dashboard/courses/${chapter.courseId}/chapters/${chapter.id}`)

  return {
    success: "Chapter incompleted",
  };
};


export const GET_PROGRESS = async (
    userId: string,
    courseId: string
  ): Promise<number> => {
    try {
      const publishedChapters = await db.chapter.findMany({
        where: {
          courseId: courseId,
          isPublished: true,
        },
        select: {
          id: true,
        },
      });
  
      const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);
  
      const validCompletedChapters = await db.userProgress.count({
        where: {
          userId: userId,
          chapterId: {
            in: publishedChapterIds,
          },
          isCompleted: true,
        },
      });
  
      const progressPercentage =
        (validCompletedChapters / publishedChapterIds.length) * 100;
  
      return progressPercentage;
    } catch (error) {
      console.log("[GET_PROGRESS]", error);
      return 0;
    }
  };