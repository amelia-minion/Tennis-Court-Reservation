"use server";

import { revalidatePath } from "next/cache";
import { isCoachAuthenticated } from "@/lib/coach-auth";
import { supabase } from "@/lib/supabase";

export async function deleteLesson(formData: FormData) {
  if (!(await isCoachAuthenticated())) {
    return;
  }

  const id = formData.get("id") as string;

  if (!id) {
    return;
  }

  const { error } = await supabase.from("lessons").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete lesson:", error);
    return;
  }

  revalidatePath("/coach/dashboard");
  revalidatePath("/courts", "layout");
}
