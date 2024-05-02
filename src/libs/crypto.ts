import crypto from 'crypto';

export function decryptData(data: string, secretKey: string) {
  const iv = Buffer.alloc(16, 0);
  let decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
  let decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}

export function encryptData(data: string, secretKey: string) {
  const iv = new Uint8Array(16);
  let cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}