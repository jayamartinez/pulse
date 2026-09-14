const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/** Validates the canonical 32-byte public-key representation without accepting regex lookalikes. */
export function isValidSolanaAddress(value: string): boolean {
  const address = value.trim();
  if (!address || address.length > 44) return false;
  const bytes = [0];
  for (const character of address) {
    const digit = BASE58.indexOf(character);
    if (digit < 0) return false;
    let carry = digit;
    for (let index = 0; index < bytes.length; index += 1) { const value = bytes[index] * 58 + carry; bytes[index] = value & 0xff; carry = value >> 8; }
    while (carry) { bytes.push(carry & 0xff); carry >>= 8; }
  }
  const leadingZeroes = address.match(/^1*/)?.[0].length ?? 0;
  return bytes.length + leadingZeroes === 32;
}

export function normalizeSolanaAddress(value: string): string {
  const address = value.trim();
  if (!isValidSolanaAddress(address)) throw new Error("Enter a valid Solana wallet address.");
  return address;
}
