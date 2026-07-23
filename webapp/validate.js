// OWASP Top 10 Proactive Controls 2024 - C7 Secure Digital Identities
// Level 1: Passwords - Password Requirements
//   * minimum 8 characters
//   * at least 64 characters must be allowed
//   * all characters permitted (incl. spaces / unicode)
//   * NO composition rules (no forced upper/digit/symbol)
//   * must not be a known breached / commonly used password
export const MIN_LENGTH = 8;
export const MAX_LENGTH = 128;

export function checkPolicy(password) {
  if (!password) return 'Password is required.';
  if (password.length < MIN_LENGTH) return `Password must be at least ${MIN_LENGTH} characters.`;
  if (password.length > MAX_LENGTH) return `Password must not exceed ${MAX_LENGTH} characters.`;
  return null; // passes local policy
}
