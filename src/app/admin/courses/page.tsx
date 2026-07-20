import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminCoursesPage() {
  const supabase = createAdminClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("*, modules(count)")
    .order("sort_order");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-navy">Courses</h1>
        <Link href="/admin/courses/new" className="btn-primary !px-4 !py-2 text-sm">
          + New Course
        </Link>
      </div>

      <div className="card mt-6 overflow-hidden !p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy/5 text-navy/50">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Min. Plan Tier</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Modules</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/5">
            {courses?.map((c: any) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium text-navy">{c.title}</td>
                <td className="px-4 py-3">{c.min_plan_tier}</td>
                <td className="px-4 py-3">{c.is_published ? "Yes" : "Draft"}</td>
                <td className="px-4 py-3">{c.modules?.[0]?.count ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-navy/40">
        This table is read-only in this scaffold — wire up create/edit forms (Server Actions
        posting to `courses`, `modules`, `lessons`) following the same pattern before going live.
      </p>
    </div>
  );
}
