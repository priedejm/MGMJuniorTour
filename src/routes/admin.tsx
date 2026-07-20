import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — MGM Junior Tour" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});
