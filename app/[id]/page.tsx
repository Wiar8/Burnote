import ViewNote from "@/components/ViewNote";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-[440px]">
        <header className="animate-fade-up mb-12">
          <a
            href="/"
            className="font-display text-5xl font-black tracking-tight leading-none inline-block"
          >
            <span className="text-amber-500">burn</span>ote
          </a>
        </header>

        <div className="animate-fade-up" style={{ animationDelay: "90ms" }}>
          <ViewNote id={id} />
        </div>
      </div>
    </main>
  );
}
