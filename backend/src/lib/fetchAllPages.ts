//pbohme
//api liefert immer mehrere seiten, per default kriegt man nur die erste
//funktion liefert alle seiten

export async function fetchAllPages<T>(
  fetchPage: (page: number) => Promise<T[]>,
  perPage = 100
): Promise<T[]> {
  const all: T[] = [];
  let page = 1;

  while (true) {
    const data = await fetchPage(page);

    if (!data || data.length === 0) break;

    all.push(...data);

    if (data.length < perPage) break;

    page++;
	await new Promise(resolve => setTimeout(resolve, 700));
  }

  return all;
}
