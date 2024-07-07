import AdminPanelLayout from "@/components/admin/layout";

export default function DemoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
      <AdminPanelLayout>{children}</AdminPanelLayout>
  )
}