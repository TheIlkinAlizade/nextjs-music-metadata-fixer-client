"use client";

import { useState } from "react";
import SingleFileFlow from "@/src/components/SingleFileFlow";
import BatchFlow from "@/src/components/BatchFlow";
import ThemeToggle from "@/src/components/ThemeToggle";

export default function Home() {
  const [mode, setMode] = useState<"single" | "batch">("single");

  return (
    <main className="max-w-3xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Music Metadata & Cover Art Fixer</h1>
        <ThemeToggle />
      </div>

      <div className="flex gap-6 mb-8 border-b" style={{ borderColor: "var(--color-border)" }}>
        <button
          onClick={() => setMode("single")}
          className="pb-3 text-sm font-medium transition-colors"
          style={{
            color: mode === "single" ? "var(--color-amber)" : "var(--color-ink-soft)",
            borderBottom: mode === "single" ? "2px solid var(--color-amber)" : "2px solid transparent",
          }}
        >
          Single File
        </button>
        <button
          onClick={() => setMode("batch")}
          className="pb-3 text-sm font-medium transition-colors"
          style={{
            color: mode === "batch" ? "var(--color-amber)" : "var(--color-ink-soft)",
            borderBottom: mode === "batch" ? "2px solid var(--color-amber)" : "2px solid transparent",
          }}
        >
          Batch
        </button>
      </div>

      {mode === "single" ? <SingleFileFlow /> : <BatchFlow />}
    </main>
  );
}