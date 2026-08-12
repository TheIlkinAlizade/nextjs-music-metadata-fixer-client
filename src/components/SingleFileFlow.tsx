"use client";

import { useState } from "react";
import FileDropzone from "@/src/components/FileDropzone";
import MatchCard from "@/src/components/MatchCard";
import ManualEntryForm from "@/src/components/ManualEntryForm";
import ManualEditForm from "@/src/components/ManualEditForm";
import LoadingBars from "@/src/components/LoadingBars";
import { autoSearch, applyMetadata } from "@/src/lib/api";
import type { AutoSearchResult, Match } from "@/src/lib/types";

export default function SingleFileFlow() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AutoSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState<"search" | "edit">("search");
  const [pendingMatch, setPendingMatch] = useState<Match | null>(null);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  async function handleFilesSelected(files: File[]) {
    const selected = files[0];
    setFile(selected);
    setResult(null);
    setError(null);
    setPendingMatch(null);
    setLoading(true);

    try {
      const data = await autoSearch(selected);
      setResult(data);
    } catch {
      setError("Failed to search for this file. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handlePickMatch(match: Match) {
    setPendingMatch(match);
  }

  async function confirmApply() {
    if (!file || !pendingMatch) return;
    setApplying(true);
    setApplyError(null);

    try {
      const blob = await applyMetadata(file, {
        title: pendingMatch.title ?? undefined,
        artist: pendingMatch.artist ?? undefined,
        album: pendingMatch.album ?? undefined,
        cover_art_url: pendingMatch.cover_art_url ?? undefined,
      });

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const extension = file.name.split(".").pop();
      link.download = `${pendingMatch.artist} - ${pendingMatch.title}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setPendingMatch(null);
    } catch {
      setApplyError("Failed to apply metadata. Try again.");
    } finally {
      setApplying(false);
    }
  }

  const missingFields: string[] = [];
  if (pendingMatch) {
    if (!pendingMatch.cover_art_url) missingFields.push("cover art");
    if (!pendingMatch.album) missingFields.push("album");
  }

  return (
    <div className="space-y-4">
      <FileDropzone onFilesSelected={handleFilesSelected} multiple={false} />

      {file && (
        <p className="text-sm font-data" style={{ color: "var(--color-ink-soft)" }}>
          {file.name}
        </p>
      )}

      {loading && <LoadingBars label="Searching for matches..." />}
      {error && <p className="text-sm" style={{ color: "var(--color-error)" }}>{error}</p>}

      {result && !loading && (
        <div>
          {result.matches.length > 0 ? (
            <>
              <p className="text-sm mb-3" style={{ color: "var(--color-ink-soft)" }}>
                Found {result.matches.length} possible match{result.matches.length > 1 ? "es" : ""}
              </p>
              <div className="space-y-2">
                {result.matches.map((match) => (
                  <MatchCard key={match.mbid} match={match} onSelect={handlePickMatch} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-xl p-5" style={{ backgroundColor: "var(--color-surface)" }}>
              <p className="text-sm mb-4" style={{ color: "var(--color-ink-soft)" }}>
                No automatic matches found for this file.
              </p>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setManualMode("search")}
                  className="text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: manualMode === "search" ? "var(--color-amber-soft)" : "transparent",
                    color: manualMode === "search" ? "var(--color-amber)" : "var(--color-ink-soft)",
                    border: `1px solid ${manualMode === "search" ? "transparent" : "var(--color-border)"}`,
                  }}
                >
                  Search MusicBrainz
                </button>
                <button
                  onClick={() => setManualMode("edit")}
                  className="text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: manualMode === "edit" ? "var(--color-amber-soft)" : "transparent",
                    color: manualMode === "edit" ? "var(--color-amber)" : "var(--color-ink-soft)",
                    border: `1px solid ${manualMode === "edit" ? "transparent" : "var(--color-border)"}`,
                  }}
                >
                  Enter manually
                </button>
              </div>

              {manualMode === "search" ? (
                <ManualEntryForm onSelect={handlePickMatch} />
              ) : (
                file && <ManualEditForm file={file} onApplied={() => setFile(null)} />
              )}
            </div>
          )}
        </div>
      )}

      {pendingMatch && (
        <div
          className="fixed inset-0 flex items-center justify-center p-6 z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setPendingMatch(null)}
        >
          <div
            className="rounded-xl p-6 max-w-sm w-full"
            style={{ backgroundColor: "var(--color-surface)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold mb-1">{pendingMatch.title}</p>
            <p className="text-sm mb-4" style={{ color: "var(--color-ink-soft)" }}>
              {pendingMatch.artist} — {pendingMatch.album ?? "Unknown album"}
            </p>

            {missingFields.length > 0 && (
              <p
                className="text-xs mb-4 px-3 py-2 rounded-lg"
                style={{ backgroundColor: "var(--color-amber-soft)", color: "var(--color-amber)" }}
              >
                Note: this match is missing {missingFields.join(" and ")}. It won't be added to the file.
              </p>
            )}

            {applyError && (
              <p className="text-sm mb-3" style={{ color: "var(--color-error)" }}>{applyError}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={confirmApply}
                disabled={applying}
                className="flex-1 text-sm font-medium py-2 rounded-full disabled:opacity-50"
                style={{ backgroundColor: "var(--color-amber)", color: "var(--color-bg)" }}
              >
                {applying ? "Applying..." : "Confirm and download"}
              </button>
              <button
                onClick={() => setPendingMatch(null)}
                className="text-sm font-medium py-2 px-4 rounded-full border"
                style={{ borderColor: "var(--color-border)", color: "var(--color-ink-soft)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}