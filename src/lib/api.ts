const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function readMetadata(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/read/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to read file metadata");
  }

  return res.json();
}

export async function autoSearch(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/auto-search/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to search for matches");
  }

  return res.json();
}

export async function applyMetadata(
  file: File,
  metadata: { title?: string; artist?: string; album?: string; date?: string; cover_art_url?: string }
) {
  const formData = new FormData();
  formData.append("file", file);

  if (metadata.title) formData.append("title", metadata.title);
  if (metadata.artist) formData.append("artist", metadata.artist);
  if (metadata.album) formData.append("album", metadata.album);
  if (metadata.date) formData.append("date", metadata.date);
  if (metadata.cover_art_url) formData.append("cover_art_url", metadata.cover_art_url);

  const res = await fetch(`${API_URL}/api/apply/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to apply metadata");
  }

  return res.blob();
}