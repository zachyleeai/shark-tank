import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createApp, deleteApp } from "./actions";

export default async function AppsPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const apps = await prisma.app.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { features: true } } },
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Apps</h1>
          <p className="mt-1 text-sm text-slate-600">
            Your product list. Pick one to manage features and export a PRD.
          </p>
        </div>
        <details className="relative">
          <summary
            className={cn(
              "list-none cursor-pointer select-none w-full-h-[ md:w-auto min44px]",
              buttonVariants({ variant: "secondary" }),
            )}
          >
            Add app
          </summary>
          <div className="absolute right-0 z-10 mt-2 w-[calc(100vw-2rem)] max-w-[420px] rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
            <form action={createApp} className="grid gap-3">
              <div>
                <div className="text-sm font-medium text-slate-900">New app</div>
                <div className="mt-1 text-xs text-slate-500">
                  Keep it short. You can rename later.
                </div>
              </div>
              <Input name="name" placeholder="e.g., Shopfloor QA" required />
              <div className="flex justify-end gap-2">
                <Button type="submit">Create</Button>
              </div>
            </form>
          </div>
        </details>
      </div>

      {searchParams?.error === "duplicate" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          That app name already exists. Pick a different name.
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((a) => (
          <div
            key={a.id}
            className="group rounded-xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm hover:border-slate-300 min-h-[44px]"
          >
            <div className="flex items-start justify-between">
              <Link href={`/apps/${a.id}`} className="flex-1">
                <div className="text-sm font-medium text-slate-900 group-hover:underline">
                  {a.name}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {a._count.features} feature{a._count.features === 1 ? "" : "s"}
                </div>
              </Link>
              <form action={deleteApp.bind(null, a.id)}>
                <input type="hidden" name="appId" value={a.id} />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Delete
                </Button>
              </form>
            </div>
          </div>
        ))}

        {!apps.length && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="text-sm font-medium">No apps yet</div>
            <div className="mt-1 text-sm text-slate-600">
              Run <code className="rounded bg-slate-100 px-1">npm run db:seed</code>
              to preload apps.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
