import redis from "@/lib/redis";
import { StoredNote } from "@/types/note";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const note = await redis.get<StoredNote>(`note:${id}`);

  if (!note) {
    return Response.json({ error: "Note not found or already burned" }, { status: 404 });
  }

  if (note.burnAfterRead) {
    await redis.del(`note:${id}`);
  }

  return Response.json({
    ciphertext: note.ciphertext,
    iv: note.iv,
    salt: note.salt,
    burnAfterRead: note.burnAfterRead,
  });
}
