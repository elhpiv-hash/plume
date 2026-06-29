/**
 * Collision-resistant id generator for the prototype. Uses crypto when
 * available (browsers), with a deterministic-enough fallback otherwise.
 */
export function createId(prefix = 'id'): string {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && 'randomUUID' in cryptoObj) {
    return `${prefix}_${cryptoObj.randomUUID().replace(/-/g, '').slice(0, 16)}`;
  }
  const rand = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  return `${prefix}_${time}${rand}`;
}
