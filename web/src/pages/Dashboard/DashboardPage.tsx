import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APPLICATION_STEPS, loadApplicationDraftSummary } from "../../lib/applicationDraft";
import "./DashboardPage.css";

const STATS = [
  { label: "Application No.", value: "FYJC2026-00842" },
  { label: "Merit Marks", value: "470.00 / 500" },
  { label: "Documents", value: "1 of 4" },
  { label: "Fee Status", value: "Paid" },
];

const QUICK_ACTIONS = [
  {
    label: "CAP Option (Part II)",
    description: "Choose your stream, medium and preferred Junior Colleges.",
    to: "/cap-option",
    icon: <CapIcon />,
  },
  {
    label: "Quota Choices (Part II)",
    description:
      "Apply separately for In-House, Minority or Management quota seats.",
    to: "/quota",
    icon: <QuotaIcon />,
  },
  {
    label: "Miscellaneous",
    description: "Payment history, grievances and other account utilities.",
    to: "/miscellaneous",
    icon: <MiscIcon />,
  },
  {
    label: "CAP Admission",
    description: "Track your seat allotment across every CAP round.",
    to: "/cap-admission",
    icon: <AdmissionIcon />,
  },
];

const NOTICES = [
  {
    id: "n1",
    title: "Round 7 CAP schedule published",
    date: "12 Aug 2026",
    description:
      "The provisional schedule for CAP Round 7 option form submission and seat allotment has been published. Review the dates below and complete your Part-II options before the deadline.",
  },
  {
    id: "n2",
    title: "Document verification centres list updated",
    date: "08 Aug 2026",
    description:
      "An updated list of document verification centres for your district is now available. Carry original documents along with one photocopy for verification.",
  },
  {
    id: "n3",
    title: "Helpline hours extended during CAP rounds",
    date: "03 Aug 2026",
    description:
      "The admission helpline will remain available for extended hours on all working days until the end of the current CAP round to assist with queries.",
  },
];

const IMPORTANT_DATES = [
  { label: "Round 7 option form submission", date: "18 – 21 Aug 2026" },
  { label: "Round 7 seat allotment declared", date: "24 Aug 2026" },
  { label: "Round 7 admission confirmation", date: "25 – 27 Aug 2026" },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [expandedNotice, setExpandedNotice] = useState<string | null>(null);

  const draft = loadApplicationDraftSummary();
  const currentStepIndex = draft?.current ?? 0;
  const completedSteps = new Set(draft?.completed ?? []);
  if (draft?.locked) completedSteps.add(APPLICATION_STEPS.length - 1);

  const progressSteps = APPLICATION_STEPS.map((label, index) => ({
    label,
    status: completedSteps.has(index)
      ? ("done" as const)
      : index === currentStepIndex
        ? ("current" as const)
        : ("upcoming" as const),
  }));

  const stepTag = draft?.locked
    ? "Part I · Locked"
    : `Part I · Step ${currentStepIndex + 1} of ${APPLICATION_STEPS.length}`;

  const ctaTitle = draft?.locked ? "Part I is locked" : "Continue your application";
  const ctaDescription = draft?.locked
    ? "Your Part-I application is locked. Proceed to Part II from the sidebar."
    : `Pick up at "${APPLICATION_STEPS[currentStepIndex]}" — registration, personal, address and qualification details.`;

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-head">
        <h1>Dashboard</h1>
        <p>A quick snapshot of your Std. XI admission application.</p>
      </div>

      <div className="dashboard-stat-grid">
        {STATS.map((stat) => (
          <div className="dashboard-stat-card" key={stat.label}>
            <p className="dashboard-stat-label">{stat.label}</p>
            <p className="dashboard-stat-value">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="dashboard-section" aria-labelledby="progress-heading">
        <div className="dashboard-section-head">
          <h2 id="progress-heading">Application Progress</h2>
          <span className="dashboard-section-tag">{stepTag}</span>
        </div>
        <ol className="progress-tracker">
          {progressSteps.map((step, index) => {
            const isDone = step.status === "done";
            const badge = (
              <span className="progress-step-badge">
                {isDone ? "✓" : index + 1}
              </span>
            );
            const label = (
              <span className="progress-step-label">{step.label}</span>
            );

            return (
              <li
                key={step.label}
                className={`progress-step progress-step--${step.status}`}
                aria-current={step.status === "current" ? "step" : undefined}
              >
                {isDone ? (
                  <span
                    className="progress-step-static"
                    aria-label={`${step.label} (completed, read only)`}
                  >
                    {badge}
                    {label}
                  </span>
                ) : (
                  <button
                    type="button"
                    className="progress-step-button"
                    onClick={() => navigate("/application-form")}
                  >
                    {badge}
                    {label}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <div className="dashboard-cta">
        <div>
          <h2>{ctaTitle}</h2>
          <p>{ctaDescription}</p>
        </div>
        <button
          className="dashboard-cta-button"
          onClick={() => navigate("/application-form")}
        >
          Open Application Form (Part I) &rarr;
        </button>
      </div>

      <section
        className="dashboard-section"
        aria-labelledby="quick-actions-heading"
      >
        <div className="dashboard-section-head">
          <h2 id="quick-actions-heading">Quick Actions</h2>
        </div>
        <div className="quick-action-grid">
          {QUICK_ACTIONS.map((action) => (
            <Link
              className="quick-action-card"
              to={action.to}
              key={action.label}
            >
              <span className="quick-action-icon" aria-hidden="true">
                {action.icon}
              </span>
              <span className="quick-action-text">
                <span className="quick-action-label">{action.label}</span>
                <span className="quick-action-desc">{action.description}</span>
              </span>
              <span className="quick-action-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="dashboard-two-col">
        <section
          className="dashboard-section"
          aria-labelledby="notices-heading"
        >
          <div className="dashboard-section-head">
            <h2 id="notices-heading">Notices &amp; Updates</h2>
          </div>
          <ul className="notice-list">
            {NOTICES.map((notice) => {
              const expanded = expandedNotice === notice.id;
              return (
                <li className="notice-item" key={notice.id}>
                  <button
                    type="button"
                    className="notice-trigger"
                    aria-expanded={expanded}
                    aria-controls={`${notice.id}-desc`}
                    onClick={() =>
                      setExpandedNotice(expanded ? null : notice.id)
                    }
                  >
                    <span className="notice-trigger-text">
                      <span className="notice-title">{notice.title}</span>
                      <span className="notice-date">{notice.date}</span>
                    </span>
                    <span
                      className={`notice-chevron ${expanded ? "notice-chevron--open" : ""}`}
                      aria-hidden="true"
                    >
                      <ChevronIcon />
                    </span>
                  </button>
                  {expanded && (
                    <p id={`${notice.id}-desc`} className="notice-desc">
                      {notice.description}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="dashboard-section" aria-labelledby="dates-heading">
          <div className="dashboard-section-head">
            <h2 id="dates-heading">Important Dates</h2>
          </div>
          <table className="dates-table">
            <tbody>
              {IMPORTANT_DATES.map((row) => (
                <tr key={row.label}>
                  <td className="dates-table-label">{row.label}</td>
                  <td className="dates-table-value">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

function CapIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 4l9 4.5-9 4.5-9-4.5L12 4z" strokeLinejoin="round" />
      <path
        d="M6.5 10.8V15c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-4.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function QuotaIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <rect x="3" y="10" width="12" height="4" rx="1" />
      <rect x="3" y="16" width="8" height="4" rx="1" />
    </svg>
  );
}

function MiscIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="19" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

function AdmissionIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
