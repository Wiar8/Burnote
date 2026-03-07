import CreateNoteForm from "@/components/CreateNoteForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <header className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            burn<span className="text-zinc-500">note</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Share secrets that disappear. Encrypted in your browser — the server
            never sees your content.
          </p>
        </header>
        <CreateNoteForm />
      </div>
    </main>
  );
}
