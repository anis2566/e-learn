"use server";

import { db } from "@/lib/db";
import { Chapter } from "@prisma/client";
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
}
export const UPDATE_CHAPTER = async ({id, values, courseId}:UpdateChapter) => {
    const chapter = await db.chapter.findUnique({
        where: {
            id,
            courseId
        }
    })
    
    if(!chapter) {
        throw new Error("Chapter not found")
    }

    await db.chapter.update({
        where: {
            id,
            courseId
        },
        data: {
            ...values
        }
    })

    revalidatePath(`/admin/course/${courseId}/chapter/${id}`)

    return {
        success: "Chapter updated"
    }
}


export const PUBLISH_CHAPTER = async (id:string) => {
    const chapter = await db.chapter.findUnique({
        where: {
            id
        }
    })

    if(!chapter) {
        throw new Error("Chapter not found")
    }

    await db.chapter.update({
        where: {
            id
        },
        data: {
            isPublished: true
        }
    })

    revalidatePath(`/admin/course/${chapter.courseId}/chapter/${id}`)

    return {
        success: "Chapter published"
    }
}


export const UNPUBLISH_CHAPTER = async (id:string) => {
    const chapter = await db.chapter.findUnique({
        where: {
            id
        }
    })

    if(!chapter) {
        throw new Error("Chapter not found")
    }

    await db.chapter.update({
        where: {
            id
        },
        data: {
            isPublished: false
        }
    })

    revalidatePath(`/admin/course/${chapter.courseId}/chapter/${id}`)

    return {
        success: "Chapter published"
    }
}


export const DELETE_CHAPTER = async (id: string) => {
    const chapter = await db.chapter.findUnique({
        where: {
            id
        }
    })

    if(!chapter) {
        throw new Error("Chapter not found")
    }

    await db.chapter.delete({
        where: {
            id
        },
    })

    return {
        success: "Chapter deleted"
    }
}