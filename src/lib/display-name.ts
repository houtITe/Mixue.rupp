export function shortDisplayName(name?: string | null, fallback = "Account"): string {
  if (!name || !name.trim()) return fallback;
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1];
}
