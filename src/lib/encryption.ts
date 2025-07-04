import { env } from "@/utils";
import crypto from "crypto";

const ENC_KEY = env.encKey;
const ALGORITHM = "aes-256-cbc";

function generateIv() {
  return crypto.randomBytes(16);
}

function encryptValue(value: string): string {
  const iv = generateIv();
  const cipher = crypto.createCipheriv(ALGORITHM, ENC_KEY.slice(0, 32), iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

function decryptValue(value: string): string {
  const [ivHex, encryptedHex] = value.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, ENC_KEY.slice(0, 32), iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

export { encryptValue, decryptValue };
