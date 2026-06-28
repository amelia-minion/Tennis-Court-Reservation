"use server";

import { redirect } from "next/navigation";
import {
  createCoachSession,
  isCoachAuthenticated,
  verifyCoachCredentials,
} from "@/lib/coach-auth";

export async function loginCoach(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/coach/login?error=missing");
  }

  if (!verifyCoachCredentials(email, password)) {
    redirect("/coach/login?error=invalid");
  }

  await createCoachSession(email);
  redirect("/coach/dashboard");
}

export async function ensureGuestCoach() {
  if (await isCoachAuthenticated()) {
    redirect("/coach/dashboard");
  }
}
