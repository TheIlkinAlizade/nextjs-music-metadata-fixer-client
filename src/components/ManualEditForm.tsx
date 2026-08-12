"use client";

import { useState } from "react";

interface ManualEditFormProps {
  file: File;
  onApplied: () => void;
}

export default function ManualEditForm({ file, onApplied }: ManualEditFormProps) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [date, setDate] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setCoverFile(f);
    setCoverPreview(URL.createObjectURL(f));
  }

  async function handleApply() {
    setApplying(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    if (title.trim()) formData.append("title", title.trim());
    if (artist.trim()) formData.append("artist", artist.trim());
    if (album.trim()) formData.append("album", album.trim());
    if (date.trim()) formData.append("date", date.trim());
    if (coverFile) formData.append("cover_art_file", coverFile);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/apply/`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const ext = file.name.split(".").pop();
      link.download = `${artist || "Unknown"} - ${title || file.name}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      onApplied();
    } catch {
      setError("Failed to apply. Try again.");
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: "var(--color-surface)" }}>
      <p className="text-sm font-semibold mb-4">Enter details manually</p>

      <div className="flex gap-4 mb-4">
        <label className="flex-shrink-0 cursor-pointer">
          <div
            className="w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: "var(--color-border)" }}
          >
            {coverPreview ? (
              <img src={coverPreview} className="w-full h-full object-cover" alt="" />
            ) : (
              <span className="text-xs text-center px-1" style={{ color: "var(--color-ink-soft)" }}>
                Add cover
              </span>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleCoverSelect} className="hidden" />
        </label>

        <div className="flex-1 grid grid-cols-2 gap-2">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm bg-transparent"
            style={{ borderColor: "var(--color-border)" }}
          />
          <input
            placeholder="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm bg-transparent"
            style={{ borderColor: "var(--color-border)" }}
          />
          <input
            placeholder="Album"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm bg-transparent"
            style={{ borderColor: "var(--color-border)" }}
          />
          <input
            placeholder="Year"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm bg-transparent"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>
      </div>

      {error && <p className="text-sm mb-2" style={{ color: "var(--color-error)" }}>{error}</p>}

      <button
        onClick={handleApply}
        disabled={applying || (!title && !artist)}
        className="text-sm font-medium px-4 py-2 rounded-full disabled:opacity-40"
        style={{ backgroundColor: "var(--color-amber)", color: "var(--color-bg)" }}
      >
        {applying ? "Applying..." : "Apply and download"}
      </button>
    </div>
  );
}