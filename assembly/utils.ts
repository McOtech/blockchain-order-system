import { base64, math } from 'near-sdk-as';

export function generateRandomKey(len: u32): string {
  let buf = math.randomBuffer(len);
  let b64 = base64.encode(buf);
  return b64.replaceAll('=', '');
}
