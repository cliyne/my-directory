import fs from 'node:fs';
import path from 'node:path';

export interface Entry {
  slug: string; name: string; category: string; tagline: string;
  description: string; pricing: string; url: string; tags: string[];
  bestFor: string; features: string[]; pros: string[]; cons: string[];
  alternatives: string[]; affiliateUrl: string; updated: string;
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else inQ = false; }
      else cell += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((v) => v.trim())) rows.push(row);
      row = [];
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); if (row.some((v) => v.trim())) rows.push(row); }
  return rows;
}

const list = (s?: string) => (s ? s.split('|').map((t) => t.trim()).filter(Boolean) : []);

export function getEntries(): Entry[] {
  const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'data.csv'), 'utf-8');
  const [header, ...rows] = parseCSV(raw.replace(/^\uFEFF/, ''));
  const keys = header.map((h) => h.trim());
  return rows
    .map((r) => {
      const o: Record<string, string> = {};
      keys.forEach((k, i) => (o[k] = (r[i] ?? '').trim()));
      return {
        slug: o.slug, name: o.name, category: o.category, tagline: o.tagline,
        description: o.description, pricing: o.pricing, url: o.url,
        tags: list(o.tags), bestFor: o.best_for ?? '', features: list(o.features),
        pros: list(o.pros), cons: list(o.cons), alternatives: list(o.alternatives),
        affiliateUrl: o.affiliate_url ?? '', updated: o.updated ?? '',
      };
    })
    .filter((e) => e.slug && e.name);
}
