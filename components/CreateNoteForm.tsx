"use client";

import { useState } from "react";
import { encrypt } from "@/lib/crypto";
import { ExpiryOption } from "@/types/note";
import { Fire, Lock, CopySimple, Check, Plus } from "@phosphor-icons/react";

type Step = "form" | "done";

const field =
  "w-full rounded-lg border border-stone-800 bg-stone-900 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors duration-200";

export default function CreateNoteForm() {
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [expiry, setExpiry] = useState<ExpiryOption>("24h");
  const [burnAfterRead, setBurnAfterRead] = useState(true);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [noteUrl, setNoteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!content.trim()) return setError("Write something first.");
    if (!password) return setError("Password is required.");

    setLoading(true);
    try {
      const { ciphertext, iv, salt } = await encrypt(content, password);
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ciphertext, iv, salt, burnAfterRead, expiry }),
      });
      if (!res.ok) throw new Error();
      const { id } = await res.json();
      setNoteUrl(`${window.location.origin}/${id}`);
      setStep("done");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(noteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setContent("");
    setPassword("");
    setExpiry("24h");
    setBurnAfterRead(true);
    setStep("form");
    setNoteUrl("");
    setError("");
    setCopied(false);
  }

  if (step === "done") {
    return (
      <div className="animate-fade-in space-y-6">
        <div>
          <p className="text-xs text-amber-500 uppercase tracking-widest font-medium mb-3">
            Secret link ready
          </p>
          <p className="font-mono text-sm text-stone-100 break-all leading-relaxed">
            {noteUrl}
          </p>
        </div>

        <div className="border-t border-stone-800 pt-5 flex gap-3">
          <button
            onClick={copyUrl}
            className="flex-1 rounded-lg border border-stone-800 bg-stone-900 px-4 py-2.5 text-sm text-stone-100 transition-all duration-150 hover:border-amber-500/40 active:scale-[0.97] flex items-center justify-center gap-2"
          >
            {copied ? <Check size={14} weight="bold" /> : <CopySimple size={14} />}
            {copied ? "Copied!" : "Copy link"}
          </button>
          <button
            onClick={reset}
            className="flex-1 rounded-lg px-4 py-2.5 text-sm text-stone-500 transition-colors hover:text-stone-100 flex items-center justify-center gap-1.5"
          >
            <Plus size={13} />
            New note
          </button>
        </div>

        <p className="text-xs text-stone-600">
          Share the link and password separately — the server cannot read your
          note.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste a password, token, or private message..."
        rows={5}
        className={`${field} resize-none`}
      />

      <div className="relative">
        <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Encryption password"
          className={`${field} pl-10`}
        />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <select
          value={expiry}
          onChange={(e) => setExpiry(e.target.value as ExpiryOption)}
          className={`${field} flex-1 cursor-pointer`}
        >
          <option value="1h">Expires in 1 hour</option>
          <option value="24h">Expires in 24 hours</option>
          <option value="7d">Expires in 7 days</option>
        </select>

        <label className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none">
          <div className="relative">
            <input
              type="checkbox"
              checked={burnAfterRead}
              onChange={(e) => setBurnAfterRead(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-4 rounded-full border border-stone-700 bg-stone-900 peer-checked:border-amber-500/50 peer-checked:bg-amber-500/10 transition-colors duration-200" />
            <div className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-stone-600 peer-checked:translate-x-4 peer-checked:bg-amber-500 transition-all duration-200" />
          </div>
          <span className="text-xs text-stone-500 flex items-center gap-1">
            <Fire size={12} weight="fill" className="text-amber-500/70" />
            Burn after read
          </span>
        </label>
      </div>

      {error && (
        <p className="text-xs text-red-400 animate-fade-in">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-stone-950 transition-all duration-150 hover:bg-amber-400 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed mt-1"
      >
        {loading ? "Encrypting..." : "Create secret link"}
      </button>

      <p className="text-xs text-stone-600 text-center pt-0.5">
        Encrypted in your browser — the server sees only ciphertext.
      </p>
    </form>
  );
}
