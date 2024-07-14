"use server";

import { db } from "@/lib/db";
import { Course } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export const CREATE_COURSE = async (title: string) => {
  const course = await db.course.findFirst({
    where: {
      title,
    },
  });
  if (course) {
    throw new Error("Course exists");
  }

  const newCourse = await db.course.create({
    data: {
      title,
    },
  });

  return {
    success: "Course created",
    id: newCourse.id,
  };
};

type GetCourses = {
  search: string | null;
  sort: string | null;
  category: string | null;
};
export const GET_COURSES = async ({ search, sort, category }: GetCourses) => {
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      ...(search && { title: { contains: search, mode: "insensitive" } }),
      ...(category && { category: { name: category } }),
    },
    include: {
      category: true,
      chapters: true,
    },
    orderBy: {
      ...(sort && {createdAt: sort === "asc" ? "asc" : "desc"})
    },
  });

  return {courses}
};

export const GET_COURSE = async (id: string) => {
  const course = await db.course.findUnique({
    where: {
      id,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) redirect("/dashboard");

  return {
    course,
  };
};

type UpdateCourse = {
  id: string;
  values: Course;
};
export const UPDATE_COURSE = async ({ id, values }: UpdateCourse) => {
  const course = await db.course.findUnique({
    where: {
      id,
    },
  });
  if (!course) {
    throw new Error("Course not found");
  }

  await db.course.update({
    where: {
      id,
    },
    data: {
      ...values,
    },
  });

  revalidatePath(`/admin/course/${id}`);

  return {
    success: "Course updated",
  };
};

export const PUBLISH_COURSE = async (id: string) => {
  const course = await db.course.findUnique({
    where: {
      id,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  await db.course.update({
    where: {
      id,
    },
    data: {
      isPublished: true,
    },
  });

  revalidatePath(`/admin/course/${id}`);

  return {
    success: "Chapter published",
  };
};

export const UNPUBLISH_COURSE = async (id: string) => {
  const course = await db.course.findUnique({
    where: {
      id,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  await db.course.update({
    where: {
      id,
    },
    data: {
      isPublished: false,
    },
  });

  revalidatePath(`/admin/course/${id}`);

  return {
    success: "Course published",
  };
};

export const DELETE_COURSE = async (id: string) => {
  const course = await db.course.findUnique({
    where: {
      id,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  await db.course.delete({
    where: {
      id,
    },
  });

  revalidateTag("/admin/course");

  return {
    success: "Course deleted",
  };
};
