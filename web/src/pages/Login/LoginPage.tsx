import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { PasswordField } from "../../components/ui/PasswordField";
import { CaptchaField, generateCode } from "../../components/ui/CaptchaField";
import { SiteHeader } from "../../components/layout/SiteHeader";
import "./LoginPage.css";

interface FormErrors {
  loginId?: string;
  password?: string;
  captcha?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("demo.student@fyjc.in");
  const [password, setPassword] = useState("Fyjc!Prev8w-Qz");
  const [captchaCode, setCaptchaCode] = useState(() => generateCode());
  const [captchaValue, setCaptchaValue] = useState(captchaCode);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!loginId.trim()) {
      next.loginId = "Enter your login ID or registered email.";
    }
    if (!password) {
      next.password = "Enter your password.";
    }
    if (!captchaValue.trim()) {
      next.captcha = "Enter the code shown above.";
    } else if (captchaValue.trim().toUpperCase() !== captchaCode) {
      next.captcha = "The code you entered does not match. Please try again.";
    }
    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      if (validationErrors.captcha) {
        setCaptchaCode(generateCode());
        setCaptchaValue("");
      }
      return;
    }

    setSubmitting(true);
    // No backend is connected in this demo; this simulates a successful sign-in.
    window.setTimeout(() => {
      setSubmitting(false);
      navigate("/dashboard");
    }, 600);
  }

  return (
    <div className="login-page">
      <SiteHeader />
      <main className="login-page-content">
        <section className="login-card" aria-labelledby="login-heading">
          <header className="login-card-header">
            <h1 id="login-heading" className="login-card-title">
              Sign In
            </h1>
            <p className="login-card-subtitle">
              Enter your credentials to access your FYJC admission account.
            </p>
          </header>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Login ID or Email"
              id="loginId"
              type="text"
              inputMode="email"
              autoComplete="username"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              error={errors.loginId}
              icon={<MailIcon />}
              placeholder="e.g. name@example.com"
            />

            <PasswordField
              label="Password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="Enter your password"
            />

            <div className="login-options">
              <label className="login-checkbox">
                <input type="checkbox" name="rememberMe" />
                <span>Remember me</span>
              </label>
              <a className="login-link" href="/forgot-password">
                Forgot password?
              </a>
            </div>

            <CaptchaField
              value={captchaValue}
              onChange={setCaptchaValue}
              code={captchaCode}
              onRefresh={setCaptchaCode}
              error={errors.captcha}
            />

            <Button type="submit" className="login-submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </section>

        <p className="login-footnote">
          Need help? Contact your junior college office or visit the Help Centre.
        </p>
      </main>
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}
