// utils/formatAvailability.ts
type Day = "Mon" | "Tue" | "Wed" | "Thurs" | "Fri" | "Sat" | "Sun";

const DAY_ORDER: Day[] = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];
const DAY_LABELS: Record<Day, string> = {
  Mon: "Mon", Tue: "Tue", Wed: "Wed", Thurs: "Thu", Fri: "Fri", Sat: "Sat", Sun: "Sun",
};

export function isFullyAvailable(days: Day[] | undefined | null): boolean {
	return !days || days.length === 0;
}

export function formatAvailability(days: Day[] | undefined | null): string {
  if (!days || days.length === 0) return "Mon-Sun";

  const indices = Array.from(new Set(days.map((d) => DAY_ORDER.indexOf(d)))).sort((a, b) => a - b);

  if (indices.length <= 3) {
    return indices.map((i) => DAY_LABELS[DAY_ORDER[i]]).join(", ");
  }

  const ranges: [number, number][] = [];
  let start = indices[0];
  let prev = indices[0];

  for (let k = 1; k < indices.length; k++) {
    const cur = indices[k];
    if (cur === prev + 1) {
      prev = cur;
    } else {
      ranges.push([start, prev]);
      start = cur;
      prev = cur;
    }
  }
  ranges.push([start, prev]);

  return ranges
    .map(([s, e]) => (s === e ? DAY_LABELS[DAY_ORDER[s]] : `${DAY_LABELS[DAY_ORDER[s]]}-${DAY_LABELS[DAY_ORDER[e]]}`))
    .join(", ");
}
