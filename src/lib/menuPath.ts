import fs from 'fs';
import path from 'path';

const API_KEY = 'AIzaSyAmD4sAv2G6r3vEIJwS53tskWnWU8IukBY';
const CX = 'f09ca241a91754b1e';

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

const BAD_DOMAINS = [
  'yelp.com',
  'tripadvisor.com',
  'ubereats.com',
  'grubhub.com',
  'doordash.com',
  'seamless.com',
  'postmates.com'
];

const CACHE_DIR = path.join(process.cwd(), 'src', 'cache');

function getCachePath(query: string) {
  const slug = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  return path.join(CACHE_DIR, `${slug}.json`);
}

export async function getMenuPathLocal(name: string): Promise<string | null> {
  const cacheFile = getCachePath(name);

  // ✅ 1. Check if cache exists
  if (fs.existsSync(cacheFile)) {
    const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
    if (data && data.link) {
      return data.link;
    }
  }

  // 🚀 2. If not cached, run search
  const link = await getMenuPath(name);

  // 💾 3. Save to cache
  if (link) {
    fs.writeFileSync(cacheFile, JSON.stringify({ link }, null, 2));
  }

  return link;
}

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function scoreResult(result: SearchResult): number {
  let score = 0;
  const url = result.link.toLowerCase();
  const title = result.title.toLowerCase();
  const snippet = result.snippet.toLowerCase();
  const domain = normalizeUrl(result.link);

  if (BAD_DOMAINS.includes(domain)) return -Infinity; // Disqualify

  if (url.includes('/menu')) score += 5;
  if (url.endsWith('/menu')) score += 4;
  if (title.includes('menu')) score += 3;
  if (snippet.includes('menu')) score += 2;

  return score;
}

export async function getMenuPath(name: string) {
  const query = `${name} menu`;
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEY}&cx=${CX}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    return null;
  }
  const results: SearchResult[] = data.items;

  const sortedResults = results
    .map(result => ({ ...result, _score: scoreResult(result) }))
    .filter(r => r._score !== -Infinity)
    .sort((a, b) => b._score - a._score);

  const best = sortedResults[0] || data.items[0]; // Fallback to first raw result
  return best.link;
}