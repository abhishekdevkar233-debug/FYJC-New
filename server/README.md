# FYJC TTS proxy

Holds the Azure Speech key server-side and forwards text-to-speech requests
for the portal's Marathi voiceovers, so the key is never exposed to the
browser. The frontend falls back to the browser's built-in voice if this
server isn't running or isn't configured.

## Setup

1. Create an Azure Speech resource: portal.azure.com -> "Speech service" ->
   any region with neural voices (e.g. `centralindia`). Copy its key and
   region from the resource's "Keys and Endpoint" page.
2. `cd server`
3. `npm install`
4. `cp .env.example .env` and fill in `AZURE_SPEECH_KEY` and
   `AZURE_SPEECH_REGION`.
5. `npm run dev` (or `npm start`) — runs on `http://localhost:8787` by
   default.

Run this alongside the existing frontend dev server (`cd web && npm run
dev`). No change is needed on the frontend side unless you move this proxy
to a different host/port — in that case set `VITE_TTS_PROXY_URL` in
`web/.env`.

## Endpoint

`POST /api/tts` — body `{ "text": string, "lang": "mr-IN" | "hi-IN" | "en-IN", "voice"?: string }`,
returns `audio/mpeg`. `GET /health` reports whether the Azure key is configured.
