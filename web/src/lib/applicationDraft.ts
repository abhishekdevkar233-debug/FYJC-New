export const APPLICATION_DRAFT_KEY = "fyjc-application-form-draft";

export const APPLICATION_STEPS = [
  "Registration Details",
  "Personal & Address Details",
  "Category & Reservation",
  "Qualification Details",
  "Upload Documents",
  "Admission Fee",
  "Lock Application",
];

export interface ApplicationDraftSummary {
  current: number;
  completed: number[];
  locked: boolean;
}

export function loadApplicationDraftSummary(): ApplicationDraftSummary | null {
  try {
    const raw = localStorage.getItem(APPLICATION_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      current: parsed.current ?? 0,
      completed: parsed.completed ?? [],
      locked: parsed.locked ?? false,
    };
  } catch {
    return null;
  }
}
