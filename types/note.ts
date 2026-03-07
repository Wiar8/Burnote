export interface StoredNote {
  ciphertext: string; // base64-encoded encrypted content
  iv: string;         // base64-encoded 12-byte IV
  salt: string;       // base64-encoded 16-byte PBKDF2 salt
  burnAfterRead: boolean;
  createdAt: number;
}

export type ExpiryOption = "1h" | "24h" | "7d";

export const EXPIRY_SECONDS: Record<ExpiryOption, number> = {
  "1h": 3600,
  "24h": 86400,
  "7d": 604800,
};
