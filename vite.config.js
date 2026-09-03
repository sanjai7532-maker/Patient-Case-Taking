import { defineConfig } from 'vite';
import https from 'https';

export default defineConfig({
  server: {
    port: 3000,
    open: false
  },
  plugins: [
    {
      name: 'tts-proxy-middleware',
      configureServer(server) {
        server.middlewares.use('/api/tts', (req, res) => {
          try {
            const urlObj = new URL(req.url, 'http://localhost:3000');
            const tl = urlObj.searchParams.get('tl') || 'ta';
            const q = urlObj.searchParams.get('q') || '';

            if (!q) {
              res.statusCode = 400;
              res.end('Missing text parameter q');
              return;
            }

            const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(tl)}&client=tw-ob&q=${encodeURIComponent(q)}`;

            const proxyReq = https.get(googleUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
              }
            }, (googleRes) => {
              res.writeHead(googleRes.statusCode || 200, {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'public, max-age=86400',
                'Access-Control-Allow-Origin': '*'
              });
              googleRes.pipe(res);
            });

            proxyReq.on('error', (err) => {
              console.error('TTS Proxy Error:', err);
              res.statusCode = 500;
              res.end('TTS Proxy Error: ' + err.message);
            });
          } catch (e) {
            console.error('TTS Middleware Exception:', e);
            res.statusCode = 500;
            res.end('Exception in TTS proxy: ' + e.message);
          }
        });
      }
    }
  ]
});
