import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { JuniorCollege } from "../data/juniorColleges";

export const MAX_PREFERENCES = 10;

interface CapOptionContextValue {
  current: number;
  setCurrent: (index: number) => void;
  completed: Set<number>;
  setCompleted: React.Dispatch<React.SetStateAction<Set<number>>>;
  locked: boolean;
  stream: string;
  setStream: (value: string) => void;
  medium: string;
  setMedium: (value: string) => void;
  preferences: JuniorCollege[];
  addCollege: (college: JuniorCollege) => void;
  removeCollege: (id: string) => void;
  reorder: (fromIndex: number, toIndex: number) => void;
  moveUp: (index: number) => void;
  moveDown: (index: number) => void;
  lockPreferences: () => void;
}

const CapOptionContext = createContext<CapOptionContextValue | null>(null);

export function CapOptionProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [locked, setLocked] = useState(false);
  const [stream, setStream] = useState("");
  const [medium, setMedium] = useState("");
  const [preferences, setPreferences] = useState<JuniorCollege[]>([]);

  function addCollege(college: JuniorCollege) {
    setPreferences((prev) => {
      if (prev.length >= MAX_PREFERENCES) return prev;
      if (prev.some((c) => c.id === college.id)) return prev;
      return [...prev, college];
    });
  }

  function removeCollege(id: string) {
    setPreferences((prev) => prev.filter((c) => c.id !== id));
  }

  function reorder(fromIndex: number, toIndex: number) {
    setPreferences((prev) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex >= prev.length
      ) {
        return prev;
      }
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  function moveUp(index: number) {
    if (index > 0) reorder(index, index - 1);
  }

  function moveDown(index: number) {
    reorder(index, index + 1);
  }

  function lockPreferences() {
    setCompleted((prev) => new Set(prev).add(current));
    setLocked(true);
  }

  return (
    <CapOptionContext.Provider
      value={{
        current,
        setCurrent,
        completed,
        setCompleted,
        locked,
        stream,
        setStream,
        medium,
        setMedium,
        preferences,
        addCollege,
        removeCollege,
        reorder,
        moveUp,
        moveDown,
        lockPreferences,
      }}
    >
      {children}
    </CapOptionContext.Provider>
  );
}

export function useCapOption() {
  const ctx = useContext(CapOptionContext);
  if (!ctx) {
    throw new Error("useCapOption must be used within a CapOptionProvider");
  }
  return ctx;
}
