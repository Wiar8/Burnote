import ViewNote from "@/components/ViewNote";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <header className="mb-10">
          <a href="/" className="text-2xl font-bold tracking-tight text-white">
            burn<span className="text-zinc-500">note</span>
          </a>
        </header>
        <ViewNote id={id} />
      </div>
    </main>
  );
}
