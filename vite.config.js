import { defineConfig } from 'vite';
import https from 'https';

export default defineConfig({
  // GitHub Pages repository path
  base: '/Patient-Case-Taking/',

  // Local development server
  server: {
    port: 3000,
    open: false,

    // TTS proxy works only during local development
    middlewareMode: false
  },

  plugins: [
    {
      name: 'tts-proxy-middleware',

      configureServer(server) {
        server.middlewares.use('/api/tts', (req, res) => {
          try {
            // Get query parameters
            const urlObj = new URL(
              req.url || '',
              'http://localhost:3000'
            );

            const tl = urlObj.searchParams.get('tl') || 'ta';
            const q = urlObj.searchParams.get('q') || '';

            // Check if text exists
            if (!q) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'text/plain');
              res.end('Missing text parameter q');
              return;
            }

            // Google TTS URL
            const googleUrl =
              `https://translate.google.com/translate_tts` +
              `?ie=UTF-8` +
              `&tl=${encodeURIComponent(tl)}` +
              `&client=tw-ob` +
              `&q=${encodeURIComponent(q)}`;

            // Request audio from Google
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
                  'Content-Type':
                    googleRes.headers['content-type'] ||
                    'audio/mpeg',

                  'Cache-Control':
                    'public, max-age=86400',

                  'Access-Control-Allow-Origin': '*'
                });

                googleRes.pipe(res);
              }
            );

            // Handle Google request error
            proxyReq.on('error', (err) => {
              console.error('TTS Proxy Error:', err);

              if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader(
                  'Content-Type',
                  'text/plain'
                );
              }

              res.end(
                'TTS Proxy Error: ' + err.message
              );
            });

          } catch (error) {
            console.error(
              'TTS Middleware Exception:',
              error
            );

            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader(
                'Content-Type',
                'text/plain'
              );
            }

            res.end(
              'Exception in TTS proxy: ' +
              error.message
            );
          }
        });
      }
    }
  ]
});