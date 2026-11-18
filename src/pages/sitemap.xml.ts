import type { APIRoute } from 'astro';
import { getEntries } from '../lib/data';

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('https://my-directory-anv.pages.dev')).origin;
  const paths = ['/', ...getEntries().map((e) => `/${e.slug}/`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${origin}${p}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
