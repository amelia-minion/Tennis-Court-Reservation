"use server";

import { redirect } from "next/navigation";
import { isCoachAuthenticated } from "@/lib/coach-auth";

export async function ensureGuestCoach() {
  if (await isCoachAuthenticated()) {
    redirect("/coach/dashboard");
  }
}
