export interface Match {
  mbid: string | null;
  title: string | null;
  artist: string | null;
  album: string | null;
  release_id: string | null;
  score: string | null;
  cover_art_url: string | null;
}

export interface ReadResult {
  tags: {
    title: string | null;
    artist: string | null;
    album: string | null;
    date: string | null;
    tracknumber: string | null;
  };
  has_cover_art: boolean;
  format: string | null;
  length_seconds: number | null;
}

export interface AutoSearchResult {
  existing_tags: ReadResult;
  query_used: string | null;
  matches: Match[];
}