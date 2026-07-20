import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
/**
 * Seed script — run with `npm run seed` after applying supabase/schema.sql.
 * Requires SUPABASE_SERVICE_ROLE_KEY (never expose this to the client).
 */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data: plans, error: planErr } = await supabase
    .from("plans")
    .upsert(
      [
        {
          slug: "basic",
          name: "Basic",
          tier: 1,
          price_inr: 999,
          description: "Beginner-friendly foundation course in Hindi & English.",
          features: [
            "Beginner Course",
            "Hindi + English Videos",
            "PDF Notes",
            "Quizzes",
            "Lifetime Access",
            "Completion Certificate",
          ],
        },
        {
          slug: "advanced",
          name: "Advanced",
          tier: 2,
          price_inr: 4999,
          description: "Everything in Basic, plus technical analysis and strategy building.",
          features: [
            "Everything in Basic",
            "Advanced Technical Analysis",
            "Price Action & Volume Analysis",
            "Options Buying & Selling Strategies",
            "Swing / Intraday / Futures",
            "Case Studies & Assignments",
          ],
        },
        {
          slug: "master",
          name: "Master AI Program",
          tier: 3,
          price_inr: 9999,
          description: "The complete program with AI tools and global markets.",
          features: [
            "Everything in Advanced",
            "100+ Hours Video Library",
            "AI Trading Assistant & Chat Tutor",
            "Trading Journal & Strategy Builder",
            "Institutional Concepts",
            "Global Markets: US, India, Forex, Commodities",
            "Weekly Live Classes (coming soon)",
          ],
        },
      ],
      { onConflict: "slug" }
    )
    .select();

  if (planErr) throw planErr;
  console.log(`Seeded ${plans?.length} plans`);

  const { data: course, error: courseErr } = await supabase
    .from("courses")
    .upsert(
      {
        slug: "stock-market-foundations",
        title: "Stock Market Foundations",
        short_description: "Start from zero: Demat accounts, candlesticks, support & resistance.",
        min_plan_tier: 1,
        is_published: true,
        sort_order: 1,
      },
      { onConflict: "slug" }
    )
    .select()
    .single();

  if (courseErr) throw courseErr;
  console.log(`Seeded course: ${course?.title}`);

  const { data: mod, error: modErr } = await supabase
    .from("modules")
    .insert({ course_id: course.id, title: "Module 1: Getting Started", sort_order: 1 })
    .select()
    .single();
  if (modErr) throw modErr;

  const { data: lesson, error: lessonErr } = await supabase
    .from("lessons")
    .insert({
      module_id: mod.id,
      slug: "what-is-a-demat-account",
      title: "What is a Demat Account?",
      summary: "Understand what a Demat account is and why you need one to trade.",
      sort_order: 1,
      is_preview: true,
    })
    .select()
    .single();
  if (lessonErr) throw lessonErr;

  await supabase.from("lesson_content").insert([
    {
      lesson_id: lesson.id,
      language: "en",
      notes_html: "<p>A Demat account holds your shares electronically...</p>",
    },
    {
      lesson_id: lesson.id,
      language: "hi",
      notes_html: "<p>डीमैट खाता आपके शेयरों को इलेक्ट्रॉनिक रूप में रखता है...</p>",
    },
  ]);

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

