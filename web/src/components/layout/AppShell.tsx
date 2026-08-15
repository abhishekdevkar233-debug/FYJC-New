import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AppShell.css";

interface NavItem {
  key: string;
  label: string;
  to: string;
  icon: React.ReactNode;
}

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
    to: "/quota",
    icon: <QuotaIcon />,
  },
  {
    key: "misc",
    label: "Miscellaneous",
    to: "/miscellaneous",
    icon: <MiscIcon />,
  },
  {
    key: "cap-admission",
    label: "CAP Admission",
    to: "/cap-admission",
    icon: <AdmissionIcon />,
  },
];

export function AppShell() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  function handleLogout() {
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-topbar-identity">
          <span className="app-topbar-emblem" aria-hidden="true">
            FY
          </span>
          <div className="app-topbar-title">
            <p className="app-topbar-dept">FYJC Admission Portal</p>
            <p className="app-topbar-sub">
              Std. XI Centralised Online Admission Process 2026&ndash;27
            </p>
          </div>
        </div>
        <div className="app-topbar-who" ref={menuRef}>
          <div className="app-topbar-who-text">
            <p className="app-topbar-name">Abhishek Devkar</p>
            <p className="app-topbar-role">Applicant</p>
          </div>
          <button
            type="button"
            className="app-topbar-avatar"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-label="Account menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            AP
          </button>
          {menuOpen && (
            <div className="app-topbar-menu" role="menu">
              <button
                type="button"
                className="app-topbar-menu-item"
                role="menuitem"
                onClick={handleLogout}
              >
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="app-body">
        <aside className="app-sidebar" aria-label="Section navigation">
          <p className="app-sidebar-label">Admission Portal</p>
          <nav className="app-sidebar-nav">
            {NAV_ITEMS.map((item) => (
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
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
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
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function FormIcon() {
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
        d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        strokeLinejoin="round"
      />
      <path d="M9 12h6M9 16h6M9 8h3" strokeLinecap="round" />
    </svg>
  );
}

function CapIcon() {
  return (
    <svg
      width="18"
      height="18"
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
      width="18"
      height="18"
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="19" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

function AdmissionIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M9 3H5a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 17l5-5-5-5M21 12H9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
