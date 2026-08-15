import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AccessibilityBar } from "./AccessibilityBar";
import brandMarkPlaceholder from "../../assets/brand-mark-placeholder.svg";
import brandLogoPlaceholder from "../../assets/brand-logo-placeholder.svg";
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

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

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
      <AccessibilityBar />

      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand" aria-label="Application brand">
            <div className="app-brand-mark" aria-hidden="true">
              <img src="public/amblum.jpg" alt="" width="48" height="48" />
            </div>

            <span className="app-brand-divider" aria-hidden="true" />

            <div className="app-brand-logo" aria-hidden="true">
              <img src="public/state-icons.png" alt="" width="46" height="46" />
            </div>

            <div className="app-brand-copy">
              <span className="app-brand-title">
                Government of Maharashtra, School Education and Sports
                Department
              </span>
              <span className="app-brand-subtitle">
                Std. 11th Centralised Online Admission Process 2026–27
              </span>
            </div>
          </div>

          <div className="app-header-actions">
            <button
              type="button"
              className="app-icon-button"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            <button
              type="button"
              className="app-action-button"
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              type="button"
              className="app-menu-toggle"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        <div
          ref={menuRef}
          className={`app-mobile-menu ${menuOpen ? "is-open" : ""}`}
          role="menu"
          aria-label="Mobile navigation"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `app-mobile-link ${isActive ? "app-mobile-link--active" : ""}`
              }
            >
              <span className="app-mobile-link-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          <button
            type="button"
            className="app-mobile-logout"
            onClick={handleLogout}
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
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

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="5.5" />
      <path d="M16 16l5 5" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
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
