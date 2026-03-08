import CreateNoteForm from "@/components/CreateNoteForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-[440px]">
        <header className="animate-fade-up mb-12">
          <h1 className="font-display text-5xl font-black tracking-tight leading-none mb-3">
            <span className="text-amber-500">burn</span>ote
          </h1>
          <p className="text-sm text-stone-500">A secret link that disappears.</p>
        </header>

        <div className="animate-fade-up" style={{ animationDelay: "90ms" }}>
          <CreateNoteForm />
        </div>
      </div>
    </main>
  );
}
