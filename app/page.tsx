"use client";

import { useState } from "react";
import SingleFileFlow from "@/src/components/SingleFileFlow";
import BatchFlow from "@/src/components/BatchFlow";
import ThemeToggle from "@/src/components/ThemeToggle";

export default function Home() {
  const [mode, setMode] = useState<"single" | "batch">("single");

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ backgroundColor: "var(--color-amber)" }}
      />

      <main className="relative max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Music Metadata Fixer</h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-ink-soft)" }}>
              Fix missing tags and cover art on your local files
            </p>
          </div>
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
    </div>
  );
}