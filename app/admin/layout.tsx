import AdminPanelLayout from "@/components/admin/layout";
import { AppKnockProviders } from "@/providers/knock-provider";
import { getUser } from "@/services/user.service";

export default async function DemoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const {userId} = await getUser()

  return (
    <AppKnockProviders userId={userId}>
      <AdminPanelLayout>{children}</AdminPanelLayout>
    </AppKnockProviders>
  )
}