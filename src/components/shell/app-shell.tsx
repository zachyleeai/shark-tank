import { Sidebar } from "@/components/shell/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="flex h-full">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
