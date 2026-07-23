import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function BrowseCoursesPage() {
  const supabase = createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("*, modules(count)")
    .eq("is_published", true)
    .order("min_plan_tier")
    .order("sort_order");

  const tierLabel: Record<number, string> = {
    0: "Free",
    1: "Basic",
    2: "Advanced",
    3: "Master AI Program",
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy">Browse Courses</h1>
      <p className="mt-1 text-sm text-navy/50">
        Everything available on your current plan — and what's next if you upgrade.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {courses?.map((course: any) => (
          <Link
            key={course.id}
            href={`/courses/${course.slug}`}
            className="card block transition-shadow hover:shadow-soft-lg"
          >
            <span className="rounded-full bg-royal-50 px-3 py-1 text-xs font-semibold text-royal">
              {tierLabel[course.min_plan_tier] ?? "Plan required"}
            </span>
            <h2 className="mt-3 font-display text-lg font-bold text-navy">{course.title}</h2>
            <p className="mt-1 text-sm text-navy/60">{course.short_description}</p>
            <p className="mt-3 text-xs text-navy/40">{course.modules?.[0]?.count ?? 0} modules</p>
          </Link>
        ))}
      </div>

      {!courses?.length && (
        <p className="mt-10 text-sm text-navy/50">No courses published yet.</p>
      )}
    </div>
  );
}