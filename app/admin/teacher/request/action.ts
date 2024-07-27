"use server";

import { db } from "@/lib/db";
import { sendNotification } from "@/services/notification.service";
import { getAdmin } from "@/services/user.service";
import { clerkClient } from "@clerk/nextjs/server";
import { Role, Status } from "@prisma/client";
import { revalidatePath } from "next/cache";

type UpdateStatus = {
  id: string;
  status: Status;
};
export const UPDATE_STATUS = async ({ id, status }: UpdateStatus) => {
  const teacher = await db.teacher.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  if (!teacher) {
    throw new Error("Teacher not found");
  }

  await db.teacher.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  if (status === Status.Active) {
    await clerkClient.users.updateUser(teacher.user?.clerkId, {
      publicMetadata: {
        role: Role.Teacher,
        status: Status.Active,
      },
    });
  }

  if(status === Status.Suspended) {
    await clerkClient.users.updateUser(teacher.user?.clerkId, {
      publicMetadata: {
        role: Role.User
      }
    })
  }

  const { adminId } = await getAdmin();
  await sendNotification({
    trigger: "teacher-response",
    actor: {
      id: adminId,
    },
    recipients: [teacher.userId],
    data: {
      status,
    },
  });

  revalidatePath("/admin/teacher/request");

  return {
    success: "Status updated",
  };
};

export const DELETE_TEACHER = async (id: string) => {
  const teacher = await db.teacher.findUnique({
    where: {
      id,
    },
    include: {
      user: true
    }
  });
  if (!teacher) {
    throw new Error("Teacher not found");
  }

  await db.teacher.delete({
    where: {
      id,
    },
  });

  await clerkClient.users.updateUser(teacher.user?.clerkId, {
    publicMetadata: {
      role: Role.User
    }
  })

  revalidatePath("/admin/teacher/request");

  return {
    success: "Teacher deleted",
  };
};
