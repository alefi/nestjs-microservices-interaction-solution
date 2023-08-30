import { createHash } from 'node:crypto';

const HASH_ALGO = 'sha256';
const ENCODING = 'hex';

export function hashValue(value: string, salt: string) {
  const valueHash = createHash(HASH_ALGO).update(value);
  const saltHash = createHash(HASH_ALGO).update(salt);

  return valueHash.update(saltHash.digest(ENCODING)).digest(ENCODING);
}
