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
        if (!cancelled && data.cover_art_url) {
          setCoverArtUrl(data.cover_art_url);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingArt(false);
      });

    return () => {
      cancelled = true;
    };
  }, [match.release_id]);

  return (
    <div
      onClick={() => onSelect({ ...match, cover_art_url: coverArtUrl })}
      className="flex gap-4 border rounded p-3 cursor-pointer hover:bg-gray-900 transition-colors"
    >
      <div className="w-16 h-16 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
        {coverArtUrl ? (
          <img
            src={coverArtUrl}
            alt={match.album ?? "Cover art"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
            {loadingArt ? "..." : "No art"}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{match.title}</p>
        <p className="text-sm text-gray-400 truncate">
          {match.artist} — {match.album}
        </p>
      </div>
    </div>
  );
}