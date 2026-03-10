import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export async function Sidebar({ className }: { className?: string }) {
  const apps = await prisma.app.findMany({ orderBy: { name: "asc" } });

  return (
    <aside
      className={cn(
        "hidden md:flex h-full w-64 flex-col border-r border-slate-200 bg-white",
        className,
      )}
    >
      <div className="px-5 py-4">
        <div className="text-sm font-semibold tracking-tight text-slate-900">
          Shark Tank
        </div>
        <div className="text-xs text-slate-500">PRD hub</div>
      </div>

      <div className="mt-4 px-5">
        <Link
          href="/apps"
          className="text-sm font-semibold text-slate-900 hover:text-slate-700"
        >
          Apps
        </Link>
      </div>
      <div className="mt-2 flex-1 overflow-y-auto px-2 pb-4">
        <nav className="space-y-1">
          {apps.map((a) => (
            <Link
              key={a.id}
              href={`/apps/${a.id}`}
              className="block truncate rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              title={a.name}
            >
              {a.name}
            </Link>
          ))}
          {!apps.length && (
            <div className="px-3 py-2 text-sm text-slate-500">
              No apps yet.
            </div>
          )}
        </nav>
      </div>

      <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
        Localhost-only
      </div>
    </aside>
  );
}
