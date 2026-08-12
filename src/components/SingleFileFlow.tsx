"use client";

import { useState } from "react";
import FileDropzone from "@/src/components/FileDropzone";
import { autoSearch, applyMetadata } from "@/src/lib/api";
import type { AutoSearchResult } from "@/src/lib/types";
import MatchCard from "@/src/components/MatchCard";
import ManualEntryForm from "@/src/components/ManualEntryForm";
import type { Match } from "@/src/lib/types";
import LoadingBars from "./LoadingBars";

export default function SingleFileFlow() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AutoSearchResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [applying, setApplying] = useState(false);
    const [applyError, setApplyError] = useState<string | null>(null);

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

    async function handleSelectMatch(match: Match) {
        if (!file) return;

        setApplying(true);
        setApplyError(null);

        try {
            const blob = await applyMetadata(file, {
                title: match.title ?? undefined,
                artist: match.artist ?? undefined,
                album: match.album ?? undefined,
                cover_art_url: match.cover_art_url ?? undefined,
            });

            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;

            const extension = file.name.split(".").pop();
            const cleanName = `${match.artist} - ${match.title}.${extension}`;
            link.download = cleanName;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            setApplyError("Failed to apply metadata. Try again.");
        } finally {
            setApplying(false);
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

            {loading && <LoadingBars label="Searching for matches..." />}

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            {result && !loading && (
                <div className="mt-6">
                        {result.matches.length === 0 ? (
                        <div>
                            <p className="text-sm text-gray-600 mb-3">
                            No matches found automatically. Search manually:
                            </p>
                            <ManualEntryForm onSelect={handleSelectMatch} />
                        </div>
                        ) : (
                        <div>
                            <p className="text-sm text-gray-600 mb-3">
                                Found {result.matches.length} possible match{result.matches.length > 1 ? "es" : ""}:
                            </p>
                            <div className="space-y-2">
                                {result.matches.map((match) => (
                                    <MatchCard
                                        key={match.mbid}
                                        match={match}
                                        onSelect={handleSelectMatch}
                                    />
                                ))}
                                {applying && <LoadingBars label="Applying metadata..." />}
                                {applyError && <p className="mt-4 text-sm text-red-600">{applyError}</p>}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}