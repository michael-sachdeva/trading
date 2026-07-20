"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import VideoPlayer from "@/components/VideoPlayer";

/**
 * Lesson page — Client Component so the language toggle and progress
 * tracking feel instant. Supabase RLS (see lesson_content_gated_read policy
 * in schema.sql) ensures a user only receives content rows their plan
 * actually covers; an unauthorized fetch simply returns no rows.
 */
export default function LessonPage({
  params,
}: {
  params: { courseSlug: string; lessonSlug: string };
}) {
  const supabase = createClient();
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [lesson, setLesson] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: lessonRow } = await supabase
        .from("lessons")
        .select("*")
        .eq("slug", params.lessonSlug)
        .single();
      setLesson(lessonRow);

      if (lessonRow) {
        const { data: contentRow } = await supabase
          .from("lesson_content")
          .select("*")
          .eq("lesson_id", lessonRow.id)
          .eq("language", language)
          .maybeSingle();
        setContent(contentRow);
      }
      setLoading(false);
    }
    load();
  }, [params.lessonSlug, language]);

  async function markComplete() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !lesson) return;

    await supabase.from("lesson_progress").upsert(
      {
        user_id: user.id,
        lesson_id: lesson.id,
        is_completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" }
    );
  }

  if (loading) return <div className="p-10 text-navy/50">Loading lesson…</div>;
  if (!lesson) return <div className="p-10 text-navy/50">Lesson not found, or not unlocked by your plan.</div>;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-navy">{lesson.title}</h1>
        <div className="flex overflow-hidden rounded-full border border-navy/10">
          <button
            onClick={() => setLanguage("en")}
            className={`px-4 py-1.5 text-sm font-semibold ${
              language === "en" ? "bg-royal text-white" : "text-navy/60"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("hi")}
            className={`px-4 py-1.5 text-sm font-semibold ${
              language === "hi" ? "bg-royal text-white" : "text-navy/60"
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      <div className="mt-6">
        <VideoPlayer src={content?.video_url} lessonId={lesson.id} onComplete={markComplete} />
      </div>

      {content?.notes_html && (
        <article
          className="prose prose-sm mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: content.notes_html }}
        />
      )}

      {content?.pdf_url && (
        <a href={content.pdf_url} className="btn-secondary mt-6 inline-flex" target="_blank">
          Download PDF Notes
        </a>
      )}
    </main>
  );
}
