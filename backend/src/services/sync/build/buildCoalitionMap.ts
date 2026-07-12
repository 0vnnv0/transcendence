//pbohme

export function buildCoalitionMap(
  arctosUsers: any[],
  melursusUsers: any[],
  fulgensUsers: any[]
) {
  const map = new Map<number, { name: string; slug: string }>();

  for (const entry of arctosUsers) {
    map.set(entry.user_id, {
      name: "Arctos",
      slug: "arctos",
    });
  }

  for (const entry of melursusUsers) {
    map.set(entry.user_id, {
      name: "Melursus",
      slug: "melursus",
    });
  }

  for (const entry of fulgensUsers) {
    map.set(entry.user_id, {
      name: "Fulgens",
      slug: "fulgens",
    });
  }

  return map;
}