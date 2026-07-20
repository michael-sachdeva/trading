import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CoursePage({ params }: { params: { courseSlug: string } }) {
  const supabase = createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*, modules(*, lessons(*))")
    .eq("slug", params.courseSlug)
    .single();

  if (!course) return notFound();

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-3xl font-bold text-navy">{course.title}</h1>
      <p className="mt-2 text-navy/60">{course.short_description}</p>

      <div className="mt-10 space-y-6">
        {course.modules
          ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((mod: any) => (
            <div key={mod.id} className="card">
              <h2 className="font-display text-lg font-bold text-navy">{mod.title}</h2>
              <ul className="mt-4 divide-y divide-navy/5">
                {mod.lessons
                  ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
                  .map((lesson: any) => (
                    <li key={lesson.id} className="flex items-center justify-between py-3">
                      <Link
                        href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                        className="text-sm font-medium text-navy hover:text-royal"
                      >
                        {lesson.title}
                      </Link>
                      {lesson.is_preview && (
                        <span className="rounded-full bg-royal-50 px-2 py-0.5 text-xs font-semibold text-royal">
                          Free Preview
                        </span>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </div>
    </main>
  );
}
