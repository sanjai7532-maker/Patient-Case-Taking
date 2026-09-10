import https from 'https';

export default function handler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const tl = url.searchParams.get('tl') || req.query?.tl || 'ta';
    const q = url.searchParams.get('q') || req.query?.q || '';

    if (!q) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Missing text parameter q');
    }

    const googleUrl =
      `https://translate.google.com/translate_tts` +
      `?ie=UTF-8` +
      `&tl=${encodeURIComponent(tl)}` +
      `&client=tw-ob` +
      `&q=${encodeURIComponent(q)}`;

    const proxyReq = https.get(
      googleUrl,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) ' +
            'Chrome/120.0.0.0 Safari/537.36'
        }
      },
      (googleRes) => {
        res.writeHead(googleRes.statusCode || 200, {
          'Content-Type': googleRes.headers['content-type'] || 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*'
        });
        googleRes.pipe(res);
      }
    );

    proxyReq.on('error', (err) => {
      console.error('Vercel TTS Proxy Error:', err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
      }
      res.end('TTS Proxy Error: ' + err.message);
    });
  } catch (error) {
    console.error('Vercel TTS Middleware Exception:', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
    }
    res.end('Exception in TTS proxy: ' + error.message);
  }
}
