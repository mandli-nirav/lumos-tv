/**
 * Vercel Serverless Function — IPTV Stream Proxy
 *
 * Solves two browser-only problems:
 *   1. CORS — stream servers don't send Access-Control-Allow-Origin headers
 *   2. Mixed Content — HTTP streams blocked on HTTPS pages
 *
 * Usage: /api/stream-proxy?url=<encoded stream URL>
 *
 * For M3U8 playlists, segment URLs inside the file are rewritten to also
 * go through this proxy so HLS.js can fetch every segment without CORS errors.
 */

export const config = {
  runtime: 'edge',
};

const ALLOWED_CONTENT_TYPES = [
  'application/vnd.apple.mpegurl',
  'application/x-mpegurl',
  'video/mp2t',
  'video/mpeg',
  'video/mp4',
  'audio/aac',
  'audio/mpeg',
  'text/plain',
  'application/octet-stream',
];

function isM3U8(url, contentType) {
  return (
    url.includes('.m3u8') ||
    contentType?.includes('mpegurl') ||
    contentType?.includes('x-mpegurl')
  );
}

function resolveUrl(line, baseUrl) {
  if (!line || line.startsWith('http://') || line.startsWith('https://')) {
    return line;
  }
  if (line.startsWith('/')) {
    const base = new URL(baseUrl);
    return `${base.origin}${line}`;
  }
  return baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1) + line;
}

function rewriteM3U8(text, baseUrl, proxyBase) {
  return text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed === '' || trimmed.startsWith('#')) return line;
      const absolute = resolveUrl(trimmed, baseUrl);
      return `${proxyBase}?url=${encodeURIComponent(absolute)}`;
    })
    .join('\n');
}

export default async function handler(req) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate URL
  let parsedUrl;
  try {
    parsedUrl = new URL(decodeURIComponent(targetUrl));
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Only allow http/https stream URLs
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return new Response(JSON.stringify({ error: 'Protocol not allowed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const upstream = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
    });

    if (!upstream.ok) {
      return new Response(
        JSON.stringify({ error: `Upstream error: ${upstream.status}` }),
        {
          status: upstream.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const contentType = upstream.headers.get('content-type') || '';
    const decodedUrl = decodeURIComponent(targetUrl);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'no-cache, no-store',
    };

    // Rewrite M3U8 playlist so segment URLs also go through proxy
    if (isM3U8(decodedUrl, contentType)) {
      const text = await upstream.text();
      const proxyBase = new URL(req.url).origin + '/api/stream-proxy';
      const rewritten = rewriteM3U8(text, decodedUrl, proxyBase);

      return new Response(rewritten, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/vnd.apple.mpegurl',
        },
      });
    }

    // For TS segments and other binary content, pass through
    const body = await upstream.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type':
          contentType ||
          (decodedUrl.endsWith('.ts') ? 'video/mp2t' : 'application/octet-stream'),
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Proxy failed', message: err.message }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
