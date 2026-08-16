import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { JuniorCollege } from "../data/juniorColleges";
import { JUNIOR_COLLEGES } from "../data/juniorColleges";

export type QuotaKind = "inHouse" | "minority" | "management";

export const MAX_QUOTA_COLLEGES = 10;

export interface QuotaDocumentRow {
  name: string;
  required: boolean;
  fileName: string | null;
  sampleFormat?: boolean;
}

export interface TimelineLogEntry {
  date: string;
  activity: string;
  subActivity: string;
  activityBy: string;
  details: string;
  ipAddress: string;
}

function findCollege(id: string): JuniorCollege[] {
  const college = JUNIOR_COLLEGES.find((c) => c.id === id);
  return college ? [college] : [];
}

const DEFAULT_MINORITY = findCollege("AM00951SFE");
const DEFAULT_MANAGEMENT = findCollege("MU6618SFE");

const DEFAULT_DOCUMENTS: QuotaDocumentRow[] = [
  {
    name: "10th Standard Marksheet (Non SSC Board MarkSheet is Mandatory)",
    required: true,
    fileName: "sample-1.pdf",
  },
  { name: "School Leaving Certificate", required: false, fileName: null },
  {
    name: "Undertaking of Student for Documents Submission",
    required: false,
    fileName: null,
    sampleFormat: true,
  },
  {
    name: "Self Declaration of Student for Minority Quota",
    required: false,
    fileName: null,
    sampleFormat: true,
  },
];

const DEFAULT_TIMELINE: TimelineLogEntry[] = [
  {
    date: "03/08/2026 18:11:51",
    activity: "Locked",
    subActivity: "CAPForm",
    activityBy: "CBSE00012859",
    details: "Round 7 Application form locked by CBSE00012859 on 03 Aug 2026 18:11:51",
    ipAddress: "136.233.217.146",
  },
  {
    date: "03/08/2026 16:26:01",
    activity: "StreamAndMedium",
    subActivity: "Stream And Medium information saved",
    activityBy: "CBSE00012859",
    details: "Round 7 Stream and Medium information saved by CBSE00012859 on 03 Aug 2026 16:26:01",
    ipAddress: "136.233.217.146",
  },
  {
    date: "03/08/2026 16:23:42",
    activity: "StreamAndMedium",
    subActivity: "Stream And Medium information saved",
    activityBy: "CBSE00012859",
    details: "Round 7 Stream and Medium information saved by CBSE00012859 on 03 Aug 2026 16:23:42",
    ipAddress: "136.233.217.146",
  },
  {
    date: "03/08/2026 16:04:38",
    activity: "UnlockQuotaOptionForm",
    subActivity: "UnLockOptionFormForMANAGEMENTQuota",
    activityBy: "CBSE00012859",
    details: "Round 7 MANAGEMENT Quota Choices UnLock by CBSE00012859 on 03 Aug 2026 16:04:38",
    ipAddress: "136.233.217.146",
  },
  {
    date: "03/08/2026 16:04:14",
    activity: "RegistrationPart2",
    subActivity: "LockOptionFormForManagementQuota",
    activityBy: "CBSE00012859",
    details: "Round 7 Management Quota Choices Locked by CBSE00012859 on 03 Aug 2026 16:04:14",
    ipAddress: "136.233.217.146",
  },
  {
    date: "03/08/2026 16:04:00",
    activity: "UnlockQuotaOptionForm",
    subActivity: "UnLockOptionFormForMINORITYQuota",
    activityBy: "CBSE00012859",
    details: "Round 7 MINORITY Quota Choices Unlock by CBSE00012859 on 03 Aug 2026 16:04:00",
    ipAddress: "136.233.217.146",
  },
  {
    date: "03/08/2026 16:03:56",
    activity: "RegistrationPart2",
    subActivity: "LockOptionFormForMinorityQuota",
    activityBy: "CBSE00012859",
    details: "Round 7 Minority Quota Choices Locked by CBSE00012859 on 03 Aug 2026 16:03:56",
    ipAddress: "136.233.217.146",
  },
  {
    date: "29/07/2026 18:01:58",
    activity: "Locked",
    subActivity: "CAPForm",
    activityBy: "CBSE00012859",
    details: "Round 7 Application form locked by CBSE00012859 on 29 Jul 2026 18:01:58",
    ipAddress: "136.233.217.146",
  },
  {
    date: "29/07/2026 18:01:47",
    activity: "Unlock",
    subActivity: "CAPForm",
    activityBy: "CBSE00012859",
    details: "Round 7 Application form Unlock by CBSE00012859 on 29 Jul 2026 18:01:47",
    ipAddress: "136.233.217.146",
  },
];

interface QuotaContextValue {
  selections: Record<QuotaKind, JuniorCollege[]>;
  savedAt: Record<QuotaKind, string>;
  addCollege: (kind: QuotaKind, college: JuniorCollege) => void;
  removeCollege: (kind: QuotaKind, id: string) => void;
  saveChoices: (kind: QuotaKind) => void;
  documents: QuotaDocumentRow[];
  setDocumentFile: (index: number, fileName: string | undefined) => void;
  removeDocumentFile: (index: number) => void;
  timelineLogs: TimelineLogEntry[];
}

const QuotaContext = createContext<QuotaContextValue | null>(null);

function now() {
  return new Date().toLocaleString("en-IN");
}

export function QuotaProvider({ children }: { children: ReactNode }) {
  const [selections, setSelections] = useState<Record<QuotaKind, JuniorCollege[]>>({
    inHouse: [],
    minority: DEFAULT_MINORITY,
    management: DEFAULT_MANAGEMENT,
  });
  const [savedAt, setSavedAt] = useState<Record<QuotaKind, string>>({
    inHouse: now(),
    minority: now(),
    management: now(),
  });
  const [documents, setDocuments] = useState<QuotaDocumentRow[]>(DEFAULT_DOCUMENTS);

  function addCollege(kind: QuotaKind, college: JuniorCollege) {
    setSelections((prev) => {
      const list = prev[kind];
      if (list.length >= MAX_QUOTA_COLLEGES) return prev;
      if (list.some((c) => c.id === college.id)) return prev;
      return { ...prev, [kind]: [...list, college] };
    });
  }

  function removeCollege(kind: QuotaKind, id: string) {
    setSelections((prev) => ({
      ...prev,
      [kind]: prev[kind].filter((c) => c.id !== id),
    }));
  }

  function saveChoices(kind: QuotaKind) {
    setSavedAt((prev) => ({ ...prev, [kind]: now() }));
  }

  function setDocumentFile(index: number, fileName: string | undefined) {
    if (!fileName) return;
    setDocuments((prev) =>
      prev.map((doc, i) => (i === index ? { ...doc, fileName } : doc)),
    );
  }

  function removeDocumentFile(index: number) {
    setDocuments((prev) =>
      prev.map((doc, i) => (i === index ? { ...doc, fileName: null } : doc)),
    );
  }

  return (
    <QuotaContext.Provider
      value={{
        selections,
        savedAt,
        addCollege,
        removeCollege,
        saveChoices,
        documents,
        setDocumentFile,
        removeDocumentFile,
        timelineLogs: DEFAULT_TIMELINE,
      }}
    >
      {children}
    </QuotaContext.Provider>
  );
}

export function useQuota() {
  const ctx = useContext(QuotaContext);
  if (!ctx) {
    throw new Error("useQuota must be used within a QuotaProvider");
  }
  return ctx;
}
