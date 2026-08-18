import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApplicationForm } from "../../context/ApplicationFormContext";
import { useCapOption } from "../../context/CapOptionContext";
import { PAYMENT_AMOUNT } from "../../lib/applicationDraft";
import { CAP_ADMISSION_ROUNDS } from "../../data/capAdmissionRounds";
import { CaptchaField, generateCode } from "../../components/ui/CaptchaField";
import logo1 from "../../assets/logo-1.svg";
import logo2 from "../../assets/logo-2.svg";
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

const APPLICATION_NUMBER = "FYJC2026-00842";

const NETBANKING_BANKS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Kotak Mahindra Bank",
  "Canara Bank",
];

const MAIN_MENU: MenuOption[] = [
  { key: "application-status", label: "Application Status" },
  { key: "college-preferences", label: "College Preferences" },
  { key: "cap-allotment", label: "CAP Allotment" },
  { key: "payment-status", label: "Payment Status" },
  { key: "admission-details", label: "Admission Details" },
  { key: "documents", label: "Documents" },
  { key: "help", label: "Help" },
];

function nowTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function detectIntent(raw: string): string | null {
  const t = raw.toLowerCase();
  if (/(college|preference|selected)/.test(t)) return "college-preferences";
  if (/(cap|allot)/.test(t)) return "cap-allotment";
  if (/(payment|fee|paid|upi)/.test(t)) return "payment-status";
  if (/(document|upload)/.test(t)) return "documents";
  if (/(help|support|contact)/.test(t)) return "help";
  if (/(admission|summary|detail)/.test(t)) return "admission-details";
  if (/(application|form status)/.test(t)) return "application-status";
  return null;
}

export function WhatsAppPrototypePage() {
  const navigate = useNavigate();
  const statusBarTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const {
    registration,
    personal,
    category,
    marks,
    documents,
    payment,
    locked,
    resolvePayment,
  } = useApplicationForm();
  const { stream, medium, preferences, locked: capLocked } = useCapOption();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [draft, setDraft] = useState("");

  const [conversationStarted, setConversationStarted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginCta, setShowLoginCta] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [loginScreenOpen, setLoginScreenOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState(() => generateCode());
  const [captchaValue, setCaptchaValue] = useState("");
  const [loginError, setLoginError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const [showPayCta, setShowPayCta] = useState(false);
  const [payProcessing, setPayProcessing] = useState(false);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutTab, setCheckoutTab] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);

  const idRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const awaitingPayConfirmRef = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping, showPayCta, payProcessing, showMenu, showLoginCta]);

  useEffect(() => {
    if (!awaitingPayConfirmRef.current || payment.status !== "success") return;
    awaitingPayConfirmRef.current = false;
    setPayProcessing(false);
    pushBotMessage(
      `✅ *Payment Successful*\n\n₹${PAYMENT_AMOUNT} paid via UPI.\n` +
        `Transaction Ref: ${payment.transactionRef}\n` +
        `Date: ${payment.date}\n\n` +
        `Your Admission Fee receipt is now available in the portal.`,
    );
    window.setTimeout(() => {
      pushBotMessage("Is there anything else I can help you with?");
      setShowMenu(true);
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment.status]);

  function pushMessage(sender: "bot" | "user", text: string) {
    setMessages((prev) => [
      ...prev,
      { id: idRef.current++, sender, text, time: nowTime() },
    ]);
  }

  function pushBotMessage(text: string) {
    pushMessage("bot", text);
  }

  function respond(text: string, after?: () => void) {
    setShowMenu(false);
    setIsTyping(true);
    window.setTimeout(() => {
      setIsTyping(false);
      pushBotMessage(text);
      after?.();
    }, 700);
  }

  function respondThenMenu(text: string) {
    respond(text, () => {
      window.setTimeout(() => {
        pushBotMessage("Is there anything else I can help you with?");
        setShowMenu(true);
      }, 400);
    });
  }

  function respondAndShowMenu(text: string) {
    respond(text, () => {
      window.setTimeout(() => setShowMenu(true), 400);
    });
  }

  function computeMerit() {
    const totalMarks = marks.reduce((sum, row) => sum + (Number(row.marks) || 0), 0);
    const totalOutOf = marks.reduce((sum, row) => sum + (Number(row.outOf) || 0), 0);
    return totalOutOf > 0 ? ((totalMarks / totalOutOf) * 500).toFixed(2) : "0.00";
  }

  /* ---------------- Conversation start / login gate ---------------- */

  function startConversation() {
    setConversationStarted(true);
    respond(
      "Hi! 👋 Welcome to the FYJC Admission Assistant.\n\nI can help you access and manage your FYJC admission information through WhatsApp.\n\nTo continue, please login to your FYJC application.",
      () => window.setTimeout(() => setShowLoginCta(true), 400),
    );
  }

  function openLoginScreen() {
    setShowLoginCta(false);
    setLoginEmail("");
    setLoginPassword("");
    setShowPassword(false);
    setCaptchaValue("");
    setCaptchaCode(generateCode());
    setLoginError("");
    setLoginScreenOpen(true);
  }

  function handleCancelLogin() {
    setLoginScreenOpen(false);
    window.setTimeout(() => {
      pushMessage("user", "Cancel and return to chat");
      respond(
        "No worries — you can log in anytime to view your personal admission details.",
        () => window.setTimeout(() => setShowLoginCta(true), 400),
      );
    }, 320);
  }

  function handleSignIn() {
    if (!loginEmail.trim() || !loginPassword) {
      setLoginError("Please enter your login ID and password.");
      return;
    }
    if (captchaValue.trim().toUpperCase() !== captchaCode) {
      setLoginError("The code you entered does not match. Please try again.");
      setCaptchaCode(generateCode());
      setCaptchaValue("");
      return;
    }
    setLoginError("");
    setSigningIn(true);
    window.setTimeout(() => {
      setSigningIn(false);
      setIsLoggedIn(true);
      setLoginScreenOpen(false);
      window.setTimeout(() => {
        const firstName = personal.fullName.split(" ")[0] || "Applicant";
        respond(
          `Welcome back, ${firstName} 👋\nYour account is successfully connected.\nI can now help you with your FYJC admission details.`,
          () => {
            window.setTimeout(() => {
              pushBotMessage("How can I help you with your admission?");
              setShowMenu(true);
            }, 400);
          },
        );
      }, 320);
    }, 1000);
  }

  /* ---------------- Payment (simulated BillDesk checkout, in-chat) ---------------- */

  function handleOpenCheckout() {
    setShowPayCta(false);
    pushMessage("user", "Pay");
    setCheckoutTab("upi");
    setUpiId("");
    setCardNumber("");
    setCardName("");
    setCardExpiry("");
    setCardCvv("");
    setSelectedBank("");
    setCheckoutOpen(true);
  }

  function handleCancelCheckout() {
    setCheckoutOpen(false);
    window.setTimeout(() => {
      respondThenMenu(
        "No problem — you can pay anytime from here, or from the Admission Fee section of the portal.",
      );
    }, 320);
  }

  function handleCheckoutPay() {
    setCheckoutProcessing(true);
    awaitingPayConfirmRef.current = true;
    window.setTimeout(() => {
      setCheckoutProcessing(false);
      setCheckoutOpen(false);
      setPayProcessing(true);
      window.setTimeout(() => {
        resolvePayment("success");
      }, 900);
    }, 1400);
  }

  function handleCancelPay() {
    setShowPayCta(false);
    pushMessage("user", "Not now");
    respondThenMenu(
      "No problem — you can pay anytime from here, or from the Admission Fee section of the portal.",
    );
  }

  /* ---------------- Shared responder for menu clicks + free text ---------------- */

  function respondToKey(key: string) {
    switch (key) {
      case "application-status": {
        const uploadedCount = documents.filter((d) => d.fileName).length;
        respondThenMenu(
          `📄 *Application Status*\n\n` +
            `Application No.: ${APPLICATION_NUMBER}\n` +
            `Board: ${registration.board}\n` +
            `Merit (out of 500): ${computeMerit()}\n` +
            `Documents Uploaded: ${uploadedCount}/${documents.length}\n` +
            `Status: ${locked ? "✅ Locked & Submitted" : "🟡 In Progress"}`,
        );
        break;
      }
      case "college-preferences": {
        if (preferences.length === 0) {
          respondThenMenu(
            `🎓 *College Preferences*\n\nYou haven't added any Junior Colleges yet. Please visit the CAP Option section of the portal to get started.`,
          );
        } else {
          const list = preferences
            .slice(0, 5)
            .map((c, i) => `${i + 1}. ${c.name}`)
            .join("\n");
          const more =
            preferences.length > 5 ? `\n…and ${preferences.length - 5} more` : "";
          respondThenMenu(
            `🎓 *College Preferences*\n\nYour Priority 1 preference is *${preferences[0].name}*.\n\n${list}${more}\n\n(${preferences.length}/10 total preferences filled)`,
          );
        }
        break;
      }
      case "cap-allotment": {
        const allotted = CAP_ADMISSION_ROUNDS.find((r) => r.activity === "Allotted");
        if (allotted) {
          respondThenMenu(
            `🏫 *CAP Allotment*\n\nRound: ${allotted.round}\nAllotted College: ${allotted.collegeName}\nStream Code: ${allotted.streamCode}\nStatus: ${allotted.status}`,
          );
        } else {
          respondThenMenu(
            `🏫 *CAP Allotment*\n\nStatus: 🟡 Awaiting Allotment\n\nNo round has been allotted yet. Your CAP Round 1 allotment result will be announced soon — check back after the round closes.`,
          );
        }
        break;
      }
      case "payment-status": {
        if (payment.status === "success") {
          respondThenMenu(
            `💳 *Payment Status*\n\nStatus: ✅ SUCCESS\nTransaction Ref: ${payment.transactionRef}\nMode: ${payment.mode}\nDate: ${payment.date}`,
          );
        } else {
          const statusLine =
            payment.status === "failed"
              ? "Status: ❌ FAILED\n\nYour last attempt didn't go through — no amount was deducted."
              : "Status: 🟡 PENDING\n\nNo payment has been made yet.";
          respond(
            `💳 *Payment Status*\n\n${statusLine}\n\nYou can pay your ₹${PAYMENT_AMOUNT} Admission Fee right here via UPI.`,
          );
          window.setTimeout(() => setShowPayCta(true), 1100);
        }
        break;
      }
      case "admission-details": {
        respondThenMenu(
          `📋 *Admission Details*\n\n` +
            `Applicant Name: ${personal.fullName}\n` +
            `Application No.: ${APPLICATION_NUMBER}\n` +
            `Category: ${category.admissionCategory}\n` +
            `Stream: ${stream || "Not selected"}\n` +
            `Medium: ${medium || "Not selected"}\n` +
            `Application Status: ${locked ? "✅ Verified & Submitted" : "🟡 In Progress"}\n` +
            `CAP Option Status: ${capLocked ? "✅ Locked & Submitted" : "🟡 In Progress"}\n` +
            `Payment Status: ${payment.status === "success" ? "✅ Paid" : "🟡 Pending"}`,
        );
        break;
      }
      case "documents": {
        const lines = documents
          .map((d) => `${d.fileName ? "✅" : "⬜"} ${d.name}${d.fileName ? "" : " — Not Uploaded"}`)
          .join("\n");
        respondThenMenu(`📎 *Document Status*\n\n${lines}`);
        break;
      }
      case "help": {
        respondThenMenu(
          `🧑‍💻 *Help*\n\nThis is a prototype, so live chat isn't available here.\n\nIn production, this option would connect you to a support agent or open a ticket automatically.`,
        );
        break;
      }
      default:
        respondAndShowMenu("I'm not sure I understood that. Here are some things I can help you with:");
    }
  }

  function handleOption(option: MenuOption) {
    pushMessage("user", option.label);
    respondToKey(option.key);
  }

  function handleSend() {
    const text = draft.trim();
    if (!text) return;
    pushMessage("user", text);
    setDraft("");

    if (!conversationStarted) {
      if (text.toLowerCase() === "hi") {
        startConversation();
      } else {
        respond('Please type "Hi" to start chatting with the FYJC Admission Assistant.');
      }
      return;
    }

    if (!isLoggedIn) {
      respond(
        "I can help you with your FYJC admission application, payment, college preferences, CAP allotment and more.\n\nTo view your personal admission details, please login to your FYJC account.",
        () => window.setTimeout(() => setShowLoginCta(true), 400),
      );
      return;
    }

    const intentKey = detectIntent(text);
    if (intentKey) {
      respondToKey(intentKey);
    } else {
      respondAndShowMenu("I'm not sure I understood that. Here are some things I can help you with:");
    }
  }

  return (
    <div className="wa-page">
      <div className="wa-phone">
        <div className="wa-status-bar">
          <span className="wa-status-time">{statusBarTime}</span>
          <div className="wa-status-icons">
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon />
            <span>80%</span>
          </div>
        </div>

        <div className="wa-header">
          <button
            type="button"
            className="wa-header-back"
            aria-label="Back"
            onClick={() => navigate("/dashboard")}
          >
            <BackArrowIcon />
          </button>
          <div className="wa-header-avatar-wrap">
            <span className="wa-header-avatar" aria-hidden="true">
              <img src={logo2} alt="" className="wa-header-avatar-img" />
            </span>
            <span className="wa-header-avatar-badge">FYJC</span>
          </div>
          <div className="wa-header-text">
            <span className="wa-header-name">
              FYJC Admission Assistant
              <VerifiedIcon />
            </span>
            <span className="wa-header-status">
              {isTyping ? "typing…" : "online"}
            </span>
          </div>
          <button type="button" className="wa-header-menu" aria-label="More options">
            <KebabIcon />
          </button>
        </div>

        <div className="wa-chat" ref={scrollRef}>
          <div className="wa-meta-notice">
            <InfoIcon />
            <span>
              This business uses a secure service from Meta to manage this
              chat. Tap to learn more.
            </span>
          </div>
          <div className="wa-date-divider">
            <span>Today</span>
          </div>

          {messages.length === 0 && (
            <p className="wa-empty-hint">Type &ldquo;Hi&rdquo; to start chatting</p>
          )}

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
                <span className="wa-bubble-time">
                  {message.time}
                  {message.sender === "user" && <TicksIcon />}
                </span>
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

          {showLoginCta && !isTyping && (
            <>
              <div className="wa-bubble-row">
                <div className="wa-login-cta-card">
                  <p className="wa-login-cta-title">Login to FYJC Portal</p>
                  <p className="wa-login-cta-desc">
                    Click the button below to securely login to your FYJC
                    admission application.
                  </p>
                  <span className="wa-bubble-time">{nowTime()}</span>
                </div>
              </div>
              <button
                type="button"
                className="wa-login-cta-link"
                onClick={openLoginScreen}
              >
                <ExternalLinkIcon /> Login to FYJC Portal
              </button>
            </>
          )}

          {showPayCta && !isTyping && !payProcessing && (
            <div className="wa-pay-card">
              <div className="wa-pay-card-head">
                <span className="wa-pay-card-icon" aria-hidden="true">
                  <UpiIcon />
                </span>
                <div className="wa-pay-card-text">
                  <span className="wa-pay-card-title">Admission Fee Payment</span>
                  <span className="wa-pay-card-amount">₹{PAYMENT_AMOUNT}</span>
                </div>
              </div>
              <button type="button" className="wa-pay-btn" onClick={handleOpenCheckout}>
                Pay
              </button>
              <button type="button" className="wa-pay-cancel" onClick={handleCancelPay}>
                Not now
              </button>
            </div>
          )}

          {payProcessing && (
            <div className="wa-bubble-row">
              <div className="wa-bubble wa-bubble--bot wa-bubble--typing wa-bubble--paying">
                <span className="wa-typing-dot" />
                <span className="wa-typing-dot" />
                <span className="wa-typing-dot" />
                <span className="wa-pay-processing-text">Processing payment…</span>
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
          <div className="wa-input-pill">
            <span className="wa-input-icon" aria-hidden="true">
              <EmojiIcon />
            </span>
            <input
              type="text"
              className="wa-input"
              placeholder="Message"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <span className="wa-input-icon" aria-hidden="true">
              <PaperclipIcon />
            </span>
            <span className="wa-input-icon" aria-hidden="true">
              <CameraIcon />
            </span>
          </div>
          <button
            type="button"
            className="wa-send-btn"
            aria-label="Send"
            onClick={handleSend}
          >
            <SendIcon />
          </button>
        </div>

        {/* Simulated FYJC Portal login — slides in over the chat, matching the
            existing portal's Sign In screen, and slides back out to return to
            the SAME conversation. */}
        <div
          className={`wa-login-screen ${loginScreenOpen ? "wa-login-screen--open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-hidden={!loginScreenOpen}
        >
          <div className="wa-login-topbar">
            <div className="wa-login-topbar-row">
              <button
                type="button"
                className="wa-login-back"
                aria-label="Back to chat"
                onClick={handleCancelLogin}
              >
                <BackIcon />
              </button>
              <span className="wa-login-en-pill">EN</span>
            </div>
            <div className="wa-login-brand">
              <img src={logo1} alt="" className="wa-login-brand-logo" />
              <img src={logo2} alt="" className="wa-login-brand-logo" />
              <div>
                <p className="wa-login-brand-title">Government of Maharashtra</p>
                <p className="wa-login-brand-sub">
                  Std. 11th FYJC Admission Portal 2026&ndash;27
                </p>
              </div>
            </div>
          </div>

          <div className="wa-login-body">
            <h2 className="wa-login-heading">Sign In</h2>
            <p className="wa-login-subheading">
              Enter your credentials to access your FYJC admission account.
            </p>

            <label className="wa-login-field-label" htmlFor="wa-login-email">
              Login ID or Email
            </label>
            <div className="wa-login-field-wrap">
              <span className="wa-login-field-icon" aria-hidden="true">
                <MailIcon />
              </span>
              <input
                id="wa-login-email"
                type="text"
                className="wa-login-input"
                placeholder="e.g. name@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <label className="wa-login-field-label" htmlFor="wa-login-password">
              Password
            </label>
            <div className="wa-login-field-wrap">
              <span className="wa-login-field-icon" aria-hidden="true">
                <LockIcon />
              </span>
              <input
                id="wa-login-password"
                type={showPassword ? "text" : "password"}
                className="wa-login-input wa-login-input--password"
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSignIn();
                }}
              />
              <button
                type="button"
                className="wa-login-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className="wa-login-row-between">
              <label className="wa-login-checkbox">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="wa-login-link" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            <label className="wa-login-field-label">Security Check</label>
            <CaptchaField
              value={captchaValue}
              onChange={setCaptchaValue}
              code={captchaCode}
              onRefresh={setCaptchaCode}
            />

            {loginError && <p className="wa-login-error">{loginError}</p>}
          </div>

          <div className="wa-login-footer">
            <button
              type="button"
              className="wa-login-submit"
              disabled={signingIn}
              onClick={handleSignIn}
            >
              {signingIn ? "Signing in…" : "Sign In"}
            </button>
            <button type="button" className="wa-login-cancel" onClick={handleCancelLogin}>
              Cancel and return to chat
            </button>
            <p className="wa-login-footnote">
              Need help? Contact your junior college office or visit the Help Centre.
            </p>
          </div>
        </div>

        {/* Simulated BillDesk-style checkout — slides in over the chat like
            the sign-in screen. In production this step would be a redirect
            to (or embedded SDK from) BillDesk's own hosted checkout, which
            already shows UPI/Card/Netbanking; this prototype mimics that
            same shape entirely client-side. */}
        <div
          className={`wa-checkout-screen ${checkoutOpen ? "wa-checkout-screen--open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-hidden={!checkoutOpen}
        >
          <div className="wa-checkout-topbar">
            <button
              type="button"
              className="wa-login-back"
              aria-label="Back to chat"
              onClick={handleCancelCheckout}
              disabled={checkoutProcessing}
            >
              <BackIcon />
            </button>
            <div className="wa-checkout-topbar-text">
              <span className="wa-checkout-topbar-title">Secure Checkout</span>
              <span className="wa-checkout-topbar-sub">via BillDesk (prototype)</span>
            </div>
            <LockBadgeIcon />
          </div>

          <div className="wa-checkout-amount">
            <span className="wa-checkout-amount-label">Amount Payable</span>
            <span className="wa-checkout-amount-value">₹{PAYMENT_AMOUNT}</span>
          </div>

          {checkoutProcessing ? (
            <div className="wa-checkout-processing">
              <span className="wa-checkout-spinner" aria-hidden="true" />
              <p>Processing your payment securely…</p>
              <p className="wa-checkout-processing-note">Do not close or refresh this screen.</p>
            </div>
          ) : (
            <>
              <div className="wa-checkout-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={checkoutTab === "upi"}
                  className={`wa-checkout-tab ${checkoutTab === "upi" ? "wa-checkout-tab--active" : ""}`}
                  onClick={() => setCheckoutTab("upi")}
                >
                  <UpiIcon /> UPI
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={checkoutTab === "card"}
                  className={`wa-checkout-tab ${checkoutTab === "card" ? "wa-checkout-tab--active" : ""}`}
                  onClick={() => setCheckoutTab("card")}
                >
                  <CardIcon /> Card
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={checkoutTab === "netbanking"}
                  className={`wa-checkout-tab ${checkoutTab === "netbanking" ? "wa-checkout-tab--active" : ""}`}
                  onClick={() => setCheckoutTab("netbanking")}
                >
                  <BankIcon /> Netbanking
                </button>
              </div>

              <div className="wa-checkout-body">
                {checkoutTab === "upi" && (
                  <div className="wa-checkout-panel">
                    <label className="wa-login-field-label" htmlFor="wa-checkout-upi">
                      UPI ID
                    </label>
                    <div className="wa-login-field-wrap">
                      <input
                        id="wa-checkout-upi"
                        type="text"
                        className="wa-login-input wa-checkout-input--no-icon"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                    <p className="wa-checkout-hint">
                      You'll get a payment request on your UPI app to approve.
                    </p>
                  </div>
                )}

                {checkoutTab === "card" && (
                  <div className="wa-checkout-panel">
                    <label className="wa-login-field-label" htmlFor="wa-checkout-card-number">
                      Card Number
                    </label>
                    <div className="wa-login-field-wrap">
                      <input
                        id="wa-checkout-card-number"
                        type="text"
                        inputMode="numeric"
                        maxLength={19}
                        className="wa-login-input wa-checkout-input--no-icon"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                    <label className="wa-login-field-label" htmlFor="wa-checkout-card-name">
                      Name on Card
                    </label>
                    <div className="wa-login-field-wrap">
                      <input
                        id="wa-checkout-card-name"
                        type="text"
                        className="wa-login-input wa-checkout-input--no-icon"
                        placeholder="Applicant name"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                    <div className="wa-checkout-row">
                      <div>
                        <label className="wa-login-field-label" htmlFor="wa-checkout-expiry">
                          Expiry
                        </label>
                        <div className="wa-login-field-wrap">
                          <input
                            id="wa-checkout-expiry"
                            type="text"
                            maxLength={5}
                            className="wa-login-input wa-checkout-input--no-icon"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="wa-login-field-label" htmlFor="wa-checkout-cvv">
                          CVV
                        </label>
                        <div className="wa-login-field-wrap">
                          <input
                            id="wa-checkout-cvv"
                            type="password"
                            inputMode="numeric"
                            maxLength={3}
                            className="wa-login-input wa-checkout-input--no-icon"
                            placeholder="123"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {checkoutTab === "netbanking" && (
                  <div className="wa-checkout-panel">
                    <label className="wa-login-field-label" htmlFor="wa-checkout-bank">
                      Select Bank
                    </label>
                    <select
                      id="wa-checkout-bank"
                      className="wa-checkout-select"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      <option value="">Choose your bank</option>
                      {NETBANKING_BANKS.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                    <p className="wa-checkout-hint">
                      You'll be redirected to your bank's site to complete payment.
                    </p>
                  </div>
                )}
              </div>

              <div className="wa-checkout-footer">
                <button
                  type="button"
                  className="wa-login-submit"
                  onClick={handleCheckoutPay}
                >
                  Pay ₹{PAYMENT_AMOUNT} Securely
                </button>
                <p className="wa-checkout-footnote">
                  <LockBadgeIcon /> 256-bit encrypted · Demo checkout, no real transaction occurs
                </p>
              </div>
            </>
          )}
        </div>
      </div>
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

function SignalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="1" y="15" width="4" height="7" rx="1" />
      <rect x="8" y="11" width="4" height="11" rx="1" />
      <rect x="15" y="7" width="4" height="15" rx="1" />
      <rect x="19" y="2" width="4" height="20" rx="1" opacity="0.35" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M2 8.5a17 17 0 0 1 20 0" strokeLinecap="round" />
      <path d="M5.5 12.5a12 12 0 0 1 13 0" strokeLinecap="round" />
      <path d="M9 16.5a6.5 6.5 0 0 1 6 0" strokeLinecap="round" />
      <circle cx="12" cy="20" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 26 14" fill="none">
      <rect x="1" y="1" width="21" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="23" y="4.5" width="2" height="5" rx="1" fill="currentColor" />
      <rect x="3" y="3" width="17" height="8" rx="1.2" fill="currentColor" />
    </svg>
  );
}

function BackArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M5 12l7-7M5 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#4fc3f7">
      <path d="M12 2 14.5 4.5 18 3.8 18.7 7.3 21.5 9.5 20 13l1.5 3.5-3.3 1.5-1 3.5-3.6-.7L12 22l-1.6-2.7-3.6.7-1-3.5L2.5 15 4 11.5 1.5 9.3 4.7 7.3 5.4 3.8l3.5.7Z" />
      <path d="M8.5 12.2l2.3 2.3 4.7-4.9" stroke="#ffffff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KebabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TicksIcon() {
  return (
    <svg width="16" height="11" viewBox="0 0 18 11" fill="none" className="wa-ticks">
      <path d="M1 5.5 4.5 9 11 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 5.5 10 9 16.5 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 4h6v6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 4 10 14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmojiIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
      <path d="M8 14.5a5 5 0 0 0 8 0" strokeLinecap="round" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17.5 6.5 9 15a3 3 0 0 0 4.24 4.24l8-8a5 5 0 0 0-7.07-7.07l-8 8a7 7 0 0 0 9.9 9.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
      <circle cx="12" cy="13.5" r="3.2" />
    </svg>
  );
}

function UpiIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12h9M9 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <path d="M2.5 10h19" />
      <path d="M6 14.5h4" strokeLinecap="round" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10l9-6 9 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 10v9M9 10v9M15 10v9M19.5 10v9" strokeLinecap="round" />
      <path d="M2.5 19h19" strokeLinecap="round" />
    </svg>
  );
}

function LockBadgeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="9" rx="2" strokeLinejoin="round" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.6 21.6 0 0 1 5.06-5.94M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 7 11 7a21.6 21.6 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
