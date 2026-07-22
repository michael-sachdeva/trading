import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { planSlug } = await request.json();

  const { data: plan, error: planErr } = await supabase
    .from("plans")
    .select("*")
    .eq("slug", planSlug)
    .single();

  if (planErr || !plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 400 });
  }

  if (Number(plan.price_inr) > 0) {
    return NextResponse.json(
      { error: "This plan requires payment and cannot be enrolled for free." },
      { status: 400 }
    );
  }

  const { data: existing } = await supabase
    .from("enrollments")
    .select("*, plans(*)")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();

  if (existing && Number((existing.plans as any).price_inr) > 0) {
    return NextResponse.json(
      { error: "You already have a paid plan active." },
      { status: 400 }
    );
  }

  const { error: enrollErr } = await supabase.from("enrollments").upsert(
    { user_id: user.id, plan_id: plan.id, active: true },
    { onConflict: "user_id" }
  );

  if (enrollErr) {
    return NextResponse.json({ error: enrollErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}