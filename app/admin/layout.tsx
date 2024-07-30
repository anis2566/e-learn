import AdminPanelLayout from "@/components/admin/layout";
import { AppKnockProviders } from "@/providers/knock-provider";

export default async function DemoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AppKnockProviders>
      <AdminPanelLayout>{children}</AdminPanelLayout>
    </AppKnockProviders>
  )
}