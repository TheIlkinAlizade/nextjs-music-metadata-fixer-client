"use client";

import { useState } from "react";
import FileDropzone from "@/src/components/FileDropzone";
import { autoSearch } from "@/src/lib/api";
import type { AutoSearchResult } from "@/src/lib/types";

export default function SingleFileFlow() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AutoSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFilesSelected(files: File[]) {
    const selected = files[0];
    setFile(selected);
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const data = await autoSearch(selected);
      setResult(data);
    } catch (err) {
      setError("Failed to search for this file. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <FileDropzone onFilesSelected={handleFilesSelected} multiple={false} />

      {file && (
        <p className="mt-4 text-sm text-gray-700">
          Selected: <span className="font-medium">{file.name}</span>
        </p>
      )}

      {loading && <p className="mt-4 text-sm text-blue-600">Searching for matches...</p>}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && !loading && (
        <div className="mt-6">
          {result.matches.length === 0 ? (
            <p className="text-sm text-gray-600">
              No matches found automatically. Manual search coming soon.
            </p>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Found {result.matches.length} possible match{result.matches.length > 1 ? "es" : ""}:
              </p>
              <ul className="space-y-2">
                {result.matches.map((match) => (
                  <li key={match.mbid} className="border rounded p-3">
                    <p className="font-medium">{match.title}</p>
                    <p className="text-sm text-gray-600">{match.artist} — {match.album}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}