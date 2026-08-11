"use client";

import type { Match } from "@/src/lib/types";

interface MatchCardProps {
  match: Match;
  onSelect: (match: Match) => void;
}

export default function MatchCard({ match, onSelect }: MatchCardProps) {
  return (
    <div
      onClick={() => onSelect(match)}
      className="flex gap-4 border rounded p-3 cursor-pointer hover:bg-gray-900 transition-colors"
    >
      <div className="w-16 h-16 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
        {match.cover_art_url ? (
          <img
            src={match.cover_art_url}
            alt={match.album ?? "Cover art"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
            No art
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