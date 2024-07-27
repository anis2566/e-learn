"use server";

import { db } from "@/lib/db";
import { getTeacher } from "@/services/user.service";

type GetCourses = {
  search: string | null;
  sort: string | null;
  category: string | null;
};
export const GET_COURSES = async ({ search, sort, category }: GetCourses) => {
  const { teacherId } = await getTeacher();

  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      teachers: {
        every: {
          teacherId,
        },
      },
      ...(search && { title: { contains: search, mode: "insensitive" } }),
      ...(category && { category: { name: category } }),
    },
    include: {
      category: true,
      chapters: true,
      purchases: {
        select: {
            id: true
        }
      },
    },
    orderBy: {
      ...(sort && { createdAt: sort === "asc" ? "asc" : "desc" }),
    },
  });

  return { courses };
};
