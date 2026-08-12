"use client";

import { useState, useEffect, useRef } from "react";
import MatchCard from "@/src/components/MatchCard";
import type { Match } from "@/src/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ManualEntryFormProps {
  onSelect: (match: Match) => void;
}

export default function ManualEntryForm({ onSelect }: ManualEntryFormProps) {
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!title.trim()) {
      setMatches([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/search/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            manual_artist: artist.trim() || undefined,
            manual_title: title.trim(),
          }),
        });
        const data = await res.json();
        setMatches(data.matches ?? []);
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [artist, title]);

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Artist (optional)"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="flex-1 border rounded px-3 py-2 bg-transparent"
        />
        <input
          type="text"
          placeholder="Song title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border rounded px-3 py-2 bg-transparent"
        />
      </div>

      {loading && <p className="text-sm text-blue-600 mb-2">Searching...</p>}

      <div className="space-y-2">
        {matches.map((match) => (
          <MatchCard key={match.mbid} match={match} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}