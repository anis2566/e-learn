"use client";

import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useSidebar } from "@/hooks/use-sidebar";
import { Sidebar } from "./sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const sidebar = useSidebar(useSidebarToggle, (state) => state);
  const pathname = usePathname()

  if (!sidebar) return null;

  const isNoLayout = pathname.includes("/chapters")

  return (
    <>
      {
        isNoLayout ? children : (
          <>
            <Sidebar />
            <main
              className={cn(
                "min-h-[calc(100vh_-_56px)] transition-[margin-left] ease-in-out duration-300",
                sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-64"
              )}
            >
              {children}
            </main>
          </>
        )
      }
    </>
  );
}