import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type PortalStyle = "style1" | "style2" | "style3";

export const PORTAL_STYLE_OPTIONS: { value: PortalStyle; label: string }[] = [
  { value: "style1", label: "Style 01 — Classic Government" },
  { value: "style2", label: "Style 02 — Modern Minimal" },
  { value: "style3", label: "Style 03 — Modern Dashboard" },
];

interface PortalStyleContextValue {
  portalStyle: PortalStyle;
  setPortalStyle: (style: PortalStyle) => void;
}

const PortalStyleContext = createContext<PortalStyleContextValue | null>(null);

export function PortalStyleProvider({ children }: { children: ReactNode }) {
  const [portalStyle, setPortalStyle] = useState<PortalStyle>("style1");

  useEffect(() => {
    document.documentElement.setAttribute("data-portal-style", portalStyle);
  }, [portalStyle]);

  return (
    <PortalStyleContext.Provider value={{ portalStyle, setPortalStyle }}>
      {children}
    </PortalStyleContext.Provider>
  );
}

export function usePortalStyle() {
  const ctx = useContext(PortalStyleContext);
  if (!ctx) {
    throw new Error("usePortalStyle must be used within a PortalStyleProvider");
  }
  return ctx;
}
