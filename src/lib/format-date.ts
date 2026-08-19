export function formatAdminDateTime(ms: number | undefined | null): string {
  if (!ms) return "—";
  const d = new Date(ms);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${hours}:${minutes}(${ampm})/${day}/${month}/${year}`;
}
