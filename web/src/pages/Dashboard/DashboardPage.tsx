import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useApplicationForm } from "../../context/ApplicationFormContext";
import "./DashboardPage.css";

const APPLICANT_INFO_LEFT = [
  { label: "User Login ID", value: "FYJC2026-00842", icon: <UserIcon /> },
  { label: "User Type", value: "Applicant", icon: <UserIcon /> },
  { label: "User Name", value: "Abhishek Devkar", icon: <UserIcon /> },
];

const APPLICANT_INFO_RIGHT = [
  { label: "IP Address", value: "122.160.12.45", icon: <GlobeIcon /> },
  {
    label: "Current Login Time",
    value: "15 Aug 2026, 10:30 AM",
    icon: <ClockIcon />,
  },
  {
    label: "Previous Login Time",
    value: "14 Aug 2026, 07:45 PM",
    icon: <HistoryIcon />,
  },
];

const CHOICE_FORMS = [
  {
    key: "cap-option",
    label: "CAP Option Form",
    icon: <ListIcon />,
    tag: "in-progress" as const,
    description: "You have not submitted your preferences yet.",
    date: null,
    actionLabel: "Continue",
    to: "/cap-option",
  },
  {
    key: "in-house",
    label: "In-House Choice Form",
    icon: <HomeIcon />,
    tag: "done" as const,
    description: null,
    date: "13 Aug 2026",
    actionLabel: "View Details",
    to: "/quota",
  },
  {
    key: "minority",
    label: "Minority Choice Form",
    icon: <PeopleIcon />,
    tag: "done" as const,
    description: null,
    date: "13 Aug 2026",
    actionLabel: "View Details",
    to: "/quota",
  },
  {
    key: "management",
    label: "Management Choice Form",
    icon: <BriefcaseIcon />,
    tag: "done" as const,
    description: null,
    date: "13 Aug 2026",
    actionLabel: "View Details",
    to: "/quota",
  },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { locked } = useApplicationForm();

  return (
    <div className="dashboard-page">
      <div className="dashboard-greeting">
        <div>
          <h1>
            Good Morning, Abhishek! <span aria-hidden="true">👋</span>
          </h1>
          <p>Let&rsquo;s get you one step closer to your Class 11 admission.</p>
        </div>
      </div>

      <section className="dashboard-panel">
        <h2 className="dashboard-panel-title">
          <UserIcon />
          Applicant Information
        </h2>
        <div className="dashboard-info-grid">
          <div className="dashboard-info-col">
            {APPLICANT_INFO_LEFT.map((row) => (
              <InfoRow key={row.label} {...row} />
            ))}
          </div>
          <div className="dashboard-info-col dashboard-info-col--right">
            {APPLICANT_INFO_RIGHT.map((row) => (
              <InfoRow key={row.label} {...row} />
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <h2 className="dashboard-section-title">
          Application Form (Part-I) Status
        </h2>
        <div className="dashboard-status-grid">
          <button
            type="button"
            className="dashboard-status-card"
            onClick={() => navigate("/application-form")}
          >
            <span
              className={`dashboard-status-icon ${locked ? "dashboard-status-icon--done" : "dashboard-status-icon--pending"}`}
            >
              <DocCheckIcon />
            </span>
            <span className="dashboard-status-body">
              <span className="dashboard-status-head">
                <span className="dashboard-status-name">Application Form</span>
                <span
                  className={`dashboard-tag ${locked ? "dashboard-tag--done" : "dashboard-tag--pending"}`}
                >
                  {locked ? "Completed" : "In Progress"}
                </span>
              </span>
              <span className="dashboard-status-desc">
                {locked ? (
                  <>
                    Submitted on <strong>Application locked</strong>
                  </>
                ) : (
                  "Continue where you left off"
                )}
              </span>
            </span>
            <ChevronRightIcon />
          </button>

          <div className="dashboard-status-card dashboard-status-card--static">
            <span className="dashboard-status-icon dashboard-status-icon--info">
              <BuildingIcon />
            </span>
            <span className="dashboard-status-body">
              <span className="dashboard-status-head">
                <span className="dashboard-status-name">Admission Status</span>
                <span className="dashboard-tag dashboard-tag--info">
                  Awaiting Allotment
                </span>
              </span>
              <span className="dashboard-status-desc">
                CAP Round 1 Allotment result <strong>To be announced</strong>
              </span>
            </span>
            <ChevronRightIcon />
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <h2 className="dashboard-section-title">
          Choice Forms (Part-II) Status
        </h2>
        <div className="dashboard-choice-grid">
          {CHOICE_FORMS.map((form) => (
            <div className="dashboard-choice-card" key={form.key}>
              <span
                className={`dashboard-status-icon ${form.tag === "done" ? "dashboard-status-icon--done" : "dashboard-status-icon--pending"}`}
              >
                {form.icon}
              </span>
              <span className="dashboard-choice-name">{form.label}</span>
              <span
                className={`dashboard-tag ${form.tag === "done" ? "dashboard-tag--done" : "dashboard-tag--pending"}`}
              >
                {form.tag === "done" ? "Completed" : "In Progress"}
              </span>
              <span className="dashboard-choice-desc">
                {form.description ?? (
                  <>
                    Submitted on <br /> {form.date}
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-help">
        <span className="dashboard-help-icon" aria-hidden="true">
          <HeadsetIcon />
        </span>
        <div className="dashboard-help-text">
          <p className="dashboard-help-title">Need Help?</p>
          <p className="dashboard-help-desc">
            Check our Help Centre or raise a ticket. We&rsquo;re here to assist
            you!
          </p>
        </div>
        <button
          type="button"
          className="dashboard-help-btn"
          onClick={() => navigate("/miscellaneous")}
        >
          Help &amp; Support
          <ChevronRightIcon />
        </button>
      </section>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="dashboard-info-row">
      <span className="dashboard-info-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="dashboard-info-label">{label}</span>
      <span className="dashboard-info-sep">:</span>
      <span className="dashboard-info-value">{value}</span>
    </div>
  );
}

function UserIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path
        d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" />
      <path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


function ChevronRightIcon() {
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

function DocCheckIcon() {
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
        d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        strokeLinejoin="round"
      />
      <path d="M9 13l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 21V7l8-4 8 4v14" strokeLinejoin="round" />
      <path
        d="M9 21v-6h6v6M9 11h.01M15 11h.01M9 7h.01M15 7h.01"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M8 6h13M8 12h13M8 18h13" strokeLinecap="round" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 11l9-7 9 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" />
      <path
        d="M16 5.5a3 3 0 0 1 0 5.8M22 20c0-2.8-2.2-5.1-5-5.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" strokeLinecap="round" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19v1a3 3 0 0 1-3 3h-2" strokeLinecap="round" />
    </svg>
  );
}
