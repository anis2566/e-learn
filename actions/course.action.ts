"use server";

import { db } from "@/lib/db";
import { Course } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { GET_PROGRESS } from "./user-progress.action";
import { getUser } from "@/services/user.service";

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
      purchases: true,
    },
    orderBy: {
      ...(sort && { createdAt: sort === "asc" ? "asc" : "desc" }),
    },
  });

  return { courses };
};

export const GET_MY_COURSES = async ({
  search,
  sort,
  category,
}: GetCourses) => {
  const { userId } = await getUser();

  const courses = await db.course.findMany({
    where: {
      purchases: {
        some: {
          userId,
        },
      },
      isPublished: true,
      ...(search && { title: { contains: search, mode: "insensitive" } }),
      ...(category && { category: { name: category } }),
    },
    include: {
      category: true,
      chapters: true,
      purchases: true,
    },
    orderBy: {
      ...(sort && { createdAt: sort === "asc" ? "asc" : "desc" }),
    },
  });

  const coursesWithProgress = await Promise.all(
    courses.map(async (course) => {
      if (course.purchases.length === 0) {
        return {
          ...course,
          progress: null,
        };
      }

      const progressPercentage = await GET_PROGRESS(userId, course.id);

      return {
        ...course,
        progress: progressPercentage,
      };
    })
  );

  return { courses: coursesWithProgress };
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

type AssignTeacher = {
  courseId: string;
  teachers: string[];
};
export const ASSIGN_TEACHER = async ({ courseId, teachers }: AssignTeacher) => {
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
  });
  if (!course) {
    throw new Error("Course not found");
  }

  const existingTeachers = await db.courseTeacher.findMany({
    where: {
      courseId,
      teacherId: {
        in: teachers,
      },
    },
  });

  if (existingTeachers.length > 0) {
    throw new Error("Teacher already exists");
  }

  await Promise.all(
    teachers.map((teacherId) =>
      db.courseTeacher.create({
        data: {
          courseId: courseId,
          teacherId: teacherId,
        },
      })
    )
  );

  revalidatePath(`/admin/course/${courseId}`);

  return {
    success: "Course updated",
  };
};

type RemoveTeacher = {
  courseId: string;
  teacherId: string;
};
export const REMOVE_TEACHER = async ({
  courseId,
  teacherId,
}: RemoveTeacher) => {
  const courseTeacher = await db.courseTeacher.findUnique({
    where: {
      teacherId_courseId: {
        teacherId,
        courseId,
      },
    },
  });
  if (!courseTeacher) {
    throw new Error("Course or Teacher not found");
  }

  await db.courseTeacher.delete({
    where: {
      teacherId_courseId: {
        teacherId,
        courseId,
      },
    },
  });

  revalidatePath(`/admin/course/${courseId}`);

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
