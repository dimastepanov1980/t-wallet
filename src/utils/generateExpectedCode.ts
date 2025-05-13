import { sha256 } from 'js-sha256';

export function generateExpectedCode(uid: string, secret: string): string {
  const hash = sha256(uid + secret);
  return hash.slice(0, 8).toUpperCase();
}