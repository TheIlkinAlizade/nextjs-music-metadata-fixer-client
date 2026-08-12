"use client";

import { useEffect, useState } from "react";
import type { Match } from "@/src/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface MatchCardProps {
  match: Match;
  onSelect: (match: Match) => void;
}

export default function MatchCard({ match, onSelect }: MatchCardProps) {
  const [coverArtUrl, setCoverArtUrl] = useState<string | null>(match.cover_art_url);
  const [loadingArt, setLoadingArt] = useState(false);

  useEffect(() => {
    if (coverArtUrl || !match.release_id) return;
    let cancelled = false;
    setLoadingArt(true);

    fetch(`${API_URL}/api/cover-art/${match.release_id}/`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.cover_art_url) setCoverArtUrl(data.cover_art_url);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingArt(false);
      });

    return () => { cancelled = true; };
  }, [match.release_id]);

  return (
    <button
      onClick={() => onSelect({ ...match, cover_art_url: coverArtUrl })}
      className="w-full flex items-center gap-4 p-3 rounded-xl text-left transition-all duration-150 group"
      style={{ backgroundColor: "var(--color-surface)" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface)")}
    >
      <div
        className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden shadow-sm"
        style={{ backgroundColor: "var(--color-border)" }}
      >
        {coverArtUrl ? (
          <img src={coverArtUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ opacity: loadingArt ? 0.6 : 0.3 }}>
              <path d="M9 18V5l12-2v13" stroke="var(--color-ink-soft)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="18" r="3" stroke="var(--color-ink-soft)" strokeWidth="1.5" />
              <circle cx="18" cy="16" r="3" stroke="var(--color-ink-soft)" strokeWidth="1.5" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[15px] truncate">{match.title}</p>
        <p className="text-sm truncate mt-0.5" style={{ color: "var(--color-ink-soft)" }}>
          {match.artist}
        </p>
        <p className="text-xs truncate mt-0.5 font-data" style={{ color: "var(--color-ink-soft)", opacity: 0.7 }}>
          {match.album}
        </p>
      </div>

      <div
        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium px-3 py-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: "var(--color-amber-soft)", color: "var(--color-amber)" }}
      >
        Select
      </div>
    </button>
  );
}