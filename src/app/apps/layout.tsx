import { AppShell } from "@/components/shell/app-shell";

// This section depends on the database; don't try to pre-render at build time.
export const dynamic = "force-dynamic";

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
