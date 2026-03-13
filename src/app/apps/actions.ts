"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function getString(formData: FormData, key: string) {
  const v = formData.get(key);
  if (typeof v !== "string") return "";
  return v.trim();
}

export async function createApp(formData: FormData) {
  const name = getString(formData, "name");
  if (!name) redirect("/apps");

  try {
    await prisma.app.create({ data: { name } });
  } catch (e: any) {
    // Prisma unique constraint violation
    if (e?.code === "P2002") {
      redirect("/apps?error=duplicate");
    }
    throw e;
  }

  revalidatePath("/apps");
  redirect("/apps");
}

export async function deleteApp(appId: string) {
  try {
    await prisma.app.delete({ where: { id: appId } });
  } catch (e: any) {
    // If it's already gone, treat as success.
    if (e?.code !== "P2025") throw e;
  }

  revalidatePath("/apps");
  redirect("/apps");
}
