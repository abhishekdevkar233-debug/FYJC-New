import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useApplicationForm } from "../../context/ApplicationFormContext";
import { useCapOption, MAX_PREFERENCES } from "../../context/CapOptionContext";
import { useQuota } from "../../context/QuotaContext";
import { usePortalStyle } from "../../context/PortalStyleContext";
import { AiAssistant } from "../assistant/AiAssistant";
import { BrandHeader } from "./BrandHeader";
import "./AppShell.css";

interface LeafNavItem {
  key: string;
  label: string;
  to: string;
  icon: React.ReactNode;
  icon2?: React.ReactNode;
  children?: undefined;
}

interface ParentNavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  icon2?: React.ReactNode;
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
    icon2: <SplitPanelIcon />,
  },
  {
    key: "application-form",
    label: "Application Form (Part I)",
    to: "/application-form",
    icon: <FormIcon />,
    icon2: <PencilEditIcon />,
  },
  {
    key: "cap-option",
    label: "CAP Option (Part II)",
    to: "/cap-option",
    icon: <CapIcon />,
    icon2: <LockClockIcon />,
  },
  {
    key: "quota",
    label: "Quota Choices (Part II)",
    icon: <QuotaIcon />,
    icon2: <StackDocIcon />,
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
    icon2: <CalendarIcon />,
    children: [
      { key: "cap-admission-status", label: "CAP Allotment Status", to: "/cap-admission/status" },
      { key: "cap-admission-summary", label: "CAP Admission Summary", to: "/cap-admission/summary" },
    ],
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    to: "/whatsapp",
    icon: <WhatsAppIcon />,
  },
];

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { personal } = useApplicationForm();
  const { preferences } = useCapOption();
  const { selections } = useQuota();
  const { portalStyle } = usePortalStyle();
  const [openKeys, setOpenKeys] = useState<Set<string>>(() => {
    const initiallyOpen = NAV_ITEMS.filter(
      (item) =>
        item.children &&
        item.children.some((child) => location.pathname.startsWith(child.to)),
    ).map((item) => item.key);
    return new Set(initiallyOpen);
  });
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
      <BrandHeader>
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
      </BrandHeader>

      <div className="app-body">
        <aside className="app-sidebar" aria-label="Section navigation">
          <nav className="app-sidebar-nav">
            {NAV_ITEMS.map((item) => {
              const displayIcon =
                portalStyle === "style2" && item.icon2 ? item.icon2 : item.icon;

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
                      {displayIcon}
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
                      {displayIcon}
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

      <AiAssistant />
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

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.35a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.79 14.02c-.24.68-1.4 1.31-1.93 1.36-.51.06-1 .27-3.38-.7-2.86-1.16-4.68-4.05-4.82-4.24-.14-.19-1.15-1.53-1.15-2.92 0-1.39.72-2.07.98-2.35.26-.28.56-.35.75-.35.19 0 .37 0 .53.01.17.01.4-.06.62.48.24.58.81 1.99.88 2.13.07.14.12.31.02.5-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.75 1.24 1.6 2.01 1.11 1 2.04 1.31 2.33 1.46.29.15.46.13.63-.08.17-.2.72-.84.91-1.13.19-.29.38-.24.63-.14.26.1 1.65.78 1.94.92.29.15.48.22.55.34.07.13.07.72-.17 1.41Z" />
    </svg>
  );
}

/* Style 02 (Modern Minimal) alternate nav icon set */
function SplitPanelIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M10 3v18" />
    </svg>
  );
}

function PencilEditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" strokeLinejoin="round" />
      <path d="M13 6l3 3" strokeLinecap="round" />
    </svg>
  );
}

function LockClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="11" width="12" height="9" rx="2" />
      <path d="M7 11V7a3.5 3.5 0 0 1 7 0v1" strokeLinecap="round" />
      <circle cx="18" cy="17" r="4.5" fill="var(--color-surface)" />
      <path d="M18 15v2l1.4 1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StackDocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 3h8l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
      <path d="M9 12h6M9 16h6M9 8h3" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
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
