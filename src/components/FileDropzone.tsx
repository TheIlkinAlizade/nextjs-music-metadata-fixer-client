"use client";

import { useState, useRef } from "react";

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
}

export default function FileDropzone({ onFilesSelected, multiple = false }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.name.toLowerCase().endsWith(".mp3") || f.name.toLowerCase().endsWith(".flac")
    );

    if (files.length > 0) {
      onFilesSelected(files);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      onFilesSelected(Array.from(e.target.files));
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <p className="text-gray-600">
        Drag and drop {multiple ? "audio files" : "an audio file"} here, or click to browse
      </p>
      <p className="text-sm text-gray-400 mt-1">MP3 or FLAC</p>

      <input
        ref={inputRef}
        type="file"
        accept=".mp3,.flac"
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}