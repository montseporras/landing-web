import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/sidebar";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand-50/50 lg:flex">
      <AdminSidebar />
      <div className="flex-1 px-4 py-8 md:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
