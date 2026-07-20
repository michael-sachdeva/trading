import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/affiliates", label: "Affiliates" },
  { href: "/admin/support", label: "Support Tickets" },
  { href: "/admin/announcements", label: "Announcements" },
];

/**
 * Server-side gate: every /admin/* route requires role = 'admin' on the
 * user's profile row. Middleware already blocks unauthenticated users;
 * this layout additionally blocks authenticated non-admins. Admin data
 * fetches inside child pages use createAdminClient() (service role) and
 * MUST only ever be reached through this gate.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-hero-gradient">
      <aside className="hidden w-60 shrink-0 border-r border-navy/5 bg-white p-6 md:block">
        <Link href="/" className="font-display text-lg font-bold text-navy">
          Admin Panel
        </Link>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-navy/70 hover:bg-royal-50 hover:text-royal"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-6 md:p-10">{children}</div>
    </div>
  );
}
