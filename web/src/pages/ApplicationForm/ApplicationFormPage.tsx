import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "../../components/ui/TextField";
import { SelectField } from "../../components/ui/SelectField";
import { ChoiceCard } from "../../components/ui/ChoiceCard";
import { Button } from "../../components/ui/Button";
import { Toast } from "../../components/ui/Toast";
import { APPLICATION_DRAFT_KEY, APPLICATION_STEPS } from "../../lib/applicationDraft";
import "./ApplicationFormPage.css";

const STEPS = APPLICATION_STEPS;

// Shorter labels for the stepper tabs so all 7 steps fit on one line;
// the full descriptive name still shows as the step's heading.
const STEP_TAB_LABELS = [
  "Registration",
  "Personal & Address",
  "Category & Reservation",
  "Qualification",
  "Documents",
  "Admission Fee",
  "Lock Application",
];

interface RegistrationData {
  schoolArea: "Within Maharashtra State" | "Outside Maharashtra State";
  status: "Fresher" | "Repeater" | "Previously Passed";
  board: string;
  seatNumber: string;
  month: string;
  year: string;
  name: string;
}

interface PersonalData {
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

interface CategoryData {
  originalCategory: string;
  admissionCategory: string;
  minority: "Belongs to Minority Category" | "Does Not Belong";
  linguisticMinority: string;
  religiousMinority: string;
  inhouse: "Yes, apply through Inhouse Quota" | "No";
}

interface SubjectMark {
  subject: string;
  name: string;
  marks: string;
  outOf: string;
}

interface DocumentRow {
  name: string;
  required: boolean;
  fileName: string | null;
}

const BOARD_OPTIONS = [
  "SSC",
  "CBSE",
  "CISCE / ICSE",
  "IB",
  "IGCSE",
  "NIOS",
  "Any Other Board",
];

const DEFAULT_REGISTRATION: RegistrationData = {
  schoolArea: "Within Maharashtra State",
  status: "Previously Passed",
  board: "CBSE",
  seatNumber: "CBSE0001",
  month: "March",
  year: "2026",
  name: "Ajit Pawar",
};

const DEFAULT_PERSONAL: PersonalData = {
  fullName: "Ajit Pawar",
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
  minority: "Belongs to Minority Category",
  linguisticMinority: "Konkani",
  religiousMinority: "Muslim",
  inhouse: "Yes, apply through Inhouse Quota",
};

const DEFAULT_MARKS: SubjectMark[] = [
  { subject: "Subject 1", name: "Maths", marks: "100", outOf: "100" },
  { subject: "Subject 2", name: "Science", marks: "90", outOf: "100" },
  { subject: "Subject 3", name: "History", marks: "80", outOf: "100" },
  { subject: "Subject 4", name: "English", marks: "100", outOf: "100" },
  { subject: "Subject 5", name: "Marathi", marks: "100", outOf: "100" },
];

const DEFAULT_DOCUMENTS: DocumentRow[] = [
  {
    name: "10th Standard Marksheet (Non-SSC board marksheet is mandatory)",
    required: true,
    fileName: "marksheet.pdf",
  },
  { name: "School Leaving Certificate", required: false, fileName: null },
  {
    name: "Undertaking of Student for Documents Submission",
    required: false,
    fileName: null,
  },
  {
    name: "Self Declaration of Student for Minority Quota",
    required: false,
    fileName: null,
  },
];

const STORAGE_KEY = APPLICATION_DRAFT_KEY;

interface StoredDraft {
  current: number;
  completed: number[];
  locked: boolean;
  registration: RegistrationData;
  personal: PersonalData;
  category: CategoryData;
  passingStatus: string;
  passedEnglish: string;
  passedScience: string;
  marks: SubjectMark[];
  documents: DocumentRow[];
}

function loadDraft(): Partial<StoredDraft> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function ApplicationFormPage() {
  const navigate = useNavigate();
  const draft = loadDraft();

  const [current, setCurrent] = useState(draft?.current ?? 0);
  const [completed, setCompleted] = useState<Set<number>>(new Set(draft?.completed ?? []));
  const [locked, setLocked] = useState(draft?.locked ?? false);

  const [registration, setRegistration] = useState<RegistrationData>(
    draft?.registration ?? DEFAULT_REGISTRATION,
  );
  const [personal, setPersonal] = useState<PersonalData>(draft?.personal ?? DEFAULT_PERSONAL);
  const [category, setCategory] = useState<CategoryData>(draft?.category ?? DEFAULT_CATEGORY);
  const [passingStatus, setPassingStatus] = useState(draft?.passingStatus ?? "PASS");
  const [passedEnglish, setPassedEnglish] = useState(draft?.passedEnglish ?? "Yes");
  const [passedScience, setPassedScience] = useState(draft?.passedScience ?? "Yes");
  const [marks, setMarks] = useState<SubjectMark[]>(draft?.marks ?? DEFAULT_MARKS);
  const [documents, setDocuments] = useState<DocumentRow[]>(draft?.documents ?? DEFAULT_DOCUMENTS);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const payload: StoredDraft = {
      current,
      completed: Array.from(completed),
      locked,
      registration,
      personal,
      category,
      passingStatus,
      passedEnglish,
      passedScience,
      marks,
      documents,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    current,
    completed,
    locked,
    registration,
    personal,
    category,
    passingStatus,
    passedEnglish,
    passedScience,
    marks,
    documents,
  ]);

  const totalMarks = marks.reduce(
    (sum, row) => sum + (Number(row.marks) || 0),
    0,
  );
  const totalOutOf = marks.reduce(
    (sum, row) => sum + (Number(row.outOf) || 0),
    0,
  );
  const meritOn500 =
    totalOutOf > 0 ? ((totalMarks / totalOutOf) * 500).toFixed(2) : "0.00";

  function goTo(index: number) {
    setCurrent(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showSavedToast() {
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 3000);
  }

  function handleSaveDraft() {
    showSavedToast();
  }

  function handleNext() {
    setCompleted((prev) => new Set(prev).add(current));
    if (current < STEPS.length - 1) {
      goTo(current + 1);
    }
    showSavedToast();
  }

  function handlePrev() {
    if (current > 0) goTo(current - 1);
  }

  function handleLock() {
    setCompleted((prev) => new Set(prev).add(current));
    setLocked(true);
  }

  function updateMark(index: number, field: keyof SubjectMark, value: string) {
    setMarks((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  function handleFileChosen(index: number, fileName: string | undefined) {
    if (!fileName) return;
    setDocuments((prev) =>
      prev.map((doc, i) => (i === index ? { ...doc, fileName } : doc)),
    );
  }

  return (
    <div className="app-form-page">
      <div className="app-form-topbar">
        <div>
          Application Form No.{" "}
          <span className="app-form-id">FYJC2026-00842</span>
        </div>
        <span
          className={`app-form-status ${locked ? "app-form-status--locked" : ""}`}
        >
          <span className="app-form-status-dot" />
          {locked ? "Locked" : "In Progress"}
        </span>
      </div>

      <div className="app-form-stepper-wrap">
        <ol className="app-form-stepper">
          {STEPS.map((fullLabel, index) => {
            const tabLabel = STEP_TAB_LABELS[index];
            const isDone =
              completed.has(index) || (locked && index === STEPS.length - 1);
            const isCurrent = index === current;
            return (
              <li key={fullLabel} className="app-form-step-item">
                {isDone ? (
                  <span
                    className="app-form-step app-form-step--done"
                    aria-label={`${fullLabel} (completed, read only)`}
                  >
                    <span className="app-form-step-badge">
                      <StepCheckIcon />
                    </span>
                    <span className="app-form-step-label">{tabLabel}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    className={`app-form-step ${isCurrent ? "app-form-step--current" : ""}`}
                    onClick={() => goTo(index)}
                    aria-current={isCurrent ? "step" : undefined}
                    aria-label={fullLabel}
                  >
                    <span className="app-form-step-badge">{index + 1}</span>
                    <span className="app-form-step-label">{tabLabel}</span>
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="app-form-shell">
        <div className="app-form-card">
          <div className="app-form-card-head">
            <h1>{STEPS[current]}</h1>
            <span className="app-form-step-count">
              STEP {String(current + 1).padStart(2, "0")} / {STEPS.length}
            </span>
          </div>

          {current === 0 && (
            <RegistrationStep data={registration} onChange={setRegistration} />
          )}
          {current === 1 && (
            <PersonalStep data={personal} onChange={setPersonal} />
          )}
          {current === 2 && (
            <CategoryStep data={category} onChange={setCategory} />
          )}
          {current === 3 && (
            <QualificationStep
              passingStatus={passingStatus}
              setPassingStatus={setPassingStatus}
              passedEnglish={passedEnglish}
              setPassedEnglish={setPassedEnglish}
              passedScience={passedScience}
              setPassedScience={setPassedScience}
              marks={marks}
              updateMark={updateMark}
              totalMarks={totalMarks}
              totalOutOf={totalOutOf}
              meritOn500={meritOn500}
            />
          )}
          {current === 4 && (
            <DocumentsStep
              documents={documents}
              onFileChosen={handleFileChosen}
            />
          )}
          {current === 5 && <PaymentStep />}
          {current === 6 && (
            <LockStep
              applicantName={personal.fullName}
              board={registration.board}
              category={category.admissionCategory}
              merit={meritOn500}
              documentsUploaded={documents.filter((d) => d.fileName).length}
              locked={locked}
            />
          )}

          <div className="app-form-footer">
            <Button
              variant="secondary"
              onClick={handlePrev}
              disabled={current === 0}
            >
              &larr; Previous
            </Button>
            <div className="app-form-footer-right">
              {current === STEPS.length - 1 ? (
                <Button onClick={handleLock} disabled={locked}>
                  {locked ? "Application Locked" : "Lock Application Form"}
                </Button>
              ) : (
                <>
                  <Button variant="secondary" type="button" onClick={handleSaveDraft}>
                    Save Draft
                  </Button>
                  <Button onClick={handleNext}>Save &amp; Next &rarr;</Button>
                </>
              )}
            </div>
          </div>
        </div>

        {locked && (
          <div className="app-form-locked-note">
            Application locked. Return to the{" "}
            <button
              type="button"
              className="app-form-inline-link"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>{" "}
            to continue with Part II.
          </div>
        )}
      </div>

      <Toast message="Application saved successfully" visible={toastVisible} />
    </div>
  );
}

function RegistrationStep({
  data,
  onChange,
}: {
  data: RegistrationData;
  onChange: (data: RegistrationData) => void;
}) {
  return (
    <div className="app-form-section">
      <p className="app-form-req-note">
        <span className="app-form-req">*</span> indicates a required field
      </p>

      <h2 className="app-form-section-title">Applicant's 10th School Area</h2>
      <div className="app-form-choice-grid">
        <ChoiceCard
          name="schoolArea"
          title="Within Maharashtra State"
          description="Applicant's passing standard 10th examination from a school located in Maharashtra State"
          selected={data.schoolArea === "Within Maharashtra State"}
          onSelect={() =>
            onChange({ ...data, schoolArea: "Within Maharashtra State" })
          }
        />
        <ChoiceCard
          name="schoolArea"
          title="Outside Maharashtra State"
          description="Applicant's passing standard 10th examination from a school located outside Maharashtra State / outside India"
          selected={data.schoolArea === "Outside Maharashtra State"}
          onSelect={() =>
            onChange({ ...data, schoolArea: "Outside Maharashtra State" })
          }
        />
      </div>

      <h2 className="app-form-section-title">Applicant's Status</h2>
      <div className="app-form-choice-grid">
        <ChoiceCard
          name="status"
          title="Fresher"
          description="Applicant appearing for standard 10th examination for the first time"
          selected={data.status === "Fresher"}
          onSelect={() => onChange({ ...data, status: "Fresher" })}
        />
        <ChoiceCard
          name="status"
          title="Repeater"
          description="Applicant reappearing for standard 10th examination"
          selected={data.status === "Repeater"}
          onSelect={() => onChange({ ...data, status: "Repeater" })}
        />
        <ChoiceCard
          name="status"
          title="Previously Passed"
          description="Applicant has passed standard 10th examination in an earlier year"
          selected={data.status === "Previously Passed"}
          onSelect={() => onChange({ ...data, status: "Previously Passed" })}
        />
      </div>

      <h2 className="app-form-section-title">
        10th Standard or Equivalent Examination Board
      </h2>
      <div className="app-form-choice-grid">
        {BOARD_OPTIONS.map((board) => (
          <ChoiceCard
            key={board}
            name="board"
            title={board}
            selected={data.board === board}
            onSelect={() => onChange({ ...data, board })}
          />
        ))}
      </div>

      <h2 className="app-form-section-title">
        10th Standard or Equivalent Examination Details
      </h2>
      <div className="app-form-field-grid">
        <TextField
          className="ux4g-field--tight"
          label="Seat Number"
          required
          value={data.seatNumber}
          onChange={(e) => onChange({ ...data, seatNumber: e.target.value })}
        />
        <SelectField
          className="ux4g-field--tight"
          label="Month of Examination"
          required
          options={["January", "February", "March", "April", "May"]}
          value={data.month}
          onChange={(e) => onChange({ ...data, month: e.target.value })}
        />
        <SelectField
          className="ux4g-field--tight"
          label="Year of Examination"
          required
          options={["2024", "2025", "2026"]}
          value={data.year}
          onChange={(e) => onChange({ ...data, year: e.target.value })}
        />
        <TextField
          className="ux4g-field--tight"
          label="Name of the Applicant"
          required
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
        />
      </div>
    </div>
  );
}

function PersonalStep({
  data,
  onChange,
}: {
  data: PersonalData;
  onChange: (data: PersonalData) => void;
}) {
  function set<K extends keyof PersonalData>(key: K, value: PersonalData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="app-form-section">
      <p className="app-form-req-note">
        <span className="app-form-req">*</span> indicates a required field
      </p>

      <h2 className="app-form-section-title">Applicant Identity</h2>
      <div className="app-form-field-grid">
        <TextField
          className="ux4g-field--tight"
          label="Full Name"
          required
          value={data.fullName}
          onChange={(e) => set("fullName", e.target.value)}
        />
        <TextField
          className="ux4g-field--tight"
          label="Mother's Name"
          required
          value={data.motherName}
          onChange={(e) => set("motherName", e.target.value)}
        />
        <SelectField
          className="ux4g-field--tight"
          label="Gender"
          required
          options={["Male", "Female", "Other"]}
          value={data.gender}
          onChange={(e) => set("gender", e.target.value)}
        />
        <TextField
          className="ux4g-field--tight"
          label="Date of Birth"
          required
          value={data.dob}
          onChange={(e) => set("dob", e.target.value)}
        />
      </div>

      <h2 className="app-form-section-title">10th School Information</h2>
      <div className="app-form-field-grid">
        <TextField
          className="ux4g-field--tight"
          label="10th School Name"
          required
          value={data.schoolName}
          onChange={(e) => set("schoolName", e.target.value)}
        />
        <TextField
          className="ux4g-field--tight"
          label="10th School UDISE Number"
          required
          value={data.udise}
          onChange={(e) => set("udise", e.target.value)}
        />
        <TextField
          className="ux4g-field--tight"
          label="10th School Index Number"
          value={data.indexNumber}
          onChange={(e) => set("indexNumber", e.target.value)}
        />
        <TextField
          className="ux4g-field--tight"
          label="Residence"
          required
          value={data.residence}
          onChange={(e) => set("residence", e.target.value)}
        />
      </div>

      <h2 className="app-form-section-title">Address for Correspondence</h2>
      <div className="app-form-field-grid app-form-field-grid--cols-3">
        <TextField
          className="ux4g-field--tight"
          label="Address"
          required
          value={data.address}
          onChange={(e) => set("address", e.target.value)}
        />
        <TextField
          className="ux4g-field--tight"
          label="Pin Code"
          required
          value={data.pin}
          onChange={(e) => set("pin", e.target.value)}
        />
        <SelectField
          className="ux4g-field--tight"
          label="State"
          required
          options={["Maharashtra"]}
          value={data.state}
          onChange={(e) => set("state", e.target.value)}
        />
      </div>
      <div className="app-form-field-grid app-form-field-grid--cols-3">
        <SelectField
          className="ux4g-field--tight"
          label="District"
          required
          options={["AHILYANAGAR", "PUNE", "THANE"]}
          value={data.district}
          onChange={(e) => set("district", e.target.value)}
        />
        <TextField
          className="ux4g-field--tight"
          label="Area / Block / Tehsil / Taluka"
          required
          value={data.area}
          onChange={(e) => set("area", e.target.value)}
        />
        <TextField
          className="ux4g-field--tight"
          label="City / Town / Village"
          required
          value={data.city}
          onChange={(e) => set("city", e.target.value)}
        />
      </div>

      <h2 className="app-form-section-title">Contact Details</h2>
      <div className="app-form-field-grid app-form-field-grid--cols-4">
        <TextField
          className="ux4g-field--tight"
          label="Mobile Number 1"
          required
          value={data.mobile1}
          onChange={(e) => set("mobile1", e.target.value)}
        />
        <TextField
          className="ux4g-field--tight"
          label="Mobile Number 2"
          value={data.mobile2}
          onChange={(e) => set("mobile2", e.target.value)}
        />
        <TextField
          className="ux4g-field--tight"
          label="Landline Phone Number"
          value={data.landline}
          onChange={(e) => set("landline", e.target.value)}
        />
        <TextField
          className="ux4g-field--tight"
          label="E-Mail ID"
          value={data.email}
          onChange={(e) => set("email", e.target.value)}
        />
      </div>

      <div className="app-form-callout">
        <InfoIcon />
        <span>
          If the applicant has no mobile number or e-mail, use a parent's or
          relative's details so admission updates reach someone reliably.
        </span>
      </div>
    </div>
  );
}

function CategoryStep({
  data,
  onChange,
}: {
  data: CategoryData;
  onChange: (data: CategoryData) => void;
}) {
  return (
    <div className="app-form-section">
      <h2 className="app-form-section-title">Reservation Details</h2>
      <div className="app-form-field-grid">
        <SelectField
          className="ux4g-field--tight"
          label="Original Category"
          required
          options={["General / Open", "OBC", "SC", "ST", "EWS"]}
          value={data.originalCategory}
          onChange={(e) =>
            onChange({ ...data, originalCategory: e.target.value })
          }
        />
        <SelectField
          className="ux4g-field--tight"
          label="Category for Admission"
          required
          options={["General / Open", "OBC", "SC", "ST", "EWS"]}
          value={data.admissionCategory}
          onChange={(e) =>
            onChange({ ...data, admissionCategory: e.target.value })
          }
        />
      </div>

      <h2 className="app-form-section-title">Admission for Minority Quota</h2>
      <div className="app-form-choice-grid">
        <ChoiceCard
          name="minority"
          title="Belongs to Minority Category"
          description="Applicant identifies as belonging to a linguistic or religious minority"
          selected={data.minority === "Belongs to Minority Category"}
          onSelect={() =>
            onChange({ ...data, minority: "Belongs to Minority Category" })
          }
        />
        <ChoiceCard
          name="minority"
          title="Does Not Belong"
          description="Not applying under minority quota"
          selected={data.minority === "Does Not Belong"}
          onSelect={() => onChange({ ...data, minority: "Does Not Belong" })}
        />
      </div>
      {data.minority === "Belongs to Minority Category" && (
        <div className="app-form-field-grid">
          <TextField
            className="ux4g-field--tight"
            label="Linguistic Minority"
            value={data.linguisticMinority}
            onChange={(e) =>
              onChange({ ...data, linguisticMinority: e.target.value })
            }
          />
          <TextField
            className="ux4g-field--tight"
            label="Religious Minority"
            value={data.religiousMinority}
            onChange={(e) =>
              onChange({ ...data, religiousMinority: e.target.value })
            }
          />
        </div>
      )}

      <h2 className="app-form-section-title">Admission for Inhouse Quota</h2>
      <div className="app-form-choice-grid">
        <ChoiceCard
          name="inhouse"
          title="Yes, apply through Inhouse Quota"
          description="Applicant wants to be considered for the school's inhouse quota"
          selected={data.inhouse === "Yes, apply through Inhouse Quota"}
          onSelect={() =>
            onChange({ ...data, inhouse: "Yes, apply through Inhouse Quota" })
          }
        />
        <ChoiceCard
          name="inhouse"
          title="No"
          description="Skip inhouse quota consideration"
          selected={data.inhouse === "No"}
          onSelect={() => onChange({ ...data, inhouse: "No" })}
        />
      </div>
    </div>
  );
}

function QualificationStep({
  passingStatus,
  setPassingStatus,
  passedEnglish,
  setPassedEnglish,
  passedScience,
  setPassedScience,
  marks,
  updateMark,
  totalMarks,
  totalOutOf,
  meritOn500,
}: {
  passingStatus: string;
  setPassingStatus: (v: string) => void;
  passedEnglish: string;
  setPassedEnglish: (v: string) => void;
  passedScience: string;
  setPassedScience: (v: string) => void;
  marks: SubjectMark[];
  updateMark: (index: number, field: keyof SubjectMark, value: string) => void;
  totalMarks: number;
  totalOutOf: number;
  meritOn500: string;
}) {
  return (
    <div className="app-form-section">
      <p className="app-form-step-sub">
        10th Standard marks are used to compute the applicant's merit score out
        of 500.
      </p>

      <div className="app-form-field-grid app-form-field-grid--cols-3">
        <SelectField
          className="ux4g-field--tight"
          label="Passing Status"
          required
          options={["PASS", "FAIL"]}
          value={passingStatus}
          onChange={(e) => setPassingStatus(e.target.value)}
        />
        <SelectField
          className="ux4g-field--tight"
          label="Passed in English Subject?"
          required
          options={["Yes", "No"]}
          value={passedEnglish}
          onChange={(e) => setPassedEnglish(e.target.value)}
        />
        <SelectField
          className="ux4g-field--tight"
          label="Passed in Science Subject?"
          required
          options={["Yes", "No"]}
          value={passedScience}
          onChange={(e) => setPassedScience(e.target.value)}
        />
      </div>

      <h2 className="app-form-section-title">Subject-wise Marks</h2>
      <div className="app-form-table-wrap">
        <table className="app-form-table">
          <thead>
            <tr>
              <th>Language / Subject</th>
              <th>Subject Name</th>
              <th>Marks</th>
              <th>Out Of</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((row, index) => (
              <tr key={row.subject}>
                <td>{row.subject}</td>
                <td>
                  <input
                    className="app-form-table-input"
                    value={row.name}
                    onChange={(e) => updateMark(index, "name", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="app-form-table-input"
                    inputMode="numeric"
                    value={row.marks}
                    onChange={(e) => updateMark(index, "marks", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="app-form-table-input"
                    inputMode="numeric"
                    value={row.outOf}
                    onChange={(e) => updateMark(index, "outOf", e.target.value)}
                  />
                </td>
              </tr>
            ))}
            <tr className="app-form-table-total">
              <td colSpan={2}>Total</td>
              <td>{totalMarks}</td>
              <td>{totalOutOf}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="app-form-merit-banner">
        <div>
          <p className="app-form-merit-label">
            Merit Marks (Converted Out Of 500)
          </p>
          <p className="app-form-merit-value">{meritOn500}</p>
        </div>
        <span className="app-form-status">
          <span className="app-form-status-dot" />
          Auto-calculated
        </span>
      </div>
    </div>
  );
}

function DocumentsStep({
  documents,
  onFileChosen,
}: {
  documents: DocumentRow[];
  onFileChosen: (index: number, fileName: string | undefined) => void;
}) {
  return (
    <div className="app-form-section">
      <p className="app-form-step-sub">
        File types allowed: JPG, JPEG, PNG, PDF &middot; Maximum file size: 1MB
      </p>
      <div className="app-form-doc-list">
        {documents.map((doc, index) => (
          <div className="app-form-doc-row" key={doc.name}>
            <span className="app-form-doc-num">{index + 1}</span>
            <span className="app-form-doc-name">
              {doc.name}
              {doc.required && <span className="app-form-req"> *</span>}
            </span>
            <label className="app-form-doc-drop">
              <span aria-hidden="true">📎</span>{" "}
              {doc.fileName ?? "Choose file to upload"}
              <input
                type="file"
                className="app-form-doc-file-input"
                onChange={(e) => onFileChosen(index, e.target.files?.[0]?.name)}
              />
            </label>
            <span
              className={`app-form-doc-status ${doc.fileName ? "app-form-doc-status--yes" : ""}`}
            >
              {doc.fileName ? "✓ Uploaded" : "Not uploaded"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentStep() {
  return (
    <div className="app-form-section">
      <p className="app-form-step-sub">
        A one-time admission processing fee confirms your Part-I application.
      </p>

      <div className="app-form-pay-summary">
        <div className="app-form-pay-cell">
          <p className="app-form-pay-key">Amount</p>
          <p className="app-form-pay-value app-form-pay-value--big">
            &#8377;100
          </p>
        </div>
        <div className="app-form-pay-cell">
          <p className="app-form-pay-key">Status</p>
          <p className="app-form-pay-value app-form-pay-value--success">
            SUCCESS
          </p>
        </div>
        <div className="app-form-pay-cell">
          <p className="app-form-pay-key">Payment Mode</p>
          <p className="app-form-pay-value">UPI</p>
        </div>
        <div className="app-form-pay-cell">
          <p className="app-form-pay-key">Payment Date</p>
          <p className="app-form-pay-value app-form-pay-value--small">
            09/04/2026 18:36:16
          </p>
        </div>
      </div>

      <h2 className="app-form-section-title">Transaction Details</h2>
      <div className="app-form-field-grid">
        <TextField
          className="ux4g-field--tight"
          label="Transaction Reference Number"
          value="07b8ff9f-9a7b-41dc-a893-eeab702f50f4"
          disabled
        />
        <TextField
          className="ux4g-field--tight"
          label="Payment Done By"
          value="FYJC2026-00842"
          disabled
        />
      </div>

      <div className="app-form-callout">
        <InfoIcon />
        <span>
          Any extra amount paid or deducted due to a duplicate or failed payment
          is auto-refunded to the source account.
        </span>
      </div>
    </div>
  );
}

function LockStep({
  applicantName,
  board,
  category,
  merit,
  documentsUploaded,
  locked,
}: {
  applicantName: string;
  board: string;
  category: string;
  merit: string;
  documentsUploaded: number;
  locked: boolean;
}) {
  return (
    <div className="app-form-section">
      <p className="app-form-step-sub">
        Review every section below, then lock your application to submit it.
      </p>

      <div className="app-form-lock-hero">
        <div className="app-form-lock-seal" aria-hidden="true">
          🔒
        </div>
        <h2>
          {locked
            ? "Application FYJC2026-00842 is locked"
            : "Ready to lock Application FYJC2026-00842"}
        </h2>
        <p>
          Once locked, Part-I details cannot be edited until the next round
          begins.
        </p>
      </div>

      <h2 className="app-form-section-title">Applicant Summary</h2>
      <div className="app-form-summary-grid">
        <SummaryRow label="Full Name" value={applicantName} />
        <SummaryRow label="Board" value={board} />
        <SummaryRow label="Category" value={category} />
        <SummaryRow label="Merit Marks" value={`${merit} / 500`} />
        <SummaryRow
          label="Documents Uploaded"
          value={`${documentsUploaded} of 4`}
        />
        <SummaryRow label="Fee Status" value="Paid — ₹100" success />
      </div>

      <div className="app-form-callout">
        <InfoIcon />
        <span>Locking is final for this admission round.</span>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  success,
}: {
  label: string;
  value: string;
  success?: boolean;
}) {
  return (
    <div className="app-form-summary-row">
      <span className="app-form-summary-key">{label}</span>
      <span
        className={`app-form-summary-value ${success ? "app-form-summary-value--success" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function StepCheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
