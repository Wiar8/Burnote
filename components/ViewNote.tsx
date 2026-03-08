"use client";

import { useState } from "react";
import { decrypt } from "@/lib/crypto";

type State = "idle" | "loading" | "decrypted" | "error";

export default function ViewNote({ id }: { id: string }) {
  const [password, setPassword] = useState("");
  const [state, setState] = useState<State>("idle");
  const [plaintext, setPlaintext] = useState("");
  const [burned, setBurned] = useState(false);
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

      const { ciphertext, iv, salt, burnAfterRead } = await res.json();
      setBurned(burnAfterRead);

      try {
        const text = await decrypt(ciphertext, iv, salt, password);
        setPlaintext(text);
        setState("decrypted");
      } catch {
        setError("Wrong password — could not decrypt.");
        setState("error");
      }
    } catch {
      setError("Network error. Please try again.");
      setState("error");
    }
  }

  if (state === "decrypted") {
    return (
      <div className="animate-fade-in space-y-4">
        {burned && (
          <p className="text-xs text-amber-500 uppercase tracking-widest font-medium">
            Burned — cannot be viewed again
          </p>
        )}
        <pre className="whitespace-pre-wrap break-all font-mono text-sm text-stone-100 leading-relaxed rounded-lg border border-stone-800 bg-stone-900 px-5 py-4">
          {plaintext}
        </pre>
      </div>
    );
  }

  return (
    <form onSubmit={handleDecrypt} className="space-y-4">
      <div className="mb-2">
        <p className="text-xs text-amber-500 uppercase tracking-widest font-medium mb-1">
          Secret note
        </p>
        <p className="text-sm text-stone-500">
          Enter the password to decrypt and reveal.
        </p>
      </div>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoFocus
        className="w-full rounded-lg border border-stone-800 bg-stone-900 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors duration-200"
      />

      {state === "error" && (
        <p className="text-xs text-red-400 animate-fade-in">{error}</p>
      )}

      <button
        type="submit"
        disabled={state === "loading" || !password}
        className="w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-stone-950 transition-all duration-150 hover:bg-amber-400 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {state === "loading" ? "Decrypting..." : "Reveal secret"}
      </button>
    </form>
  );
}
