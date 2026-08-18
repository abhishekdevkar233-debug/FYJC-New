import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { speakBest, SPEECH_LOCALE } from "../lib/speech";
import { PAYMENT_RESULT_VOICEOVER } from "../lib/applicationDraft";
import { useLanguage } from "./LanguageContext";

export interface RegistrationData {
  schoolArea: "Within Maharashtra State" | "Outside Maharashtra State";
  status: "Fresher" | "Repeater" | "Previously Passed";
  board: string;
  seatNumber: string;
  month: string;
  year: string;
  name: string;
}

export interface PersonalData {
  fullName: string;
  motherName: string;
  gender: string;
  dob: string;
  schoolName: string;
  udise: string;
  indexNumber: string;
  residence: string;
  address: string;
  pin: string;
  state: string;
  district: string;
  area: string;
  city: string;
  mobile1: string;
  mobile2: string;
  landline: string;
  email: string;
}

export interface CategoryData {
  originalCategory: string;
  admissionCategory: string;
  handicapped: "Yes" | "No";
  earthquakeOrProjectAffected: "Yes" | "No";
  parentTransferred: "Yes" | "No";
  grandparentsFreedomFighter: "Yes" | "No";
  parentDefenceServiceman: "Yes" | "No";
  sportsCategory: "Yes" | "No";
  orphanQuota: "Yes" | "No";
  minority: "Belongs to Minority Category" | "Does Not Belong";
  linguisticMinority: string;
  religiousMinority: string;
  inhouse: "Yes, apply through Inhouse Quota" | "No";
}

export interface SubjectMark {
  subject: string;
  name: string;
  marks: string;
  outOf: string;
}

export interface DocumentRow {
  name: string;
  required: boolean;
  fileName: string | null;
  fileSize: string | null;
  uploadedAt: string | null;
}

export interface PaymentData {
  status: "pending" | "success" | "failed";
  transactionRef: string | null;
  mode: string | null;
  date: string | null;
}

const DEFAULT_REGISTRATION: RegistrationData = {
  schoolArea: "Within Maharashtra State",
  status: "Previously Passed",
  board: "CBSE",
  seatNumber: "CBSE0001",
  month: "March",
  year: "2026",
  name: "Abhishek Devkar",
};

const DEFAULT_PERSONAL: PersonalData = {
  fullName: "Abhishek Devkar",
  motherName: "SEEMA",
  gender: "Male",
  dob: "09/04/2012",
  schoolName: "DHARMRAJ KANYA VIDYALAYA NAVEGAON PANDAV",
  udise: "27131004203",
  indexNumber: "",
  residence: "AHILYANAGAR",
  address: "kothrud pune",
  pin: "414001",
  state: "Maharashtra",
  district: "AHILYANAGAR",
  area: "PUNE",
  city: "PUNE",
  mobile1: "9493302559",
  mobile2: "",
  landline: "",
  email: "",
};

const DEFAULT_CATEGORY: CategoryData = {
  originalCategory: "General / Open",
  admissionCategory: "General / Open",
  handicapped: "No",
  earthquakeOrProjectAffected: "No",
  parentTransferred: "No",
  grandparentsFreedomFighter: "No",
  parentDefenceServiceman: "No",
  sportsCategory: "No",
  orphanQuota: "No",
  minority: "Belongs to Minority Category",
  linguisticMinority: "Konkani",
  religiousMinority: "Muslim",
  inhouse: "Yes, apply through Inhouse Quota",
};

const DEFAULT_MARKS: SubjectMark[] = [
  { subject: "Subject 1", name: "Maths", marks: "90", outOf: "100" },
  { subject: "Subject 2", name: "Science", marks: "85", outOf: "100" },
  { subject: "Subject 3", name: "History", marks: "80", outOf: "100" },
  { subject: "Subject 4", name: "English", marks: "82", outOf: "100" },
  { subject: "Subject 5", name: "Marathi", marks: "70", outOf: "100" },
];

const DEFAULT_DOCUMENTS: DocumentRow[] = [
  {
    name: "10th Standard Marksheet (Non-SSC board marksheet is mandatory)",
    required: true,
    fileName: "marksheet.pdf",
    fileSize: "245 KB",
    uploadedAt: "12 Aug 2026, 04:15 PM",
  },
  {
    name: "School Leaving Certificate",
    required: true,
    fileName: null,
    fileSize: null,
    uploadedAt: null,
  },
  {
    name: "Undertaking of Student for Documents Submission",
    required: true,
    fileName: null,
    fileSize: null,
    uploadedAt: null,
  },
  {
    name: "Self Declaration of Student for Minority Quota",
    required: true,
    fileName: null,
    fileSize: null,
    uploadedAt: null,
  },
];

const DEFAULT_PAYMENT: PaymentData = {
  status: "pending",
  transactionRef: null,
  mode: null,
  date: null,
};

interface ApplicationFormContextValue {
  current: number;
  setCurrent: (index: number) => void;
  completed: Set<number>;
  setCompleted: React.Dispatch<React.SetStateAction<Set<number>>>;
  locked: boolean;
  setLocked: (locked: boolean) => void;
  registration: RegistrationData;
  setRegistration: (data: RegistrationData) => void;
  personal: PersonalData;
  setPersonal: (data: PersonalData) => void;
  category: CategoryData;
  setCategory: (data: CategoryData) => void;
  passingStatus: string;
  setPassingStatus: (value: string) => void;
  passedEnglish: string;
  setPassedEnglish: (value: string) => void;
  passedScience: string;
  setPassedScience: (value: string) => void;
  marks: SubjectMark[];
  setMarks: React.Dispatch<React.SetStateAction<SubjectMark[]>>;
  documents: DocumentRow[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentRow[]>>;
  payment: PaymentData;
  resolvePayment: (result: "success" | "failed") => void;
}

const ApplicationFormContext =
  createContext<ApplicationFormContextValue | null>(null);

export function ApplicationFormProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const voiceoverLangKey = language === "MR" ? "MR" : "EN";
  const voiceoverLocale = language === "MR" ? SPEECH_LOCALE.MR : SPEECH_LOCALE.EN;
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [locked, setLocked] = useState(false);
  const [registration, setRegistration] =
    useState<RegistrationData>(DEFAULT_REGISTRATION);
  const [personal, setPersonal] = useState<PersonalData>(DEFAULT_PERSONAL);
  const [category, setCategory] = useState<CategoryData>(DEFAULT_CATEGORY);
  const [passingStatus, setPassingStatus] = useState("PASS");
  const [passedEnglish, setPassedEnglish] = useState("Yes");
  const [passedScience, setPassedScience] = useState("Yes");
  const [marks, setMarks] = useState<SubjectMark[]>(DEFAULT_MARKS);
  const [documents, setDocuments] = useState<DocumentRow[]>(DEFAULT_DOCUMENTS);
  const [payment, setPayment] = useState<PaymentData>(DEFAULT_PAYMENT);

  function resolvePayment(result: "success" | "failed") {
    if (result === "success") {
      setPayment({
        status: "success",
        transactionRef: crypto.randomUUID(),
        mode: "UPI",
        date: new Date().toLocaleString("en-IN"),
      });
    } else {
      setPayment({
        status: "failed",
        transactionRef: null,
        mode: null,
        date: null,
      });
      void speakBest(PAYMENT_RESULT_VOICEOVER.failed[voiceoverLangKey], voiceoverLocale);
    }
  }

  return (
    <ApplicationFormContext.Provider
      value={{
        current,
        setCurrent,
        completed,
        setCompleted,
        locked,
        setLocked,
        registration,
        setRegistration,
        personal,
        setPersonal,
        category,
        setCategory,
        passingStatus,
        setPassingStatus,
        passedEnglish,
        setPassedEnglish,
        passedScience,
        setPassedScience,
        marks,
        setMarks,
        documents,
        setDocuments,
        payment,
        resolvePayment,
      }}
    >
      {children}
    </ApplicationFormContext.Provider>
  );
}

export function useApplicationForm(): ApplicationFormContextValue {
  const ctx = useContext(ApplicationFormContext);
  if (!ctx) {
    throw new Error(
      "useApplicationForm must be used within an ApplicationFormProvider",
    );
  }
  return ctx;
}
