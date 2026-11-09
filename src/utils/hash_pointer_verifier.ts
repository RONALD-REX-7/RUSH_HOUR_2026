export function isValidSha256(hash: string): boolean {
  return /^[a-f0-9]{64}$/i.test(hash);
}

export function isGenesisParent(parentHash: string): boolean {
  return parentHash === "0".repeat(64);
}
