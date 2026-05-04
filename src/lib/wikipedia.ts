import "server-only";

export async function fetchWikipediaThumbnail(name: string): Promise<string | null> {
  try {
    const slug = name.replace(/ /g, "_");
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`,
      {
        headers: { "User-Agent": "Selfish-App/1.0 (https://selfish-quiz1.vercel.app)" },
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 86400 }, // cache for 24h
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { thumbnail?: { source: string } };
    return data.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}
