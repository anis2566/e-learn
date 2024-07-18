import DashboardLayout from "@/components/dashboard/layout";
import { AppKnockProviders } from "@/providers/knock-provider";

export default function DemoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AppKnockProviders>
      <DashboardLayout>{children}</DashboardLayout>
    </AppKnockProviders>
  )
}