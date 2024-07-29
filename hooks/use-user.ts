import { getUserByClerkId } from "@/services/user.service";
import { useAuth } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  const { userId } = useAuth();
  if (!userId) redirect("/sign-in");

  useEffect(() => {
    const fetchUser = async () => {
      const { user } = await getUserByClerkId(userId);
      if (user) {
        setUser(user);
      }
    };
    fetchUser();
  }, []);

  return user;
};
