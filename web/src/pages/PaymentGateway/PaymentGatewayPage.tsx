import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { PAYMENT_AMOUNT } from "../../lib/applicationDraft";
import { useApplicationForm } from "../../context/ApplicationFormContext";
import "./PaymentGatewayPage.css";

type GatewayState = "idle" | "processing" | "success" | "failed";

export function PaymentGatewayPage() {
  const navigate = useNavigate();
  const { resolvePayment: setPaymentResult } = useApplicationForm();
  const [state, setState] = useState<GatewayState>("idle");

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
                <p className="pay-gateway-brand-sub">Demo payment gateway &mdash; no real transaction occurs</p>
              </div>
            </div>

            <div className="pay-gateway-amount">
              <p className="pay-gateway-amount-label">Amount payable</p>
              <p className="pay-gateway-amount-value">&#8377;{PAYMENT_AMOUNT}</p>
              <p className="pay-gateway-amount-note">FYJC Admission Fee &middot; Application FYJC2026-00842</p>
            </div>

            <div className="pay-gateway-method">
              <p className="pay-gateway-method-label">Payment method</p>
              <div className="pay-gateway-method-option pay-gateway-method-option--selected">
                <span className="pay-gateway-method-radio" aria-hidden="true" />
                <span>UPI</span>
              </div>
            </div>

            <Button className="pay-gateway-pay-btn" onClick={() => resolvePayment("success")}>
              Pay Now
            </Button>

            <div className="pay-gateway-secondary-actions">
              <button type="button" className="pay-gateway-link" onClick={() => resolvePayment("failed")}>
                Simulate failed payment
              </button>
              <button type="button" className="pay-gateway-link" onClick={() => navigate("/application-form")}>
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
            <span className="pay-gateway-result-circle pay-gateway-result-circle--success" aria-hidden="true">
              <svg viewBox="0 0 52 52" width="56" height="56">
                <circle className="pay-gateway-result-ring" cx="26" cy="26" r="23" fill="none" />
                <path className="pay-gateway-result-check" fill="none" d="M14 27l7 7 17-17" />
              </svg>
            </span>
            <p className="pay-gateway-result-title">Payment successful</p>
            <p className="pay-gateway-result-amount">&#8377;{PAYMENT_AMOUNT} paid</p>
          </div>
        )}

        {state === "failed" && (
          <div className="pay-gateway-result">
            <span className="pay-gateway-result-circle pay-gateway-result-circle--failed" aria-hidden="true">
              <svg viewBox="0 0 52 52" width="56" height="56">
                <circle className="pay-gateway-result-ring pay-gateway-result-ring--failed" cx="26" cy="26" r="23" fill="none" />
                <path className="pay-gateway-result-cross" fill="none" d="M17 17l18 18" />
                <path className="pay-gateway-result-cross pay-gateway-result-cross--delay" fill="none" d="M35 17l-18 18" />
              </svg>
            </span>
            <p className="pay-gateway-result-title pay-gateway-result-title--failed">Payment failed</p>
            <p className="pay-gateway-result-amount">No amount was deducted</p>
          </div>
        )}
      </div>
    </div>
  );
}
