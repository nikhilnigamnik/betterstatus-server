import { env } from '@/utils';
import crypto from 'crypto';
import { promisify } from 'util';

const ENC_KEY = env.encKey;
const ALGORITHM = 'aes-256-gcm';

const randomBytes = promisify(crypto.randomBytes);

async function generateIv(): Promise<Buffer> {
  return await randomBytes(12);
}

async function encrypt(value: string): Promise<string> {
  const iv = await generateIv();
  const cipher = crypto.createCipheriv(ALGORITHM, ENC_KEY.slice(0, 32), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${encrypted.toString('hex')}:${authTag.toString('hex')}`;
}

async function decrypt(value: string): Promise<string> {
  const [ivHex, encryptedHex, authTagHex] = value.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, ENC_KEY.slice(0, 32), iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

export { encrypt, decrypt };
