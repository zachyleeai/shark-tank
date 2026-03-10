import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createFeature, deleteFeature } from "./actions";

import { FeaturePriority, FeatureStatus } from "@prisma/client";

function priorityBadgeVariant(p: FeaturePriority) {
  if (p === "P1") return "danger";
  if (p === "P2") return "warning";
  return "default";
}

function statusBadgeVariant(s: FeatureStatus) {
  if (s === "SHIPPED") return "success";
  if (s === "IN_DEV") return "warning";
  return "default";
}

export default async function AppPage({
  params,
  searchParams,
}: {
  params: Promise<{ appId: string }>;
  searchParams: Promise<{ q?: string; priority?: string; status?: string }>;
}) {
  const { appId } = await params;
  const sp = await searchParams;

  const q = (sp.q || "").trim();
  const priority = (sp.priority || "").trim();
  const status = (sp.status || "").trim();

  const app = await prisma.app.findUnique({ where: { id: appId } });
  if (!app) notFound();

  const where: Record<string, unknown> = { appId };
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { problem: { contains: q } },
      { user: { contains: q } },
      { value: { contains: q } },
      { notes: { contains: q } },
    ];
  }
  if (priority) where.priority = priority;
  if (status) where.status = status;

  const features = await prisma.feature.findMany({
    where,
    orderBy: [{ priority: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs font-medium text-slate-500">App</div>
          <h1 className="mt-1 text-xl md:text-2xl font-semibold tracking-tight">
            {app.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage features and export a PRD.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/apps/${appId}/export`}>
            <Button>Export PRD</Button>
          </Link>
        </div>
      </div>

      <details className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <summary className="cursor-pointer select-none text-sm font-medium text-slate-900">
          Add feature
        </summary>
        <div className="mt-4">
          <form action={createFeature.bind(null, appId)} className="grid gap-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-xs font-medium text-slate-600">
                  Title
                </label>
                <Input name="title" placeholder="e.g., Stakeholder Lens mode" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <label className="text-xs font-medium text-slate-600">
                    Priority
                  </label>
                  <select
                    name="priority"
                    defaultValue="P2"
                    className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
                  >
                    <option value="P1">P1</option>
                    <option value="P2">P2</option>
                    <option value="P3">P3</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-medium text-slate-600">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue="IDEA"
                    className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
                  >
                    <option value="IDEA">Idea</option>
                    <option value="PLANNED">Planned</option>
                    <option value="IN_DEV">In dev</option>
                    <option value="SHIPPED">Shipped</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-xs font-medium text-slate-600">
                  Problem
                </label>
                <Textarea name="problem" placeholder="What pain does this solve?" />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-medium text-slate-600">User</label>
                <Textarea
                  name="user"
                  placeholder="Who is this for (persona/stakeholder)?"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-xs font-medium text-slate-600">Value</label>
                <Textarea
                  name="value"
                  placeholder="Why it matters (impact / metric)"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-medium text-slate-600">Notes</label>
                <Textarea name="notes" placeholder="Anything else" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </div>
      </details>

      <div className="rounded-xl border border-slate-200 bg-white p-3 md:p-4 shadow-sm">
        <div className="border-b border-slate-200 pb-3 md:pb-4 mb-3 md:mb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm font-medium">Features</div>
            <form className="flex flex-wrap items-center gap-2" method="get">
              <Input
                name="q"
                defaultValue={q}
                placeholder="Search"
                className="w-full md:w-40 lg:w-56"
              />
              <select
                name="priority"
                defaultValue={priority}
                className="h-9 min-w-[100px] rounded-md border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="">All priorities</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
              </select>
              <select
                name="status"
                defaultValue={status}
                className="h-9 min-w-[100px] rounded-md border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="">All statuses</option>
                <option value="IDEA">Idea</option>
                <option value="PLANNED">Planned</option>
                <option value="IN_DEV">In dev</option>
                <option value="SHIPPED">Shipped</option>
              </select>
              <div className="flex gap-2 w-full md:w-auto">
                <Button variant="secondary" type="submit">
                  Apply
                </Button>
                <Link href={`/apps/${appId}`} className="text-sm text-slate-600 h-9 flex items-center">
                  Reset
                </Link>
              </div>
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {features.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50 min-h-[44px]">
                  <td className="px-3 md:px-4 py-3">
                    <div className="font-medium text-slate-900">{f.title}</div>
                    <div className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                      {(f.problem || f.value || f.user || "").slice(0, 140)}
                    </div>
                  </td>
                  <td className="px-3 md:px-4 py-3">
                    <Badge variant={priorityBadgeVariant(f.priority)}>
                      {f.priority}
                    </Badge>
                  </td>
                  <td className="px-3 md:px-4 py-3">
                    <Badge variant={statusBadgeVariant(f.status)}>
                      {f.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-3 md:px-4 py-3 text-xs text-slate-600 hidden md:table-cell">
                    {new Date(f.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-3 md:px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/apps/${appId}/features/${f.id}`}
                        className="text-xs text-slate-700 hover:underline min-h-[44px] flex items-center px-2 -mx-2"
                      >
                        Edit
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteFeature(appId, f.id);
                        }}
                      >
                        <button className="text-xs text-red-700 hover:underline min-h-[44px] flex items-center px-2 -mx-2">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}

              {!features.length && (
                <tr>
                  <td className="px-4 py-8 text-center text-sm text-slate-600" colSpan={5}>
                    No features yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
