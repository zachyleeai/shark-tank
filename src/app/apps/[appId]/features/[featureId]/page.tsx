import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateFeature } from "../../actions";

export default async function FeatureEditPage({
  params,
}: {
  params: Promise<{ appId: string; featureId: string }>;
}) {
  const { appId, featureId } = await params;

  const feature = await prisma.feature.findUnique({ where: { id: featureId } });
  if (!feature) notFound();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs font-medium text-slate-500">Feature</div>
          <h1 className="mt-1 text-xl md:text-2xl font-semibold tracking-tight">
            Edit
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Update the details. Changes are saved on submit.
          </p>
        </div>
        <Link href={`/apps/${appId}`}>
          <Button variant="secondary" className="min-h-[44px]">Back</Button>
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 md:p-4 lg:p-6 shadow-sm">
        <form
          action={updateFeature.bind(null, appId, featureId)}
          className="grid gap-3"
        >
          <div className="grid gap-2">
            <label className="text-xs font-medium text-slate-600">Title</label>
            <Input name="title" defaultValue={feature.title} />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-xs font-medium text-slate-600">Priority</label>
              <select
                name="priority"
                defaultValue={feature.priority}
                className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-medium text-slate-600">Status</label>
              <select
                name="status"
                defaultValue={feature.status}
                className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="IDEA">Idea</option>
                <option value="PLANNED">Planned</option>
                <option value="IN_DEV">In dev</option>
                <option value="SHIPPED">Shipped</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-xs font-medium text-slate-600">Problem</label>
              <Textarea name="problem" defaultValue={feature.problem || ""} />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-medium text-slate-600">User</label>
              <Textarea name="user" defaultValue={feature.user || ""} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-xs font-medium text-slate-600">Value</label>
              <Textarea name="value" defaultValue={feature.value || ""} />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-medium text-slate-600">Notes</label>
              <Textarea name="notes" defaultValue={feature.notes || ""} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Link href={`/apps/${appId}`}>
              <Button type="button" variant="secondary" className="w-full sm:w-auto min-h-[44px]">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="w-full sm:w-auto min-h-[44px]">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
