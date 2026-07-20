import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*, plans(*)")
    .eq("user_id", user?.id)
    .eq("active", true)
    .maybeSingle();

  const { data: progressRows } = await supabase
    .from("lesson_progress")
    .select("is_completed")
    .eq("user_id", user?.id);

  const completedCount = progressRows?.filter((r) => r.is_completed).length ?? 0;
  const totalCount = progressRows?.length ?? 0;
  const pct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy">
        Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
      </h1>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="card">
          <p className="text-sm text-navy/50">Current Plan</p>
          <p className="mt-1 font-display text-xl font-bold text-navy">
            {enrollment?.plans?.name ?? "No active plan"}
          </p>
          {!enrollment && (
            <a href="/#plans" className="mt-3 inline-block text-sm font-semibold text-royal">
              Choose a plan →
            </a>
          )}
        </div>
        <div className="card">
          <p className="text-sm text-navy/50">Overall Progress</p>
          <div className="mt-2 h-2 w-full rounded-full bg-navy/5">
            <div className="h-2 rounded-full bg-blue-gradient" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm text-navy/60">{pct}% complete</p>
        </div>
        <div className="card">
          <p className="text-sm text-navy/50">Lessons Completed</p>
          <p className="mt-1 font-display text-xl font-bold text-navy">
            {completedCount} / {totalCount}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-bold text-navy">Continue Learning</h2>
        <p className="mt-2 text-sm text-navy/50">
          Your most recent lesson will appear here once you start a course.
        </p>
      </div>
    </div>
  );
}
