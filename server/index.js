import "dotenv/config";
import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 8787;
const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const DEFAULT_VOICES = {
  "mr-IN": process.env.AZURE_SPEECH_VOICE_MR || "mr-IN-AarohiNeural",
  "hi-IN": process.env.AZURE_SPEECH_VOICE_HI || "hi-IN-SwaraNeural",
  "en-IN": process.env.AZURE_SPEECH_VOICE_EN || "en-IN-NeerjaNeural",
};

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

function escapeSsml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, configured: Boolean(AZURE_SPEECH_KEY && AZURE_SPEECH_REGION) });
});

app.post("/api/tts", async (req, res) => {
  if (!AZURE_SPEECH_KEY || !AZURE_SPEECH_REGION) {
    res.status(503).json({
      error:
        "Azure Speech is not configured. Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in server/.env.",
    });
    return;
  }

  const { text, lang, voice } = req.body || {};
  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "Missing 'text' in request body." });
    return;
  }

  const langCode = typeof lang === "string" && lang ? lang : "mr-IN";
  const voiceName = voice || DEFAULT_VOICES[langCode] || DEFAULT_VOICES["mr-IN"];

  const ssml = `<speak version='1.0' xml:lang='${langCode}'><voice xml:lang='${langCode}' name='${voiceName}'>${escapeSsml(text)}</voice></speak>`;

  try {
    const azureRes = await fetch(
      `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-64kbitrate-mono-mp3",
          "User-Agent": "fyjc-admission-portal",
        },
        body: ssml,
      },
    );

    if (!azureRes.ok) {
      const detail = await azureRes.text();
      console.error("Azure TTS request failed", azureRes.status, detail);
      res.status(502).json({ error: "The speech provider rejected the request." });
      return;
    }

    const audioBuffer = Buffer.from(await azureRes.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.send(audioBuffer);
  } catch (err) {
    console.error("TTS proxy error", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.listen(PORT, () => {
  console.log(`TTS proxy listening on http://localhost:${PORT}`);
  if (!AZURE_SPEECH_KEY || !AZURE_SPEECH_REGION) {
    console.warn(
      "AZURE_SPEECH_KEY / AZURE_SPEECH_REGION are not set — /api/tts will return 503 until server/.env is filled in.",
    );
  }
});
