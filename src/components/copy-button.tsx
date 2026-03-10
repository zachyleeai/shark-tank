"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
      setTimeout(() => setState("idle"), 1200);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 1500);
    }
  }

  return (
    <Button type="button" variant="secondary" onClick={onCopy}>
      {state === "copied" ? "Copied" : state === "error" ? "Copy failed" : "Copy"}
    </Button>
  );
}
