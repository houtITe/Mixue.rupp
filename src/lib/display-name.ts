// Shortens a display name for tight UI spots (navbar, badges).
// Single-word names ("Admin") are shown as-is. Multi-word names
// ("Meng Hout") show only the last word ("Hout").
export function shortDisplayName(name?: string | null, fallback = "Account"): string {
  if (!name || !name.trim()) return fallback;
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1];
}
