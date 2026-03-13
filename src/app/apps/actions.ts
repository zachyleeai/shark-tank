"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function getString(formData: FormData, key: string) {
  const v = formData.get(key);
  if (typeof v !== "string") return "";
  return v.trim();
}

export async function createApp(formData: FormData) {
  const name = getString(formData, "name");
  if (!name) return;

  await prisma.app.create({ data: { name } });
  revalidatePath("/apps");
}

export async function deleteApp(appId: string) {
  await prisma.app.delete({ where: { id: appId } });
  revalidatePath("/apps");
}
