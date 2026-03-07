"use client";

import { useState } from "react";
import { encrypt } from "@/lib/crypto";
import { ExpiryOption } from "@/types/note";

type Step = "form" | "done";

export default function CreateNoteForm() {
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [expiry, setExpiry] = useState<ExpiryOption>("24h");
  const [burnAfterRead, setBurnAfterRead] = useState(true);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [noteUrl, setNoteUrl] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!content.trim()) return setError("Note content is required.");
    if (!password) return setError("Password is required.");

    setLoading(true);
    try {
      const { ciphertext, iv, salt } = await encrypt(content, password);
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ciphertext, iv, salt, burnAfterRead, expiry }),
      });

      if (!res.ok) throw new Error("Failed to create note");

      const { id } = await res.json();
      setNoteUrl(`${window.location.origin}/${id}`);
      setStep("done");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function copyUrl() {
    navigator.clipboard.writeText(noteUrl);
  }

  function reset() {
    setContent("");
    setPassword("");
    setExpiry("24h");
    setBurnAfterRead(true);
    setStep("form");
    setNoteUrl("");
    setError("");
  }

  if (step === "done") {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
            Your secret link
          </p>
          <p className="break-all text-sm text-white mb-4">{noteUrl}</p>
          <div className="flex gap-3">
            <button
              onClick={copyUrl}
              className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 transition-colors"
            >
              Copy link
            </button>
            <button
              onClick={reset}
              className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 transition-colors"
            >
              Create another
            </button>
          </div>
        </div>
        <p className="text-xs text-zinc-600 text-center">
          Share the link and the password separately. The server cannot read
          your note.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste a password, token, or private message..."
          rows={6}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-zinc-600 focus:outline-none resize-none"
        />
      </div>

      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Encryption password"
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <select
            value={expiry}
            onChange={(e) => setExpiry(e.target.value as ExpiryOption)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white focus:border-zinc-600 focus:outline-none"
          >
            <option value="1h">Expires in 1 hour</option>
            <option value="24h">Expires in 24 hours</option>
            <option value="7d">Expires in 7 days</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer px-3">
          <input
            type="checkbox"
            checked={burnAfterRead}
            onChange={(e) => setBurnAfterRead(e.target.checked)}
            className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
          />
          <span className="text-sm text-zinc-400">Burn after read</span>
        </label>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-white px-4 py-3 text-sm font-medium text-black hover:bg-zinc-200 disabled:opacity-50 transition-colors"
      >
        {loading ? "Encrypting..." : "Create secret link"}
      </button>
    </form>
  );
}
