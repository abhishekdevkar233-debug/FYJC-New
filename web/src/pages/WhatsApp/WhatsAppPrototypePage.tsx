import { useEffect, useRef, useState } from "react";
import { useApplicationForm } from "../../context/ApplicationFormContext";
import { useCapOption } from "../../context/CapOptionContext";
import { useQuota } from "../../context/QuotaContext";
import "./WhatsAppPrototypePage.css";

interface ChatMessage {
  id: number;
  sender: "bot" | "user";
  text: string;
  time: string;
}

interface MenuOption {
  key: string;
  label: string;
}

const MAIN_MENU: MenuOption[] = [
  { key: "application-status", label: "1. Application Form Status" },
  { key: "lock-status", label: "2. Lock / Unlock Status" },
  { key: "payment-status", label: "3. Payment Status" },
  { key: "cap-option-status", label: "4. CAP Option (Part II) Status" },
  { key: "quota-status", label: "5. Quota Choices Status" },
  { key: "grievance-status", label: "6. Grievance Status" },
  { key: "talk-to-support", label: "7. Talk to Support" },
];

function nowTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function WhatsAppPrototypePage() {
  const { registration, category, marks, documents, payment, locked } =
    useApplicationForm();
  const { stream, medium, preferences, locked: capLocked } = useCapOption();
  const { selections, savedAt } = useQuota();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showMenu, setShowMenu] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const idRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    pushBotMessage(
      "Namaste! 🙏 Welcome to the FYJC Admission Assistant.\n\nI can help you check your application status, lock/unlock status, payments, CAP options, quota choices, and grievances.\n\nHow can I help you today?",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  function pushMessage(sender: "bot" | "user", text: string) {
    setMessages((prev) => [
      ...prev,
      { id: idRef.current++, sender, text, time: nowTime() },
    ]);
  }

  function pushBotMessage(text: string) {
    pushMessage("bot", text);
  }

  function respondWithTyping(text: string, menuAfter = true) {
    setShowMenu(false);
    setIsTyping(true);
    window.setTimeout(() => {
      setIsTyping(false);
      pushBotMessage(text);
      if (menuAfter) {
        window.setTimeout(() => {
          pushBotMessage("Is there anything else I can help you with?");
          setShowMenu(true);
        }, 400);
      }
    }, 700);
  }

  function computeMerit() {
    const totalMarks = marks.reduce((sum, row) => sum + (Number(row.marks) || 0), 0);
    const totalOutOf = marks.reduce((sum, row) => sum + (Number(row.outOf) || 0), 0);
    return totalOutOf > 0 ? ((totalMarks / totalOutOf) * 500).toFixed(2) : "0.00";
  }

  function handleOption(option: MenuOption) {
    pushMessage("user", option.label);

    switch (option.key) {
      case "application-status": {
        const uploadedCount = documents.filter((d) => d.fileName).length;
        respondWithTyping(
          `📄 *Application Form Status*\n\n` +
            `Board: ${registration.board}\n` +
            `Seat Number: ${registration.seatNumber}\n` +
            `Exam: ${registration.month} ${registration.year}\n` +
            `Category: ${category.admissionCategory}\n` +
            `Merit (out of 500): ${computeMerit()}\n` +
            `Documents Uploaded: ${uploadedCount}/${documents.length}\n` +
            `Status: ${locked ? "✅ Locked & Submitted" : "🟡 In Progress"}`,
        );
        break;
      }
      case "lock-status": {
        respondWithTyping(
          `🔒 *Lock / Unlock Status*\n\n` +
            `Application Form (Part I): ${locked ? "🔒 Locked" : "🔓 Unlocked"}\n` +
            `CAP Option Form (Part II): ${capLocked ? "🔒 Locked" : "🔓 Unlocked"}\n\n` +
            (locked
              ? "Your form is locked and submitted for verification."
              : "You can still edit your Application Form. Lock it once you're sure all details are correct."),
        );
        break;
      }
      case "payment-status": {
        if (payment.status === "success") {
          respondWithTyping(
            `💳 *Payment Status*\n\n` +
              `Status: ✅ SUCCESS\n` +
              `Transaction Ref: ${payment.transactionRef}\n` +
              `Mode: ${payment.mode}\n` +
              `Date: ${payment.date}`,
          );
        } else if (payment.status === "failed") {
          respondWithTyping(
            `💳 *Payment Status*\n\nStatus: ❌ FAILED\n\nPlease retry the payment from the Admission Fee section of the portal.`,
          );
        } else {
          respondWithTyping(
            `💳 *Payment Status*\n\nStatus: 🟡 PENDING\n\nNo payment has been made yet. Please complete your Admission Fee payment from the portal to proceed.`,
          );
        }
        break;
      }
      case "cap-option-status": {
        if (preferences.length === 0) {
          respondWithTyping(
            `🎓 *CAP Option (Part II) Status*\n\nYou haven't selected a stream/medium or any Junior Colleges yet. Please visit the CAP Option section of the portal to get started.`,
          );
        } else {
          const topChoice = preferences[0];
          respondWithTyping(
            `🎓 *CAP Option (Part II) Status*\n\n` +
              `Stream: ${stream || "Not selected"}\n` +
              `Medium: ${medium || "Not selected"}\n` +
              `Colleges Selected: ${preferences.length}/10\n` +
              `Priority 1: ${topChoice.name}\n` +
              `Status: ${capLocked ? "✅ Locked & Submitted" : "🟡 In Progress"}`,
          );
        }
        break;
      }
      case "quota-status": {
        const inHouseCount = selections.inHouse.length;
        const minorityCount = selections.minority.length;
        const managementCount = selections.management.length;
        respondWithTyping(
          `🏫 *Quota Choices (Part II) Status*\n\n` +
            `In-House Quota: ${inHouseCount} college(s) — last saved ${savedAt.inHouse}\n` +
            `Minority Quota: ${minorityCount} college(s) — last saved ${savedAt.minority}\n` +
            `Management Quota: ${managementCount} college(s) — last saved ${savedAt.management}\n\n` +
            `Note: In-House Quota is disabled during the Special Round.`,
        );
        break;
      }
      case "grievance-status": {
        respondWithTyping(
          `📮 *Grievance Status*\n\n` +
            `Open Tickets: 1 (Merit List Query — PENDING)\n` +
            `Resolved Tickets: 1 (Technical Query — RESOLVED)\n\n` +
            `You can raise a new grievance anytime from the Miscellaneous > Grievance section.`,
        );
        break;
      }
      case "talk-to-support": {
        respondWithTyping(
          `🧑‍💻 *Talk to Support*\n\nThis is a prototype, so live chat isn't available here.\n\nIn production, this option would connect you to a support agent or open a ticket automatically.`,
          false,
        );
        window.setTimeout(() => setShowMenu(true), 900);
        break;
      }
      default:
        respondWithTyping("Sorry, I didn't understand that. Please choose an option below.");
    }
  }

  function handleSend() {
    const text = draft.trim();
    if (!text) return;
    pushMessage("user", text);
    setDraft("");
    respondWithTyping(
      "I can only respond to the menu options for now 🙂 Please choose one below.",
    );
  }

  return (
    <div className="wa-page">
      <div className="wa-phone">
        <div className="wa-header">
          <span className="wa-header-avatar" aria-hidden="true">
            🎓
          </span>
          <div className="wa-header-text">
            <span className="wa-header-name">FYJC Admission Assistant</span>
            <span className="wa-header-status">
              {isTyping ? "typing…" : "online"}
            </span>
          </div>
          <span className="wa-header-badge">Prototype</span>
        </div>

        <div className="wa-chat" ref={scrollRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`wa-bubble-row ${message.sender === "user" ? "wa-bubble-row--user" : ""}`}
            >
              <div
                className={`wa-bubble ${message.sender === "user" ? "wa-bubble--user" : "wa-bubble--bot"}`}
              >
                {message.text.split("\n").map((line, i) => (
                  <span key={i} className="wa-bubble-line">
                    {renderLine(line)}
                  </span>
                ))}
                <span className="wa-bubble-time">{message.time}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="wa-bubble-row">
              <div className="wa-bubble wa-bubble--bot wa-bubble--typing">
                <span className="wa-typing-dot" />
                <span className="wa-typing-dot" />
                <span className="wa-typing-dot" />
              </div>
            </div>
          )}

          {showMenu && !isTyping && (
            <div className="wa-menu">
              {MAIN_MENU.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className="wa-menu-btn"
                  onClick={() => handleOption(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="wa-input-bar">
          <input
            type="text"
            className="wa-input"
            placeholder="Type a message"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            type="button"
            className="wa-send-btn"
            aria-label="Send"
            onClick={handleSend}
          >
            <SendIcon />
          </button>
        </div>
      </div>

      <p className="wa-disclaimer">
        This is a simulated WhatsApp prototype for demo purposes only — no
        real messages are sent, and no WhatsApp account is connected.
      </p>
    </div>
  );
}

function renderLine(line: string) {
  const parts = line.split(/(\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 1) {
      return <strong key={i}>{part.slice(1, -1)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 20l18-8L3 4v6l12 2-12 2v6Z" />
    </svg>
  );
}
