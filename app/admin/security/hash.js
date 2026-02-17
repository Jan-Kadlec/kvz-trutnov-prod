// Simple password hashing utility using Web Crypto API
// For demo purposes - in production use proper bcryptjs library

export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export async function verifyPassword(password, hash) {
  const newHash = await hashPassword(password);
  return newHash === hash;
}

// Simplified comparison - in production use timing-safe comparison
export function compareHashes(hash1, hash2) {
  return hash1 === hash2;
}
