"use client";

import { useState } from "react";
import { decrypt } from "@/lib/crypto";

type State = "idle" | "loading" | "decrypted" | "error";

export default function ViewNote({ id }: { id: string }) {
  const [password, setPassword] = useState("");
  const [state, setState] = useState<State>("idle");
  const [plaintext, setPlaintext] = useState("");
  const [error, setError] = useState("");

  async function handleDecrypt(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;

    setState("loading");
    setError("");

    try {
      const res = await fetch(`/api/notes/${id}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Note not found or already burned.");
        setState("error");
        return;
      }

      const { ciphertext, iv, salt } = await res.json();

      try {
        const text = await decrypt(ciphertext, iv, salt, password);
        setPlaintext(text);
        setState("decrypted");
      } catch {
        setError("Wrong password or corrupted note.");
        setState("error");
      }
    } catch {
      setError("Network error. Please try again.");
      setState("error");
    }
  }

  if (state === "decrypted") {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
            Secret note
          </p>
          <pre className="whitespace-pre-wrap break-all text-sm text-white font-mono">
            {plaintext}
          </pre>
        </div>
        <p className="text-xs text-zinc-600 text-center">
          This note has been burned and cannot be viewed again.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleDecrypt} className="space-y-4">
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
        <p className="text-sm text-zinc-400 mb-1">
          Someone shared a secret note with you.
        </p>
        <p className="text-xs text-zinc-600">
          Enter the password to decrypt and reveal it.
        </p>
      </div>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password to decrypt"
        autoFocus
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
      />

      {state === "error" && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={state === "loading" || !password}
        className="w-full rounded-lg bg-white px-4 py-3 text-sm font-medium text-black hover:bg-zinc-200 disabled:opacity-50 transition-colors"
      >
        {state === "loading" ? "Decrypting..." : "Reveal secret"}
      </button>
    </form>
  );
}
