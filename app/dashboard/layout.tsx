import { Knock } from "@knocklabs/node";

import DashboardLayout from "@/components/dashboard/layout";
import { AppKnockProviders } from "@/providers/knock-provider";
import { getUser } from "@/services/user.service";

const knock = new Knock(process.env.NEXT_PUBLIC_KNOCK_API_KEY);

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, userId } = await getUser()
  await knock.users.identify(userId, {
    name: user.name,
    avatar: user.imageUrl
  })

  return (
    <AppKnockProviders userId={userId}>
      <DashboardLayout>{children}</DashboardLayout>
    </AppKnockProviders >
  )
}