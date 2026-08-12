"use client";

import { useState } from "react";
import FileDropzone from "@/src/components/FileDropzone";
import { batchAutoFix } from "@/src/lib/api";

interface BatchError {
  filename: string;
  error: string;
}

interface BatchSkipped {
  filename: string;
  reason: string;
}

export default function BatchFlow() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<BatchError[]>([]);
  const [skipped, setSkipped] = useState<BatchSkipped[]>([]);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleFilesSelected(selected: File[]) {
    setFiles(selected);
    setDone(false);
    setErrors([]);
    setSkipped([]);
    setErrorMsg(null);
  }

  async function handleAutoFix() {
    if (files.length === 0) return;

    setProcessing(true);
    setErrorMsg(null);

    try {
      const { blob, errors: batchErrors, skipped: batchSkipped } = await batchAutoFix(files);

      setErrors(batchErrors);
      setSkipped(batchSkipped);

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "auto_fixed_music.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setDone(true);
    } catch (err) {
      setErrorMsg("Batch processing failed. Try again.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div>
      <FileDropzone onFilesSelected={handleFilesSelected} multiple={true} />

      {files.length > 0 && (
        <p className="mt-4 text-sm text-gray-400">
          {files.length} file{files.length > 1 ? "s" : ""} selected
        </p>
      )}

      {files.length > 0 && !processing && (
        <button
          onClick={handleAutoFix}
          className="mt-4 px-4 py-2 border rounded hover:bg-gray-900 transition-colors"
        >
          Auto-fix and download ZIP
        </button>
      )}

      {processing && (
        <p className="mt-4 text-sm text-blue-600">
          Processing {files.length} files... this may take a moment.
        </p>
      )}

      {errorMsg && <p className="mt-4 text-sm text-red-600">{errorMsg}</p>}

      {done && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-green-600">
            Done. {files.length - errors.length - skipped.length} fixed,{" "}
            {skipped.length} skipped, {errors.length} errors.
          </p>

          {skipped.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Skipped (no confident match):</p>
              <ul className="text-sm text-gray-500 space-y-1">
                {skipped.map((s) => (
                  <li key={s.filename}>{s.filename} — {s.reason}</li>
                ))}
              </ul>
            </div>
          )}

          {errors.length > 0 && (
            <div>
              <p className="text-sm font-medium text-red-500 mb-1">Errors:</p>
              <ul className="text-sm text-red-400 space-y-1">
                {errors.map((e) => (
                  <li key={e.filename}>{e.filename} — {e.error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}