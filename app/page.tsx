"use client";

import { useState } from "react";
import SingleFileFlow from "@/src/components/SingleFileFlow";
import BatchFlow from "@/src/components/BatchFlow";

export default function Home() {
  const [mode, setMode] = useState<"single" | "batch">("single");

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Music Metadata & Cover Art Fixer</h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setMode("single")}
          className={mode === "single" ? "font-bold underline" : ""}
        >
          Single File
        </button>
        <button
          onClick={() => setMode("batch")}
          className={mode === "batch" ? "font-bold underline" : ""}
        >
          Batch
        </button>
      </div>

      {mode === "single" ? <SingleFileFlow /> : <BatchFlow />}
    </main>
  );
}