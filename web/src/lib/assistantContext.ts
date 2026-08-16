import { APPLICATION_STEPS } from "./applicationDraft";
import type {
  CategoryData,
  DocumentRow,
  PaymentData,
  PersonalData,
  RegistrationData,
  SubjectMark,
} from "../context/ApplicationFormContext";
import type { JuniorCollege } from "../data/juniorColleges";
import type { QuotaKind } from "../context/QuotaContext";

const CAP_OPTION_STEPS = ["Choose Stream & Medium", "Rank Your Preferences", "Review & Lock"];

export interface AssistantAppState {
  pathname: string;
  registration: RegistrationData;
  personal: PersonalData;
  category: CategoryData;
  marks: SubjectMark[];
  documents: DocumentRow[];
  payment: PaymentData;
  formCurrent: number;
  formLocked: boolean;
  capStream: string;
  capMedium: string;
  capPreferences: JuniorCollege[];
  capCurrent: number;
  capLocked: boolean;
  quotaSelections: Record<QuotaKind, JuniorCollege[]>;
}

function meritOn500(marks: SubjectMark[]) {
  const total = marks.reduce((sum, row) => sum + (Number(row.marks) || 0), 0);
  const outOf = marks.reduce((sum, row) => sum + (Number(row.outOf) || 0), 0);
  return outOf > 0 ? ((total / outOf) * 500).toFixed(2) : "0.00";
}

/** Human-readable "where am I" summary for the current route + app state. */
export function describeCurrentLocation(state: AssistantAppState): string {
  const { pathname } = state;

  if (pathname.startsWith("/dashboard")) {
    return `You are on the Dashboard. This is your home screen for the FYJC admission portal — from here you can jump into the Application Form, CAP Option, Quota Choices, Miscellaneous and CAP Admissions sections.`;
  }

  if (pathname.startsWith("/application-form")) {
    const stepLabel = APPLICATION_STEPS[state.formCurrent] ?? "Details";
    const uploaded = state.documents.filter((d) => d.fileName).length;
    return (
      `You are in Application Form (Part I) → ${stepLabel} (step ${state.formCurrent + 1} of ${APPLICATION_STEPS.length}). ` +
      `Merit so far: ${meritOn500(state.marks)} / 500. Documents uploaded: ${uploaded}/${state.documents.length}. ` +
      `Payment status: ${state.payment.status}. Form status: ${state.formLocked ? "locked & submitted" : "in progress"}.`
    );
  }

  if (pathname.startsWith("/cap-option")) {
    const stepLabel = CAP_OPTION_STEPS[state.capCurrent] ?? CAP_OPTION_STEPS[0];
    return (
      `You are in CAP Option (Part II) → ${stepLabel}. ` +
      (state.capStream && state.capMedium
        ? `You have selected ${state.capStream} with ${state.capMedium} medium and added ${state.capPreferences.length} college(s). `
        : `You haven't chosen a Stream and Medium yet. `) +
      `You can add up to 10 colleges and then set their preference order. ` +
      `Status: ${state.capLocked ? "locked & submitted" : "in progress"}.`
    );
  }

  if (pathname.startsWith("/quota")) {
    const kind: QuotaKind | null = pathname.includes("in-house")
      ? "inHouse"
      : pathname.includes("minority")
        ? "minority"
        : pathname.includes("management")
          ? "management"
          : null;
    if (pathname.includes("documents")) {
      return `You are in Quota Choices (Part II) → Upload Document. Use this page to upload the documents required to support your quota applications.`;
    }
    if (pathname.includes("timeline")) {
      return `You are in Quota Choices (Part II) → Timeline Log. This page lists a history of actions taken on your application (locks, unlocks, saves) with date and time.`;
    }
    if (kind) {
      const label = kind === "inHouse" ? "In-House" : kind === "minority" ? "Minority" : "Management";
      const count = state.quotaSelections[kind].length;
      return `You are in Quota Choices (Part II) → Apply for ${label} Quota. You have selected ${count} college(s) for this quota (maximum 10). Search, add colleges to your list, and save your choices.`;
    }
    return `You are in Quota Choices (Part II). Use the submenu to apply for In-House, Minority or Management quota, upload supporting documents, or view your timeline log.`;
  }

  if (pathname.startsWith("/miscellaneous")) {
    if (pathname.includes("payment-history")) {
      return `You are in Miscellaneous → Payment History. This page lists all payments made against your application.`;
    }
    if (pathname.includes("grievance")) {
      return `You are in Miscellaneous → Grievance. Raise a new grievance or track the status of grievances you've already submitted.`;
    }
    if (pathname.includes("withdraw-application")) {
      return `You are in Miscellaneous → Withdraw Application. This page shows a full read-only preview of your application. The Withdraw Application action is currently disabled in this prototype.`;
    }
    return `You are in the Miscellaneous section, covering Payment History, Grievance and Withdraw Application.`;
  }

  if (pathname.startsWith("/cap-admission")) {
    if (pathname.includes("summary")) {
      return `You are in CAP Admissions → CAP Admission Summary. This page shows a round-by-round summary table of the CAP admission process.`;
    }
    if (pathname.includes("status")) {
      return `You are in CAP Admissions → CAP Allotment Status. Filter by round to check your seat allotment status for that round.`;
    }
    return `You are in the CAP Admissions section, covering Allotment Status and Admission Summary.`;
  }

  if (pathname.startsWith("/whatsapp")) {
    return `You are on the WhatsApp prototype page — a simulated chat assistant that reports your application, lock, payment, CAP option and quota status.`;
  }

  return `You are in the FYJC 11th Admission portal.`;
}

function nextActionHint(state: AssistantAppState): string {
  const { pathname } = state;

  if (pathname.startsWith("/application-form")) {
    if (state.formLocked) return "Your Application Form is locked. Head to the Dashboard to continue with Part II (CAP Option).";
    if (state.formCurrent === 4 && state.payment.status !== "success") return "Complete the Admission Fee payment to proceed to the next step.";
    if (state.formCurrent === APPLICATION_STEPS.length - 1) return "Review your details and click 'Lock Application Form' to submit Part I.";
    return `Fill in the required fields on this step, then click 'Next' to continue to ${APPLICATION_STEPS[state.formCurrent + 1] ?? "the next step"}.`;
  }

  if (pathname.startsWith("/cap-option")) {
    if (state.capLocked) return "Your CAP Option preferences are locked.";
    if (!state.capStream || !state.capMedium) return "Choose a Stream and Medium to see the list of available Junior Colleges.";
    if (state.capCurrent === 0) return "Click 'Next' to start ranking your preferred colleges.";
    if (state.capCurrent === 1 && state.capPreferences.length === 0) return "Search and add at least one Junior College to your preference list.";
    if (state.capCurrent === 1) return "Reorder your colleges by priority, then continue to Review & Lock.";
    return "Review your selections and lock your CAP Option preferences.";
  }

  if (pathname.startsWith("/quota")) {
    return "Search for a college, add it to your list, and click Save to record your quota choice.";
  }

  return "Use the sidebar to navigate to the section you need.";
}

function summarizeApplication(state: AssistantAppState): string {
  const uploaded = state.documents.filter((d) => d.fileName).length;
  const quotaTotal =
    state.quotaSelections.inHouse.length +
    state.quotaSelections.minority.length +
    state.quotaSelections.management.length;
  return (
    `Application summary — Board: ${state.registration.board}, Merit: ${meritOn500(state.marks)}/500. ` +
    `Part I: ${state.formLocked ? "locked" : "in progress"}, documents ${uploaded}/${state.documents.length}, payment ${state.payment.status}. ` +
    `CAP Option: ${state.capStream || "not chosen"} ${state.capMedium ? `(${state.capMedium} medium)` : ""}, ${state.capPreferences.length} college(s) selected, ${state.capLocked ? "locked" : "in progress"}. ` +
    `Quota choices: ${quotaTotal} college(s) selected across In-House/Minority/Management.`
  );
}

export interface AssistantAnswer {
  text: string;
}

/** Very small rule-based intent matcher over the current app/page context. */
export function answerQuestion(question: string, state: AssistantAppState): AssistantAnswer {
  const q = question.trim().toLowerCase();

  if (!q) {
    return { text: "I didn't catch a question. Try asking something like \"Where am I?\" or \"What should I do next?\"" };
  }

  if (/where am i|which page|current page|what page/.test(q)) {
    return { text: describeCurrentLocation(state) };
  }

  if (/what.*next|what should i do|next step|proceed/.test(q)) {
    return { text: nextActionHint(state) };
  }

  if (/summar(y|ize)|overview|status of my application/.test(q)) {
    return { text: summarizeApplication(state) };
  }

  if (/how does this (step|page|section) work|explain this (step|page)|help/.test(q)) {
    return { text: `${describeCurrentLocation(state)} ${nextActionHint(state)}` };
  }

  if (/merit|marks/.test(q)) {
    return { text: `Your current merit score is ${meritOn500(state.marks)} out of 500, based on the subject marks entered in the Qualification step.` };
  }

  if (/payment|fee|paid/.test(q)) {
    return {
      text:
        state.payment.status === "success"
          ? `Your Admission Fee payment was successful. Transaction reference: ${state.payment.transactionRef}.`
          : state.payment.status === "failed"
            ? "Your last payment attempt failed and no amount was deducted. Please retry from the Admission Fee step."
            : "No payment has been made yet. Complete it from the Admission Fee step in the Application Form.",
    };
  }

  if (/lock|submit/.test(q)) {
    return {
      text: `Application Form (Part I): ${state.formLocked ? "locked" : "unlocked"}. CAP Option (Part II): ${state.capLocked ? "locked" : "unlocked"}.`,
    };
  }

  if (/college|preference|cap option/.test(q)) {
    return {
      text:
        state.capPreferences.length > 0
          ? `You've added ${state.capPreferences.length} college(s) to your CAP Option preference list. Your top priority is ${state.capPreferences[0].name}.`
          : "You haven't added any colleges to your CAP Option preference list yet.",
    };
  }

  if (/document|upload/.test(q)) {
    const uploaded = state.documents.filter((d) => d.fileName).length;
    return { text: `You've uploaded ${uploaded} of ${state.documents.length} required documents in the Application Form.` };
  }

  if (/quota/.test(q)) {
    const total =
      state.quotaSelections.inHouse.length +
      state.quotaSelections.minority.length +
      state.quotaSelections.management.length;
    return { text: `You have selected ${total} college(s) in total across In-House, Minority and Management quota.` };
  }

  return {
    text:
      "I can help with your application status, current step, documents, payments, CAP option and quota choices. Try one of the suggested questions below, or ask about a specific field or step.",
  };
}
