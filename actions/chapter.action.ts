"use server";

import { db } from "@/lib/db";
import { getUser } from "@/services/user.service";
import { Attachment, Chapter } from "@prisma/client";
import { revalidatePath } from "next/cache";

type CreateChapter = {
  courseId: string;
  title: string;
};
export const CREATE_CHAPTER = async ({ courseId, title }: CreateChapter) => {
  const chapter = await db.chapter.findFirst({
    where: {
      title,
      courseId,
    },
  });
  if (chapter) {
    throw new Error("Chapter exists");
  }

  await db.chapter.create({
    data: {
      title,
      courseId,
    },
  });

  revalidatePath(`/admin/course/${courseId}`);

  return {
    success: "Chapter created",
  };
};

interface ReorderChapter {
  list: { id: string; position: number }[];
}

export const REORDER_CHAPTER = async ({ list }: ReorderChapter) => {
  const transaction = list.map((item) => {
    return db.chapter.update({
      where: { id: item.id },
      data: { position: item.position },
    });
  });

  try {
    await db.$transaction(transaction);
    return {
      success: "Chapters reordered",
    };
  } catch (error) {
    return {
      error: "Failed to reorder chapters",
    };
  }
};

type UpdateChapter = {
  id: string;
  courseId: string;
  values: Chapter;
};
export const UPDATE_CHAPTER = async ({
  id,
  values,
  courseId,
}: UpdateChapter) => {
  const chapter = await db.chapter.findUnique({
    where: {
      id,
      courseId,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  await db.chapter.update({
    where: {
      id,
      courseId,
    },
    data: {
      ...values,
    },
  });

  revalidatePath(`/admin/course/${courseId}/chapter/${id}`);

  return {
    success: "Chapter updated",
  };
};

export const PUBLISH_CHAPTER = async (id: string) => {
  const chapter = await db.chapter.findUnique({
    where: {
      id,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  await db.chapter.update({
    where: {
      id,
    },
    data: {
      isPublished: true,
    },
  });

  revalidatePath(`/admin/course/${chapter.courseId}/chapter/${id}`);

  return {
    success: "Chapter published",
  };
};

export const UNPUBLISH_CHAPTER = async (id: string) => {
  const chapter = await db.chapter.findUnique({
    where: {
      id,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  await db.chapter.update({
    where: {
      id,
    },
    data: {
      isPublished: false,
    },
  });

  revalidatePath(`/admin/course/${chapter.courseId}/chapter/${id}`);

  return {
    success: "Chapter published",
  };
};

export const DELETE_CHAPTER = async (id: string) => {
  const chapter = await db.chapter.findUnique({
    where: {
      id,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  await db.chapter.delete({
    where: {
      id,
    },
  });

  return {
    success: "Chapter deleted",
  };
};

type GetChapter = {
  courseId: string;
  chapterId: string;
};
export const GET_CHAPTER = async ({ chapterId, courseId }: GetChapter) => {
  const { userId } = await getUser();

  try {
    const purchased = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
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

    let attachments: Attachment[] = [];
    // let nextChapter: Chapter | null = null;

    if (purchased) {
      attachments = await db.attachment.findMany({
        where: {
          chapterId: chapterId,
        },
      });
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    return {
      chapter,
      course,
      attachments,
      previousChapter,
      nextChapter,
      userProgress,
      purchased,
    };
  } catch (error) {
    return {
      chapter: null,
      course: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};
