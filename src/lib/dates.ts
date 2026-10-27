/** "10/28 – 11/01" → the next 28 Oct from today (tour dates carry no year). */
export function departureOf(date?: string, now = new Date()) {
  const m = date?.match(/(\d{1,2})\/(\d{1,2})/);
  if (!m) return null;
  const d = new Date(now.getFullYear(), Number(m[1]) - 1, Number(m[2]));
  if (d.getTime() < now.getTime() - 86400000 * 120) d.setFullYear(d.getFullYear() + 1);
  return d;
}

export function daysUntil(date?: string, now = new Date()) {
  const dep = departureOf(date, now);
  return dep ? Math.ceil((dep.getTime() - now.getTime()) / 86400000) : null;
}
