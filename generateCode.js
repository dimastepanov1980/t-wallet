import { sha256 } from 'js-sha256';

export function generateExpectedCode(uid, secret) {
  const hash = sha256(uid + secret);
  return hash.slice(0, 8).toUpperCase();
}
const uid = '-39ee07ec';
const secret = 't-wallet-2024';

const code = generateExpectedCode(uid, secret);
console.log(`Activation code: ${code}`);