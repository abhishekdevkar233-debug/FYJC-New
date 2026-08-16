import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useApplicationForm } from "../../context/ApplicationFormContext";
import { useCapOption } from "../../context/CapOptionContext";
import { useQuota } from "../../context/QuotaContext";
import {
  answerQuestion,
  describeCurrentLocation,
  type AssistantAppState,
} from "../../lib/assistantContext";
import "./AiAssistant.css";

interface ChatMessage {
  id: number;
  sender: "bot" | "user";
  text: string;
}

type Mode = "text" | "voice";
type VoiceState = "idle" | "listening" | "speaking" | "error";

const SUGGESTED_QUESTIONS = [
  "Where am I?",
  "What should I do next?",
  "Summarize my application",
  "How does this step work?",
];

function pickFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const byKeyword = voices.find((v) => /female/i.test(v.name));
  if (byKeyword) return byKeyword;
  const byName = voices.find((v) =>
    /zira|samantha|victoria|karen|moira|tessa|fiona|susan|google uk english female/i.test(v.name),
  );
  return byName ?? null;
}

export function AiAssistant() {
  const location = useLocation();
  const appForm = useApplicationForm();
  const capOption = useCapOption();
  const quota = useQuota();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("text");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState("");

  const idRef = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const lastGreetedPath = useRef<string | null>(null);

  const speechSupported =
    typeof window !== "undefined" &&
    !!(window as any).speechSynthesis &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  function buildState(): AssistantAppState {
    return {
      pathname: location.pathname,
      registration: appForm.registration,
      personal: appForm.personal,
      category: appForm.category,
      marks: appForm.marks,
      documents: appForm.documents,
      payment: appForm.payment,
      formCurrent: appForm.current,
      formLocked: appForm.locked,
      capStream: capOption.stream,
      capMedium: capOption.medium,
      capPreferences: capOption.preferences,
      capCurrent: capOption.current,
      capLocked: capOption.locked,
      quotaSelections: quota.selections,
    };
  }

  function pushMessage(sender: "bot" | "user", text: string) {
    setMessages((prev) => [...prev, { id: idRef.current++, sender, text }]);
  }

  function speak(text: string) {
    if (!speechSupported) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const voice = pickFemaleVoice(voices);
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setVoiceState("speaking");
    utterance.onend = () => setVoiceState("idle");
    utterance.onerror = () => setVoiceState("idle");
    synth.speak(utterance);
  }

  function respond(question: string, spokenReply: boolean) {
    const answer = answerQuestion(question, buildState());
    pushMessage("bot", answer.text);
    if (spokenReply) speak(answer.text);
  }

  function handleAsk(question: string) {
    if (!question.trim()) return;
    pushMessage("user", question);
    setDraft("");
    respond(question, mode === "voice");
  }

  function handleOpen() {
    setOpen(true);
    if (lastGreetedPath.current !== location.pathname) {
      lastGreetedPath.current = location.pathname;
      const greeting = describeCurrentLocation(buildState());
      pushMessage("bot", greeting);
      if (mode === "voice") speak(greeting);
    }
  }

  function handleClose() {
    setOpen(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    window.speechSynthesis?.cancel();
    setVoiceState("idle");
  }

  function startListening() {
    setVoiceError(null);
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setVoiceState("error");
      setVoiceError("Voice input isn't supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceState("listening");
      setLiveTranscript("");
    };
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setLiveTranscript(transcript);
      if (event.results[event.results.length - 1].isFinal) {
        setVoiceState("idle");
        handleAsk(transcript);
        setLiveTranscript("");
      }
    };
    recognition.onerror = (event: any) => {
      setVoiceState("error");
      setVoiceError(
        event.error === "not-allowed"
          ? "Microphone access was denied. Please allow microphone access to use voice input."
          : "Something went wrong while listening. Please try again.",
      );
    };
    recognition.onend = () => {
      setVoiceState((prev) => (prev === "listening" ? "idle" : prev));
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setVoiceState("idle");
  }

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, liveTranscript]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  function switchMode(next: Mode) {
    setMode(next);
    setVoiceError(null);
    setVoiceState("idle");
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
  }

  return (
    <div className="ai-assistant">
      {open && (
        <div className="ai-assistant-panel" role="dialog" aria-label="AI Assistant">
          <div className="ai-assistant-header">
            <span className="ai-assistant-header-title">
              <AssistantIcon />
              Portal Assistant
            </span>
            <button
              type="button"
              className="ai-assistant-close"
              aria-label="Close assistant"
              onClick={handleClose}
            >
              <CloseIcon />
            </button>
          </div>

          <div className="ai-assistant-tabs" role="tablist" aria-label="Interaction mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "text"}
              className={`ai-assistant-tab ${mode === "text" ? "ai-assistant-tab--active" : ""}`}
              onClick={() => switchMode("text")}
            >
              Text Chat
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "voice"}
              className={`ai-assistant-tab ${mode === "voice" ? "ai-assistant-tab--active" : ""}`}
              onClick={() => switchMode("voice")}
            >
              Voice
            </button>
          </div>

          <div className="ai-assistant-body" ref={listRef}>
            {messages.length === 0 ? (
              <div className="ai-assistant-empty">
                <AssistantIcon />
                <p>Ask me about your current step, form data, or what to do next.</p>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`ai-assistant-msg-row ${m.sender === "user" ? "ai-assistant-msg-row--user" : ""}`}
                >
                  <div
                    className={`ai-assistant-msg ${m.sender === "user" ? "ai-assistant-msg--user" : "ai-assistant-msg--bot"}`}
                  >
                    {m.text}
                  </div>
                </div>
              ))
            )}

            {mode === "voice" && liveTranscript && (
              <div className="ai-assistant-msg-row ai-assistant-msg-row--user">
                <div className="ai-assistant-msg ai-assistant-msg--user ai-assistant-msg--interim">
                  {liveTranscript}
                </div>
              </div>
            )}

            {messages.length > 0 && (
              <div className="ai-assistant-suggestions">
                {SUGGESTED_QUESTIONS.map((sq) => (
                  <button
                    key={sq}
                    type="button"
                    className="ai-assistant-suggestion"
                    onClick={() => handleAsk(sq)}
                  >
                    {sq}
                  </button>
                ))}
              </div>
            )}
          </div>

          {mode === "text" ? (
            <form
              className="ai-assistant-input-bar"
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk(draft);
              }}
            >
              <input
                type="text"
                className="ai-assistant-input"
                placeholder="Type your question…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button type="submit" className="ai-assistant-send" aria-label="Send">
                <SendIcon />
              </button>
            </form>
          ) : (
            <div className="ai-assistant-voice-bar">
              {!speechSupported ? (
                <p className="ai-assistant-voice-unsupported">
                  Voice mode isn't supported in this browser. Please use Text Chat instead.
                </p>
              ) : (
                <>
                  <button
                    type="button"
                    className={`ai-assistant-mic ${voiceState === "listening" ? "ai-assistant-mic--listening" : ""}`}
                    onClick={voiceState === "listening" ? stopListening : startListening}
                    aria-label={voiceState === "listening" ? "Stop listening" : "Start speaking"}
                  >
                    <MicIcon />
                  </button>
                  <p className="ai-assistant-voice-status">
                    {voiceState === "listening" && "Listening… speak your question"}
                    {voiceState === "speaking" && "Speaking…"}
                    {voiceState === "error" && (voiceError ?? "Something went wrong.")}
                    {voiceState === "idle" && "Tap the mic and ask a question"}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className="ai-assistant-fab"
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        onClick={open ? handleClose : handleOpen}
      >
        {open ? <CloseIcon /> : <AssistantIcon />}
      </button>
    </div>
  );
}

function AssistantIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="7" width="16" height="12" rx="3" />
      <path d="M9 3v4M15 3v4" strokeLinecap="round" />
      <circle cx="9" cy="13" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="1.2" fill="currentColor" stroke="none" />
      <path d="M9 16.5h6" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M5 5l14 14M19 5 5 19" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 20l18-8L3 4v6l12 2-12 2v6Z" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" strokeLinecap="round" />
      <path d="M12 18v4M9 22h6" strokeLinecap="round" />
    </svg>
  );
}
