"use client"

import DashboardLayout from "@/components/dashboard/layout";
import useFcmToken from "@/hooks/use-fcm-token";
import { AppKnockProviders } from "@/providers/knock-provider";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const {token, notificationPermissionStatus} = useFcmToken()
  console.log(token)
  return (
    <AppKnockProviders>
      <DashboardLayout>{children}</DashboardLayout>
    </AppKnockProviders >
  )
}