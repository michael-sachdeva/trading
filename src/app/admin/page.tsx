import { createAdminClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = createAdminClient();

  const [{ count: userCount }, { count: courseCount }, { data: revenueRows }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("amount_inr").eq("status", "paid"),
  ]);

  const totalRevenue = revenueRows?.reduce((sum, o) => sum + Number(o.amount_inr), 0) ?? 0;

  const stats = [
    { label: "Total Students", value: userCount ?? 0 },
    { label: "Published Courses", value: courseCount ?? 0 },
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}` },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy">Admin Overview</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <p className="text-sm text-navy/50">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-navy">{s.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-navy/50">
        This overview reads directly from Supabase using the service role key — it must only ever
        run in a Server Component or Route Handler gated by the <code>is_admin()</code> check (see
        README → Admin access control).
      </p>
    </div>
  );
}
