import { nanoid } from "nanoid";
import redis from "@/lib/redis";
import { StoredNote, EXPIRY_SECONDS, ExpiryOption } from "@/types/note";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ciphertext, iv, salt, burnAfterRead, expiry } = body as {
      ciphertext: string;
      iv: string;
      salt: string;
      burnAfterRead: boolean;
      expiry: ExpiryOption;
    };

    if (!ciphertext || !iv || !salt) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const ttl = EXPIRY_SECONDS[expiry] ?? EXPIRY_SECONDS["24h"];
    const id = nanoid(10);

    const note: StoredNote = {
      ciphertext,
      iv,
      salt,
      burnAfterRead: burnAfterRead ?? true,
      createdAt: Date.now(),
    };

    await redis.set(`note:${id}`, note, { ex: ttl });

    return Response.json({ id }, { status: 201 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
