const TTS_PROXY_URL = import.meta.env.VITE_TTS_PROXY_URL || "http://localhost:8787/api/tts";

let currentAudio: HTMLAudioElement | null = null;

/**
 * Requests realistic neural speech from the TTS proxy (server/) and plays
 * it. Returns false on any failure (proxy not running, not configured,
 * network error) so the caller can fall back to the browser's built-in
 * voice instead of failing silently.
 */
export async function speakCloud(
  text: string,
  lang: string,
  voice?: string,
): Promise<boolean> {
  try {
    const response = await fetch(TTS_PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang, voice }),
    });

    if (!response.ok) return false;

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    currentAudio?.pause();
    const audio = new Audio(url);
    currentAudio = audio;
    audio.addEventListener("ended", () => URL.revokeObjectURL(url), { once: true });
    audio.addEventListener("error", () => URL.revokeObjectURL(url), { once: true });

    await audio.play();
    return true;
  } catch {
    return false;
  }
}

export function stopCloudSpeech() {
  currentAudio?.pause();
  currentAudio = null;
}
