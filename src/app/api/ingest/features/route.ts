import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type FeatureIn = {
  title: string;
  notes?: string;
  priority?: "P1" | "P2" | "P3";
};

type Body = {
  appName: string;
  features: FeatureIn[];
  source?: string;
};

function norm(s: string) {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

export async function POST(req: Request) {
  const token = process.env.SHARK_TANK_INGEST_TOKEN;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Server missing SHARK_TANK_INGEST_TOKEN" },
      { status: 500 },
    );
  }

  const auth = req.headers.get("authorization") || "";
  const provided = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";
  if (provided !== token) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const appName = (body.appName || "").trim();
  const features = Array.isArray(body.features) ? body.features : [];

  if (!appName) {
    return NextResponse.json({ ok: false, error: "appName required" }, { status: 400 });
  }

  const cleaned = features
    .map((f) => ({
      title: (f?.title || "").trim(),
      notes: (f?.notes || "").trim() || undefined,
      priority: f?.priority,
    }))
    .filter((f) => f.title.length > 0);

  if (!cleaned.length) {
    return NextResponse.json({ ok: true, created: 0, skipped: 0, appName });
  }

  // Option 1: auto-create app if missing.
  const app = await prisma.app.upsert({
    where: { name: appName },
    update: {},
    create: { name: appName },
  });

  const existing = await prisma.feature.findMany({
    where: { appId: app.id },
    select: { title: true },
  });
  const existingSet = new Set(existing.map((e) => norm(e.title)));

  const toCreate = cleaned.filter((f) => !existingSet.has(norm(f.title)));

  if (!toCreate.length) {
    return NextResponse.json({ ok: true, created: 0, skipped: cleaned.length, appName });
  }

  const created = await prisma.feature.createMany({
    data: toCreate.map((f) => ({
      appId: app.id,
      title: f.title,
      notes: f.notes,
      priority: f.priority,
      status: "IDEA",
    })),
  });

  return NextResponse.json({
    ok: true,
    appName,
    created: created.count,
    skipped: cleaned.length - created.count,
    source: body.source,
  });
}
