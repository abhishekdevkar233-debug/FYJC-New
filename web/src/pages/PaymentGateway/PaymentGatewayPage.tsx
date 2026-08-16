import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { PAYMENT_AMOUNT } from "../../lib/applicationDraft";
import { useApplicationForm } from "../../context/ApplicationFormContext";
import "./PaymentGatewayPage.css";

type GatewayState = "idle" | "processing" | "success" | "failed";
type PaymentMethod = "qr" | "card" | "upi";

const METHODS: {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  icon: JSX.Element;
}[] = [
  {
    id: "qr",
    title: "Scan & Pay with QR",
    subtitle: "Scan QR code using any UPI app and pay securely",
    icon: <QrIcon />,
  },
  {
    id: "card",
    title: "Pay with Card",
    subtitle: "Pay using debit card, credit card or prepaid card",
    icon: <CardIcon />,
  },
  {
    id: "upi",
    title: "Pay with UPI",
    subtitle: "Pay using any UPI app like PhonePe, Google Pay, Paytm etc.",
    icon: <UpiIcon />,
  },
];

export function PaymentGatewayPage() {
  const navigate = useNavigate();
  const { resolvePayment: setPaymentResult } = useApplicationForm();
  const [state, setState] = useState<GatewayState>("idle");
  const [expanded, setExpanded] = useState<PaymentMethod | null>("qr");

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  function resolvePayment(result: "success" | "failed") {
    setState("processing");
    window.setTimeout(() => {
      setState(result);
      setPaymentResult(result);
      window.setTimeout(() => {
        navigate("/application-form");
      }, 1600);
    }, 1000);
  }

  function toggleMethod(method: PaymentMethod) {
    setExpanded((prev) => (prev === method ? null : method));
  }

  return (
    <div className="pay-gateway-page">
      <div className="pay-gateway-card">
        {state === "idle" && (
          <>
            <div className="pay-gateway-brand">
              <span className="pay-gateway-emblem" aria-hidden="true">
                FY
              </span>
              <div>
                <p className="pay-gateway-brand-title">FYJC Secure Payments</p>
                <p className="pay-gateway-brand-sub">
                  Demo payment gateway &mdash; no real transaction occurs
                </p>
              </div>
            </div>

            <p className="pay-gateway-method-label">Choose payment method</p>
            <div className="pay-gateway-methods">
              {METHODS.map((method) => {
                const isOpen = expanded === method.id;
                return (
                  <div
                    className={`pay-gateway-method-item ${isOpen ? "pay-gateway-method-item--open" : ""}`}
                    key={method.id}
                  >
                    <button
                      type="button"
                      className="pay-gateway-method-header"
                      onClick={() => toggleMethod(method.id)}
                      aria-expanded={isOpen}
                    >
                      <span
                        className="pay-gateway-method-icon"
                        aria-hidden="true"
                      >
                        {method.icon}
                      </span>
                      <span className="pay-gateway-method-text">
                        <span className="pay-gateway-method-title">
                          {method.title}
                        </span>
                        <span className="pay-gateway-method-subtitle">
                          {method.subtitle}
                        </span>
                      </span>
                      <span
                        className="pay-gateway-method-chevron"
                        aria-hidden="true"
                      >
                        <ChevronIcon />
                      </span>
                    </button>

                    {isOpen && (
                      <div className="pay-gateway-method-panel">
                        {method.id === "qr" && (
                          <div className="pay-gateway-qr-panel">
                            <div
                              className="pay-gateway-qr-code"
                              aria-hidden="true"
                            >
                              <QrCodeArt />
                            </div>
                            <div className="pay-gateway-amount pay-gateway-amount--panel">
                              <p className="pay-gateway-amount-label">
                                Amount payable
                              </p>
                              <p className="pay-gateway-amount-value">
                                &#8377;{PAYMENT_AMOUNT}
                              </p>
                              <p className="pay-gateway-amount-note">
                                FYJC Admission Fee &middot; Application
                                FYJC2026-00842
                              </p>
                            </div>
                          </div>
                        )}

                        {method.id === "card" && (
                          <div className="pay-gateway-card-panel">
                            <TextField
                              className="pay-gateway-field"
                              label="Card Number"
                              placeholder="1234 5678 9012 3456"
                              inputMode="numeric"
                              maxLength={19}
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                            />
                            <TextField
                              className="pay-gateway-field"
                              label="Name on Card"
                              placeholder="Applicant name"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                            />
                            <div className="pay-gateway-card-row">
                              <TextField
                                className="pay-gateway-field"
                                label="Expiry (MM/YY)"
                                placeholder="MM/YY"
                                maxLength={5}
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                              />
                              <TextField
                                className="pay-gateway-field"
                                label="CVV"
                                placeholder="123"
                                type="password"
                                inputMode="numeric"
                                maxLength={3}
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                              />
                            </div>

                            <div className="pay-gateway-amount pay-gateway-amount--panel">
                              <p className="pay-gateway-amount-label">
                                Amount payable
                              </p>
                              <p className="pay-gateway-amount-value">
                                &#8377;{PAYMENT_AMOUNT}
                              </p>
                            </div>
                          </div>
                        )}

                        {method.id === "upi" && (
                          <div className="pay-gateway-upi-panel">
                            <TextField
                              className="pay-gateway-field"
                              label="UPI ID"
                              placeholder="yourname@upi"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                            />
                            <p className="pay-gateway-upi-hint">
                              You will receive a payment request on your UPI app
                              to approve.
                            </p>

                            <div className="pay-gateway-amount pay-gateway-amount--panel">
                              <p className="pay-gateway-amount-label">
                                Amount payable
                              </p>
                              <p className="pay-gateway-amount-value">
                                &#8377;{PAYMENT_AMOUNT}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pay-gateway-secure-note">
              <ShieldIcon />
              <span>
                Your payment is secured with 256-bit SSL encryption.
                <br />
                We do not store your card or UPI details.
              </span>
            </div>

            <Button
              className="pay-gateway-pay-btn"
              onClick={() => resolvePayment("success")}
            >
              <LockGlyph /> Proceed to Pay
            </Button>

            <div className="pay-gateway-secondary-actions">
              <button
                type="button"
                className="pay-gateway-link"
                onClick={() => resolvePayment("failed")}
              >
                Simulate failed payment
              </button>
              <button
                type="button"
                className="pay-gateway-link"
                onClick={() => navigate("/application-form")}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {state === "processing" && (
          <div className="pay-gateway-processing">
            <span className="pay-gateway-spinner" aria-hidden="true" />
            <p>Processing your payment&hellip;</p>
          </div>
        )}

        {state === "success" && (
          <div className="pay-gateway-result">
            <span
              className="pay-gateway-result-circle pay-gateway-result-circle--success"
              aria-hidden="true"
            >
              <svg viewBox="0 0 52 52" width="56" height="56">
                <circle
                  className="pay-gateway-result-ring"
                  cx="26"
                  cy="26"
                  r="23"
                  fill="none"
                />
                <path
                  className="pay-gateway-result-check"
                  fill="none"
                  d="M14 27l7 7 17-17"
                />
              </svg>
            </span>
            <p className="pay-gateway-result-title">Payment successful</p>
            <p className="pay-gateway-result-amount">
              &#8377;{PAYMENT_AMOUNT} paid
            </p>
          </div>
        )}

        {state === "failed" && (
          <div className="pay-gateway-result">
            <span
              className="pay-gateway-result-circle pay-gateway-result-circle--failed"
              aria-hidden="true"
            >
              <svg viewBox="0 0 52 52" width="56" height="56">
                <circle
                  className="pay-gateway-result-ring pay-gateway-result-ring--failed"
                  cx="26"
                  cy="26"
                  r="23"
                  fill="none"
                />
                <path
                  className="pay-gateway-result-cross"
                  fill="none"
                  d="M17 17l18 18"
                />
                <path
                  className="pay-gateway-result-cross pay-gateway-result-cross--delay"
                  fill="none"
                  d="M35 17l-18 18"
                />
              </svg>
            </span>
            <p className="pay-gateway-result-title pay-gateway-result-title--failed">
              Payment failed
            </p>
            <p className="pay-gateway-result-amount">No amount was deducted</p>
          </div>
        )}
      </div>
    </div>
  );
}

function QrIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path
        d="M14 14h3v3h-3zM19 14h2v2h-2zM14 19h2v2h-2zM19 19h2v2h-2z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <path d="M2.5 10h19" />
      <path d="M6 14.5h4" strokeLinecap="round" />
    </svg>
  );
}

function UpiIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M4 12h9M9 7l5 5-5 5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 7l5 5-5 5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12l1.8 1.8L14.5 10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="5" y="11" width="14" height="9" rx="2" strokeLinejoin="round" />
      <path
        d="M8 11V7a4 4 0 0 1 8 0v4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QrCodeArt() {
  const cells = [
    "1111111001011111111",
    "1000001010101000001",
    "1011101011100101110",
    "1011101001011101110",
    "1011101010000101110",
    "1000001011010000001",
    "1111111010101111111",
    "0000000011000000000",
    "1101110100111001101",
    "0010011001010100010",
    "1100101110001101011",
    "0011010001110010100",
    "1111000101101101011",
    "0000000101010001000",
    "1111111001100110111",
    "1000001010111001010",
    "1011101011001010101",
    "1011101000101110100",
    "1011101010101000011",
    "1000001001010110101",
  ];
  const size = 20;
  const cell = 8;
  return (
    <svg width="176" height="176" viewBox={`0 0 ${size * cell} ${size * cell}`}>
      <rect
        width={size * cell}
        height={size * cell}
        fill="var(--color-surface)"
      />
      {cells.map((row, y) =>
        row
          .split("")
          .map((bit, x) =>
            bit === "1" ? (
              <rect
                key={`${x}-${y}`}
                x={x * cell}
                y={y * cell}
                width={cell}
                height={cell}
                fill="var(--color-text-primary)"
              />
            ) : null,
          ),
      )}
    </svg>
  );
}
