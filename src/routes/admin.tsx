import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RequireStaff } from "@/components/admin/RequireStaff";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Mixue of RUPP" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequireStaff>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </RequireStaff>
  ),
});