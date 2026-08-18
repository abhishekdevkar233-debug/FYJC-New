import { speakCloud } from "./cloudSpeech";

const INDIAN_FEMALE_NAME_PATTERN =
  /heera|veena|raveena|priya|neerja|swara|google (हिन्दी|hindi|us english)|indian/i;
const GENERIC_FEMALE_NAME_PATTERN =
  /zira|samantha|victoria|karen|moira|tessa|fiona|susan|google uk english female/i;

/** BCP-47 locale used for each app language's speech synthesis. */
export const SPEECH_LOCALE = {
  EN: "en-IN",
  HI: "hi-IN",
  MR: "mr-IN",
} as const;

export type SpeechLocaleKey = keyof typeof SPEECH_LOCALE;

function localeMatches(voice: SpeechSynthesisVoice, localeCode: string) {
  const voiceLang = voice.lang.toLowerCase().replace("_", "-");
  const target = localeCode.toLowerCase();
  return voiceLang === target || voiceLang.startsWith(`${target.split("-")[0]}-`);
}

function isIndianEnglishLocale(voice: SpeechSynthesisVoice) {
  return /^en[-_]in$|^hi[-_]in$/i.test(voice.lang);
}

/**
 * Picks the best available voice for the requested locale (e.g. "mr-IN"),
 * preferring a female voice in that exact locale, then any voice in that
 * locale, then falling back to the Indian-English female preference so the
 * assistant never defaults to a generic US-accented system voice.
 */
export function pickFemaleVoice(
  voices: SpeechSynthesisVoice[],
  localeCode: string = SPEECH_LOCALE.EN,
): SpeechSynthesisVoice | null {
  const localeFemaleByName = voices.find(
    (v) => localeMatches(v, localeCode) && INDIAN_FEMALE_NAME_PATTERN.test(v.name),
  );
  if (localeFemaleByName) return localeFemaleByName;

  const localeFemaleByKeyword = voices.find(
    (v) => localeMatches(v, localeCode) && /female/i.test(v.name),
  );
  if (localeFemaleByKeyword) return localeFemaleByKeyword;

  const anyLocaleMatch = voices.find((v) => localeMatches(v, localeCode));
  if (anyLocaleMatch) return anyLocaleMatch;

  const indianFemaleByName = voices.find(
    (v) => isIndianEnglishLocale(v) && INDIAN_FEMALE_NAME_PATTERN.test(v.name),
  );
  if (indianFemaleByName) return indianFemaleByName;

  const indianFemaleByKeyword = voices.find(
    (v) => isIndianEnglishLocale(v) && /female/i.test(v.name),
  );
  if (indianFemaleByKeyword) return indianFemaleByKeyword;

  const anyFemaleByName = voices.find((v) => INDIAN_FEMALE_NAME_PATTERN.test(v.name));
  if (anyFemaleByName) return anyFemaleByName;

  const anyFemaleByKeyword = voices.find((v) => /female/i.test(v.name));
  if (anyFemaleByKeyword) return anyFemaleByKeyword;

  const byGenericName = voices.find((v) => GENERIC_FEMALE_NAME_PATTERN.test(v.name));
  if (byGenericName) return byGenericName;

  const anyIndianVoice = voices.find(isIndianEnglishLocale);
  return anyIndianVoice ?? null;
}

/**
 * Speaks `text` using the given locale (defaults to Indian English). Voice
 * availability for hi-IN/mr-IN depends on the browser/OS's installed speech
 * packs — if none is installed, this falls back to the closest available
 * voice, which may not pronounce the script correctly.
 */
export function speak(text: string, localeCode: string = SPEECH_LOCALE.EN) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = localeCode;
  const existingVoices = synth.getVoices();

  if (existingVoices.length > 0) {
    const voice = pickFemaleVoice(existingVoices, localeCode);
    if (voice) utterance.voice = voice;
    synth.speak(utterance);
  } else {
    synth.addEventListener(
      "voiceschanged",
      () => {
        const voice = pickFemaleVoice(synth.getVoices(), localeCode);
        if (voice) utterance.voice = voice;
        synth.speak(utterance);
      },
      { once: true },
    );
  }
}

/**
 * Speaks `text`, preferring realistic cloud neural speech for Marathi (via
 * the server/ TTS proxy) and falling back to the browser's built-in voice
 * if the proxy isn't running, isn't configured, or the request fails.
 * English/Hindi always use the browser voice (already acceptable, no extra
 * cost).
 */
export async function speakBest(text: string, localeCode: string = SPEECH_LOCALE.EN) {
  if (localeCode === SPEECH_LOCALE.MR) {
    const played = await speakCloud(text, localeCode);
    if (played) return;
  }
  speak(text, localeCode);
}
