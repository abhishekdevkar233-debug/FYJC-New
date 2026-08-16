const INDIAN_FEMALE_NAME_PATTERN =
  /heera|veena|raveena|priya|neerja|swara|google (हिन्दी|hindi|us english)|indian/i;
const GENERIC_FEMALE_NAME_PATTERN =
  /zira|samantha|victoria|karen|moira|tessa|fiona|susan|google uk english female/i;

function isIndianLocale(voice: SpeechSynthesisVoice) {
  return /^en[-_]in$|^hi[-_]in$/i.test(voice.lang);
}

/**
 * Prefers an Indian-English female voice (e.g. Microsoft Heera / Google's en-IN
 * voice) so the assistant doesn't default to a US-accented system voice; falls
 * back to any other detectable female voice, then to any en-IN voice at all.
 */
export function pickFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const indianFemaleByName = voices.find(
    (v) => isIndianLocale(v) && INDIAN_FEMALE_NAME_PATTERN.test(v.name),
  );
  if (indianFemaleByName) return indianFemaleByName;

  const indianFemaleByKeyword = voices.find(
    (v) => isIndianLocale(v) && /female/i.test(v.name),
  );
  if (indianFemaleByKeyword) return indianFemaleByKeyword;

  const anyFemaleByName = voices.find((v) => INDIAN_FEMALE_NAME_PATTERN.test(v.name));
  if (anyFemaleByName) return anyFemaleByName;

  const anyFemaleByKeyword = voices.find((v) => /female/i.test(v.name));
  if (anyFemaleByKeyword) return anyFemaleByKeyword;

  const byGenericName = voices.find((v) => GENERIC_FEMALE_NAME_PATTERN.test(v.name));
  if (byGenericName) return byGenericName;

  const anyIndianVoice = voices.find(isIndianLocale);
  return anyIndianVoice ?? null;
}

export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const existingVoices = synth.getVoices();

  if (existingVoices.length > 0) {
    const voice = pickFemaleVoice(existingVoices);
    if (voice) utterance.voice = voice;
    synth.speak(utterance);
  } else {
    synth.addEventListener(
      "voiceschanged",
      () => {
        const voice = pickFemaleVoice(synth.getVoices());
        if (voice) utterance.voice = voice;
        synth.speak(utterance);
      },
      { once: true },
    );
  }
}
