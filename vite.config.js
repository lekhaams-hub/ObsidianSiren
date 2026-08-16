import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const geminiKey = env.VITE_GEMINI_API_KEY;
  const geminiModel = env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
  const geminiModelFallbacks = [geminiModel];
  if (!geminiModelFallbacks.includes('gemini-2.5-flash')) geminiModelFallbacks.push('gemini-2.5-flash');
  if (!geminiModelFallbacks.includes('gemini-2.5-pro')) geminiModelFallbacks.push('gemini-2.5-pro');
  if (!geminiModelFallbacks.includes('gemini-2.0-flash')) geminiModelFallbacks.push('gemini-2.0-flash');
  if (!geminiModelFallbacks.includes('gemini-2.0-flash-001')) geminiModelFallbacks.push('gemini-2.0-flash-001');

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'gemini-proxy',
        configureServer(server) {
          server.middlewares.use('/api/gemini', async (req, res, next) => {
            if (req.method !== 'POST') {
              return next();
            }

            if (!geminiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Gemini API key is not configured.' }));
              return;
            }

            let body = '';
            for await (const chunk of req) {
              body += chunk;
            }

            try {
              const payload = JSON.parse(body || '{}');
              let lastNotFound = null;

              console.log('[Gemini Proxy] Received request, trying models:', geminiModelFallbacks);

              for (const model of geminiModelFallbacks) {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
                console.log(`[Gemini Proxy] Attempting ${model}...`);
                const response = await fetch(url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(payload),
                });

                const text = await response.text();
                console.log(`[Gemini Proxy] ${model} returned status ${response.status}, response length: ${text.length}`);
                if (response.ok) {
                  console.log(`[Gemini Proxy] ${model} SUCCESS`);
                  res.statusCode = response.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(text || JSON.stringify({ error: 'Gemini returned an empty response.' }));
                  return;
                }

                if (response.status === 404) {
                  console.log(`[Gemini Proxy] ${model} returned 404, trying next...`);
                  lastNotFound = { model, url, text };
                  continue;
                }

                console.log(`[Gemini Proxy] ${model} returned ${response.status}, giving up`);
                res.statusCode = response.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(text || JSON.stringify({ error: `Gemini request failed with status ${response.status} for ${model}` }));
                return;
              }

              if (lastNotFound) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  error: `Gemini model not found. Tried: ${geminiModelFallbacks.join(', ')}. Last attempted model: ${lastNotFound.model}. Response: ${lastNotFound.text || 'empty body'}`,
                }));
                return;
              }

              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Gemini request failed before any supported model responded.' }));
            } catch (error) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: error?.message || 'Gemini proxy error' }));
            }
          });
        },
      },
    ],
  };
});