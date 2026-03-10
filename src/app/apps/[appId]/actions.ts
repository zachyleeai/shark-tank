"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { FeaturePriority, FeatureStatus } from "@prisma/client";

function getString(formData: FormData, key: string) {
  const v = formData.get(key);
  if (typeof v !== "string") return "";
  return v.trim();
}

export async function createFeature(appId: string, formData: FormData) {
  const title = getString(formData, "title");
  if (!title) return;

  const problem = getString(formData, "problem") || null;
  const user = getString(formData, "user") || null;
  const value = getString(formData, "value") || null;
  const notes = getString(formData, "notes") || null;

  const priority = (getString(formData, "priority") as FeaturePriority) || "P2";
  const status = (getString(formData, "status") as FeatureStatus) || "IDEA";

  await prisma.feature.create({
    data: {
      appId,
      title,
      problem,
      user,
      value,
      notes,
      priority,
      status,
    },
  });

  revalidatePath(`/apps/${appId}`);
}

export async function deleteFeature(appId: string, featureId: string) {
  await prisma.feature.delete({ where: { id: featureId } });
  revalidatePath(`/apps/${appId}`);
}

export async function updateFeature(
  appId: string,
  featureId: string,
  formData: FormData,
) {
  const title = getString(formData, "title");
  const problem = getString(formData, "problem") || null;
  const user = getString(formData, "user") || null;
  const value = getString(formData, "value") || null;
  const notes = getString(formData, "notes") || null;

  const priority = (getString(formData, "priority") as FeaturePriority) || "P2";
  const status = (getString(formData, "status") as FeatureStatus) || "IDEA";

  await prisma.feature.update({
    where: { id: featureId },
    data: { title, problem, user, value, notes, priority, status },
  });

  revalidatePath(`/apps/${appId}`);
}
