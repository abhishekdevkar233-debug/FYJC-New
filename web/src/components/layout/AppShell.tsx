import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useApplicationForm } from "../../context/ApplicationFormContext";
import { useCapOption, MAX_PREFERENCES } from "../../context/CapOptionContext";
import { useQuota } from "../../context/QuotaContext";
import "./AppShell.css";

interface LeafNavItem {
  key: string;
  label: string;
  to: string;
  icon: React.ReactNode;
  children?: undefined;
}

interface ParentNavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  to?: undefined;
  children: { key: string; label: string; to: string }[];
}

type NavItem = LeafNavItem | ParentNavItem;

const NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    to: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    key: "application-form",
    label: "Application Form (Part I)",
    to: "/application-form",
    icon: <FormIcon />,
  },
  {
    key: "cap-option",
    label: "CAP Option (Part II)",
    to: "/cap-option",
    icon: <CapIcon />,
  },
  {
    key: "quota",
    label: "Quota Choices (Part II)",
    icon: <QuotaIcon />,
    children: [
      { key: "quota-inhouse", label: "Apply for In-House Quota", to: "/quota/in-house" },
      { key: "quota-minority", label: "Apply for Minority Quota", to: "/quota/minority" },
      { key: "quota-management", label: "Apply for Management Quota", to: "/quota/management" },
      { key: "quota-documents", label: "Upload Document", to: "/quota/documents" },
      { key: "quota-timeline", label: "Timeline Log", to: "/quota/timeline" },
    ],
  },
  {
    key: "misc",
    label: "Miscellaneous",
    icon: <MiscIcon />,
    children: [
      { key: "misc-payment-history", label: "Payment History", to: "/miscellaneous/payment-history" },
      { key: "misc-grievance", label: "Grievance", to: "/miscellaneous/grievance" },
      { key: "misc-withdraw", label: "Withdraw Application", to: "/miscellaneous/withdraw-application" },
    ],
  },
  {
    key: "cap-admission",
    label: "CAP Admissions",
    icon: <AdmissionIcon />,
    children: [
      { key: "cap-admission-status", label: "CAP Allotment Status", to: "/cap-admission/status" },
      { key: "cap-admission-summary", label: "CAP Admission Summary", to: "/cap-admission/summary" },
    ],
  },
];

const LANGUAGES = ["EN", "HI", "MR"];

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { personal } = useApplicationForm();
  const { preferences } = useCapOption();
  const { selections } = useQuota();
  const [openKeys, setOpenKeys] = useState<Set<string>>(() => {
    const initiallyOpen = NAV_ITEMS.filter(
      (item) =>
        item.children &&
        item.children.some((child) => location.pathname.startsWith(child.to)),
    ).map((item) => item.key);
    return new Set(initiallyOpen);
  });
  const [language, setLanguage] = useState("EN");

  const quotaSelectedCount =
    selections.inHouse.length + selections.minority.length + selections.management.length;

  const badges: Record<string, string | undefined> = {
    "cap-option": preferences.length > 0 ? `${preferences.length}/${MAX_PREFERENCES}` : undefined,
    quota: quotaSelectedCount > 0 ? String(quotaSelectedCount) : undefined,
  };

  function toggleOpen(key: string) {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function handleLogout() {
    navigate("/");
  }

  const applicantName = personal.fullName || "Applicant";
  const applicantInitials =
    applicantName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "A";

  return (
    <div className="app-shell">
      <header className="app-topnav">
        <div className="app-topnav-actions">
          <div className="app-topnav-lang" role="group" aria-label="Language">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                className={`app-topnav-lang-btn ${language === lang ? "app-topnav-lang-btn--active" : ""}`}
                onClick={() => setLanguage(lang)}
                aria-pressed={language === lang}
              >
                {lang}
              </button>
            ))}
          </div>

          <button type="button" className="app-topnav-bell" aria-label="Notifications">
            <BellIcon />
          </button>

          <div className="app-topnav-user">
            <span className="app-topnav-avatar" aria-hidden="true">
              {applicantInitials}
            </span>
            <span className="app-topnav-user-text">
              <span className="app-topnav-user-name">{applicantName}</span>
              <span className="app-topnav-user-role">Applicant</span>
            </span>
          </div>
        </div>
      </header>

      <div className="app-body">
        <aside className="app-sidebar" aria-label="Section navigation">
          <nav className="app-sidebar-nav">
            {NAV_ITEMS.map((item) => {
              if (!item.children) {
                return (
                  <NavLink
                    key={item.key}
                    to={item.to}
                    className={({ isActive }) =>
                      `app-sidebar-link ${isActive ? "app-sidebar-link--active" : ""}`
                    }
                  >
                    <span className="app-sidebar-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="app-sidebar-link-label">{item.label}</span>
                    {badges[item.key] && (
                      <span className="app-sidebar-badge">{badges[item.key]}</span>
                    )}
                  </NavLink>
                );
              }

              const isOpen = openKeys.has(item.key);
              const isChildActive = item.children.some((child) =>
                location.pathname.startsWith(child.to),
              );

              return (
                <div key={item.key} className="app-sidebar-group">
                  <button
                    type="button"
                    className={`app-sidebar-link app-sidebar-link--parent ${isChildActive ? "app-sidebar-link--active" : ""}`}
                    onClick={() => toggleOpen(item.key)}
                    aria-expanded={isOpen}
                  >
                    <span className="app-sidebar-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="app-sidebar-link-label">{item.label}</span>
                    {badges[item.key] && (
                      <span className="app-sidebar-badge">{badges[item.key]}</span>
                    )}
                    <span
                      className={`app-sidebar-chevron ${isOpen ? "app-sidebar-chevron--open" : ""}`}
                      aria-hidden="true"
                    >
                      <ChevronIcon />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="app-sidebar-submenu">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.key}
                          to={child.to}
                          className={({ isActive }) =>
                            `app-sidebar-sublink ${isActive ? "app-sidebar-sublink--active" : ""}`
                          }
                        >
                          <span>{child.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <button type="button" className="app-sidebar-logout" onClick={handleLogout}>
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </aside>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function FormIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        strokeLinejoin="round"
      />
      <path d="M9 12h6M9 16h6M9 8h3" strokeLinecap="round" />
    </svg>
  );
}

function CapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 4l9 4.5-9 4.5-9-4.5L12 4z" strokeLinejoin="round" />
      <path d="M6.5 10.8V15c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-4.2" strokeLinecap="round" />
    </svg>
  );
}

function QuotaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <rect x="3" y="10" width="12" height="4" rx="1" />
      <rect x="3" y="16" width="8" height="4" rx="1" />
    </svg>
  );
}

function MiscIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="19" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

function AdmissionIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 3H5a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
