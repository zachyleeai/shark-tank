import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";

function mdEscape(s: string) {
  return s.replaceAll("\r\n", "\n");
}

export default async function ExportPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  const app = await prisma.app.findUnique({ where: { id: appId } });
  if (!app) notFound();

  const features = await prisma.feature.findMany({
    where: { appId },
    orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
  });

  const requirements = features
    .filter((f) => f.status !== "SHIPPED")
    .map((f, idx) => {
      const bits = [
        f.problem ? `Problem: ${f.problem}` : null,
        f.user ? `User: ${f.user}` : null,
        f.value ? `Value: ${f.value}` : null,
      ].filter(Boolean);
      return `### R${idx + 1}. ${f.title}\n\n- Priority: **${f.priority}**\n- Status: **${f.status.replace("_", " ")}**\n${bits.length ? `\n${bits.map((b) => `- ${b}`).join("\n")}` : ""}\n`;
    })
    .join("\n");

  const md = mdEscape(`# ${app.name} — PRD\n\n## 1) Summary\nWrite a 2–3 line summary here.\n\n## 2) Problem\nDescribe the problem and why it matters.\n\n## 3) Users / Stakeholders\n- Primary user(s):\n- Secondary stakeholder(s):\n\n## 4) Scope\nWhat’s in v1.\n\n## 5) Non-goals\nWhat we explicitly will not do in v1.\n\n## 6) Requirements\n${requirements || "(No features yet)"}\n\n## 7) Metrics\n- North star metric:\n- Guardrails:\n\n## 8) Risks & Mitigations\n- Risk:\n  - Mitigation:\n\n## 9) Open Questions\n- \n`);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs font-medium text-slate-500">Export</div>
          <h1 className="mt-1 text-xl md:text-2xl font-semibold tracking-tight">PRD</h1>
          <p className="mt-1 text-sm text-slate-600">
            Copy/paste this Markdown into Docs, GitHub, or your PRD system.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/apps/${appId}`}>
            <Button variant="secondary" className="min-h-[44px]">Back</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 px-3 md:px-4 py-3">
          <div className="text-sm font-medium text-slate-900 truncate">
            {app.name} PRD (Markdown)
          </div>
          <CopyButton text={md} />
        </div>
        <pre className="max-h-[50vh] md:max-h-[70vh] overflow-auto p-3 md:p-4 text-xs leading-relaxed whitespace-pre-wrap break-words">
          {md}
        </pre>
      </div>

      <p className="text-xs text-slate-500">
        Tip: Once you start using GitHub for your PRD, we can auto-commit exports.
      </p>
    </div>
  );
}
