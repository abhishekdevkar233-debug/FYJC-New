import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "../../components/ui/TextField";
import { SelectField } from "../../components/ui/SelectField";
import { ChoiceCard } from "../../components/ui/ChoiceCard";
import { Button } from "../../components/ui/Button";
import { Toast } from "../../components/ui/Toast";
import { APPLICATION_STEPS, PAYMENT_AMOUNT } from "../../lib/applicationDraft";
import { useApplicationForm } from "../../context/ApplicationFormContext";
import type {
  RegistrationData,
  PersonalData,
  CategoryData,
  SubjectMark,
  DocumentRow,
  PaymentData,
} from "../../context/ApplicationFormContext";
import "./ApplicationFormPage.css";

const STEPS = APPLICATION_STEPS;

// Shorter labels for the stepper tabs so all steps fit on one line;
// the full descriptive name still shows as the step's heading.
const STEP_TAB_LABELS = [
  "Details",
  "Category & Reservation",
  "Qualification",
  "Documents",
  "Admission Fee",
  "Lock Application",
];

const BOARD_OPTIONS = [
  "SSC",
  "CBSE",
  "CISCE / ICSE",
  "IB",
  "IGCSE",
  "NIOS",
  "Any Other Board",
];

export function ApplicationFormPage() {
  const navigate = useNavigate();
  const {
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
  } = useApplicationForm();
  const [toastVisible, setToastVisible] = useState(false);

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

  function handleFileChosen(index: number, file: File | undefined) {
    if (!file) return;
    const sizeKb = Math.max(1, Math.round(file.size / 1024));
    const uploadedAt = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setDocuments((prev) =>
      prev.map((doc, i) =>
        i === index
          ? {
              ...doc,
              fileName: file.name,
              fileSize: `${sizeKb} KB`,
              uploadedAt,
            }
          : doc,
      ),
    );
  }

  function handleFileRemoved(index: number) {
    setDocuments((prev) =>
      prev.map((doc, i) =>
        i === index
          ? { ...doc, fileName: null, fileSize: null, uploadedAt: null }
          : doc,
      ),
    );
  }

  const footerContent = (
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
        ) : current === 4 && payment.status === "success" ? (
          <>
            <Button
              variant="secondary"
              type="button"
              onClick={() => window.print()}
            >
              Print Receipt
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => window.print()}
            >
              Download Receipt
            </Button>
            <Button onClick={handleNext}>Next &rarr;</Button>
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              type="button"
              onClick={handleSaveDraft}
            >
              Save Draft
            </Button>
            <Button
              onClick={handleNext}
              disabled={current === 4 && payment.status !== "success"}
            >
              Next &rarr;
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="app-form-page">
      <div className="app-form-stepper-wrap">
        <ol className="app-form-stepper">
          {STEPS.map((fullLabel, index) => {
            const tabLabel = STEP_TAB_LABELS[index];
            const isDone =
              completed.has(index) || (locked && index === STEPS.length - 1);
            const isCurrent = index === current;
            const isLast = index === STEPS.length - 1;
            return (
              <li
                key={fullLabel}
                className={`app-form-step-item ${!isLast ? "app-form-step-item--grow" : ""}`}
              >
                {isDone ? (
                  <span
                    className="app-form-step-trigger app-form-step-trigger--done"
                    aria-label={`${fullLabel} (completed, read only)`}
                  >
                    <span className="app-form-step-badge app-form-step-badge--done">
                      <StepCheckIcon />
                    </span>
                    <span className="app-form-step-text">
                      <span className="app-form-step-title">{tabLabel}</span>
                    </span>
                  </span>
                ) : (
                  <button
                    type="button"
                    className={`app-form-step-trigger ${isCurrent ? "app-form-step-trigger--current" : ""}`}
                    onClick={() => goTo(index)}
                    aria-current={isCurrent ? "step" : undefined}
                    aria-label={fullLabel}
                  >
                    <span
                      className={`app-form-step-badge ${isCurrent ? "app-form-step-badge--current" : ""}`}
                    >
                      {index + 1}
                    </span>
                    <span className="app-form-step-text">
                      <span className="app-form-step-title">{tabLabel}</span>
                    </span>
                  </button>
                )}
                {!isLast && (
                  <span
                    className={`app-form-step-separator ${isDone ? "app-form-step-separator--done" : ""}`}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="app-form-shell">
        {current === 0 ? (
          <div className="app-form-numbered-stack">
            <NumberedFormCard
              number={1}
              title="Registration Details"
              description="Enter the applicant's 10th standard board details to begin the admission process."
            >
              <RegistrationStep data={registration} onChange={setRegistration} />
            </NumberedFormCard>

            <NumberedFormCard
              number={2}
              title="Personal & Address Details"
              description="Confirm the applicant's identity, school information, and contact details."
            >
              <PersonalStep data={personal} onChange={setPersonal} />
            </NumberedFormCard>

            <div className="app-form-card app-form-footer-card">
              {footerContent}
            </div>
          </div>
        ) : (
          <div className="app-form-card">
            {current !== 3 && (
              <div className="app-form-card-head">
                <h1>{STEPS[current]}</h1>
                <span className="app-form-step-count">
                  STEP {String(current + 1).padStart(2, "0")} / {STEPS.length}
                </span>
              </div>
            )}

            {current === 1 && (
              <CategoryStep data={category} onChange={setCategory} />
            )}
            {current === 2 && (
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
            {current === 3 && (
              <DocumentsStep
                documents={documents}
                onFileChosen={handleFileChosen}
                onFileRemoved={handleFileRemoved}
                stepNumber={current + 1}
                totalSteps={STEPS.length}
              />
            )}
            {current === 4 && (
              <PaymentStep
                payment={payment}
                registration={registration}
                personal={personal}
                onPayNow={() => navigate("/payment-gateway")}
              />
            )}
            {current === 5 && (
              <LockStep
                registration={registration}
                personal={personal}
                category={category}
                marks={marks}
                totalMarks={totalMarks}
                totalOutOf={totalOutOf}
                meritOn500={meritOn500}
                passingStatus={passingStatus}
                passedEnglish={passedEnglish}
                passedScience={passedScience}
                documents={documents}
                payment={payment}
                locked={locked}
              />
            )}

            {footerContent}
          </div>
        )}

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

function NumberedFormCard({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="app-form-card app-form-numbered-card">
      <div className="app-form-numbered-head">
        <h2 className="app-form-numbered-title">
          {number}. {title}
        </h2>
        <p className="app-form-numbered-desc">{description}</p>
      </div>
      {children}
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
      <div className="app-form-subsection">
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
      </div>

      <div className="app-form-subsection">
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
      </div>

      <div className="app-form-subsection">
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
      </div>

      <div className="app-form-subsection">
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
            If the applicant has no mobile number or e-mail, use a parent's
            or relative's details so admission updates reach someone
            reliably.
          </span>
        </div>
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

      <h2 className="app-form-section-title">
        Other / Special Reservation Details
      </h2>
      <div className="app-form-yesno-list">
        <YesNoField
          letter="A"
          name="handicapped"
          label="Does Applicant belong to Handicapped (Divyang) / Hearing Disability Category?"
          value={data.handicapped}
          onChange={(v) => onChange({ ...data, handicapped: v })}
        />
        <YesNoField
          letter="B"
          name="earthquakeOrProjectAffected"
          label="Does Applicant belong to Earthquake or Project Affected?"
          value={data.earthquakeOrProjectAffected}
          onChange={(v) =>
            onChange({ ...data, earthquakeOrProjectAffected: v })
          }
        />
        <YesNoField
          letter="C"
          name="parentTransferred"
          label="Has Applicant's Parent been Transferred to Online Process Area?"
          value={data.parentTransferred}
          onChange={(v) => onChange({ ...data, parentTransferred: v })}
        />
        <YesNoField
          letter="D"
          name="grandparentsFreedomFighter"
          label="Whether Applicant's Grandparents Freedom Fighters?"
          value={data.grandparentsFreedomFighter}
          onChange={(v) =>
            onChange({ ...data, grandparentsFreedomFighter: v })
          }
        />
        <YesNoField
          letter="E"
          name="parentDefenceServiceman"
          label="Does Applicant's Parent(s) belong to Defence Serviceman / Ex-Serviceman Category?"
          value={data.parentDefenceServiceman}
          onChange={(v) => onChange({ ...data, parentDefenceServiceman: v })}
        />
        <YesNoField
          letter="F"
          name="sportsCategory"
          label="Does Applicant belong to Sports Category?"
          value={data.sportsCategory}
          onChange={(v) => onChange({ ...data, sportsCategory: v })}
        />
        <YesNoField
          letter="G"
          name="orphanQuota"
          label="If you are falling under category of orphan as per the provisions in GR dated 2nd April 2018, would you like to apply for 1% quota?"
          value={data.orphanQuota}
          onChange={(v) => onChange({ ...data, orphanQuota: v })}
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

function YesNoField({
  letter,
  name,
  label,
  value,
  onChange,
}: {
  letter: string;
  name: string;
  label: string;
  value: "Yes" | "No";
  onChange: (value: "Yes" | "No") => void;
}) {
  return (
    <div className="app-form-yesno-row">
      <p className="app-form-yesno-label">
        <span className="app-form-yesno-letter">{letter}.</span> {label}
        <span className="app-form-required">*</span>
      </p>
      <div className="app-form-yesno-options">
        <label className="app-form-yesno-option">
          <input
            type="radio"
            name={name}
            checked={value === "Yes"}
            onChange={() => onChange("Yes")}
          />
          Yes
        </label>
        <label className="app-form-yesno-option">
          <input
            type="radio"
            name={name}
            checked={value === "No"}
            onChange={() => onChange("No")}
          />
          No
        </label>
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
      </div>
    </div>
  );
}

function DocumentsStep({
  documents,
  onFileChosen,
  onFileRemoved,
  stepNumber,
  totalSteps,
}: {
  documents: DocumentRow[];
  onFileChosen: (index: number, file: File | undefined) => void;
  onFileRemoved: (index: number) => void;
  stepNumber: number;
  totalSteps: number;
}) {
  return (
    <div className="app-form-section app-form-section--docs">
      <div className="app-form-doc-head">
        <div className="app-form-doc-head-icon" aria-hidden="true">
          <DocFileIcon />
        </div>
        <div className="app-form-doc-head-text">
          <h2>Upload Documents</h2>
          <p>Upload all the required documents. Ensure all files are clear and valid.</p>
        </div>
        <span className="app-form-doc-step-badge">
          Step {stepNumber} of {totalSteps}
        </span>
      </div>

      <div className="app-form-callout app-form-callout--docs">
        <InfoIcon />
        <span>
          File types allowed: JPG, JPEG, PNG, PDF &nbsp;&bull;&nbsp; Maximum
          file size: 1MB per file
        </span>
      </div>

      <div className="app-form-doc-table">
        <div className="app-form-doc-table-head" aria-hidden="true">
          <span>Sr. No.</span>
          <span>Document Name</span>
          <span>Upload File</span>
          <span>Status</span>
        </div>
        <div className="app-form-doc-list">
          {documents.map((doc, index) => (
            <div className="app-form-doc-row" key={doc.name}>
              <span className="app-form-doc-num">{index + 1}</span>

              <span className="app-form-doc-name-wrap">
                <span className="app-form-doc-name">
                  {doc.name}
                  {doc.required && (
                    <span className="app-form-required"> *</span>
                  )}
                </span>
                {doc.required && (
                  <span className="app-form-doc-required-tag">Required</span>
                )}
              </span>

              {doc.fileName ? (
                <div className="app-form-doc-file-card">
                  <span className="app-form-doc-file-icon" aria-hidden="true">
                    <PdfIcon />
                  </span>
                  <span className="app-form-doc-file-meta">
                    <span className="app-form-doc-file-name">
                      {doc.fileName}
                    </span>
                    <span className="app-form-doc-file-size">
                      {doc.fileSize}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="app-form-doc-file-remove"
                    aria-label={`Remove ${doc.fileName}`}
                    onClick={() => onFileRemoved(index)}
                  >
                    <CloseIcon />
                  </button>
                </div>
              ) : (
                <label className="app-form-doc-drop">
                  <span className="app-form-doc-drop-icon" aria-hidden="true">
                    <UploadIcon />
                  </span>
                  <span className="app-form-doc-drop-text">
                    <span className="app-form-doc-drop-title">
                      Choose file to upload
                    </span>
                    <span className="app-form-doc-drop-hint">
                      JPG, JPEG, PNG or PDF (Max. 1MB)
                    </span>
                  </span>
                  <input
                    type="file"
                    className="app-form-doc-file-input"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) =>
                      onFileChosen(index, e.target.files?.[0])
                    }
                  />
                </label>
              )}

              <span
                className={`app-form-doc-status ${doc.fileName ? "app-form-doc-status--yes" : ""}`}
              >
                <span className="app-form-doc-status-icon" aria-hidden="true">
                  {doc.fileName ? <StatusCheckIcon /> : <StatusDashIcon />}
                </span>
                <span className="app-form-doc-status-text">
                  <span className="app-form-doc-status-label">
                    {doc.fileName ? "Uploaded" : "Not uploaded"}
                  </span>
                  {doc.fileName && doc.uploadedAt && (
                    <span className="app-form-doc-status-date">
                      {doc.uploadedAt}
                    </span>
                  )}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DocFileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
      <path d="M14 2v5h5" strokeLinejoin="round" />
      <path d="M8.5 12.5h7M8.5 16h7M8.5 9h3" strokeLinecap="round" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg width="22" height="26" viewBox="0 0 24 28" fill="none">
      <path
        d="M3 2h12l6 6v18a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
        fill="var(--color-error)"
      />
      <path d="M15 2v6h6" fill="rgba(255,255,255,0.35)" />
      <text
        x="12"
        y="19"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill="#ffffff"
        fontFamily="var(--font-family-base, sans-serif)"
      >
        PDF
      </text>
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 15V4M12 4 8 8M12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M5 5l14 14M19 5 5 19" strokeLinecap="round" />
    </svg>
  );
}

function StatusCheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12.5l2.5 2.5L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatusDashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="11" width="14" height="9" rx="2" strokeLinejoin="round" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M6 3h3l1.5 4L8.5 8.5a12 12 0 0 0 6 6l1.5-2L20 14v3a2 2 0 0 1-2 2A15 15 0 0 1 4 5a2 2 0 0 1 2-2Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

function MarksIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19V9M10 19V5M16 19v-7M20 19H4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <path d="M2.5 10h19" />
      <path d="M6 14.5h4" strokeLinecap="round" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 9V3h12v6" strokeLinejoin="round" />
      <rect x="4" y="9" width="16" height="8" rx="1.5" />
      <path d="M6 14h12v7H6z" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v12M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" strokeLinecap="round" />
    </svg>
  );
}

function PaymentStep({
  payment,
  registration,
  personal,
  onPayNow,
}: {
  payment: PaymentData;
  registration: RegistrationData;
  personal: PersonalData;
  onPayNow: () => void;
}) {
  const applicationNo = "CDSC00002859";

  if (payment.status === "success") {
    return (
      <div className="app-form-section app-form-section--receipt">
        <ReviewSection
          title="Applicant's Personal Information"
          icon={<PersonIcon />}
        >
          <div className="app-form-receipt-banner">
            Application Form No: {applicationNo}
          </div>

          <div className="app-form-summary-grid">
            <SummaryRow label="Name of the Applicant" value={personal.fullName} />
            <SummaryRow label="Seat Number" value={registration.seatNumber} />
            <SummaryRow
              label="Month &amp; Year of Examination"
              value={`${registration.month} ${registration.year}`}
            />
            <SummaryRow label="Board" value={registration.board} />
          </div>

          <div className="app-form-receipt-success">
            <StatusCheckIcon />
            <span>Your Registration Fee is Paid</span>
          </div>
        </ReviewSection>

        <ReviewSection title="Payment Details" icon={<PaymentIcon />}>
          <div className="app-form-summary-grid">
            <SummaryRow
              label="Amount Paid"
              value={`₹${PAYMENT_AMOUNT}`}
              success
            />
            <SummaryRow label="Payment Mode" value={payment.mode || "—"} />
            <SummaryRow label="Payment Date" value={payment.date || "—"} />
            <SummaryRow
              label="Transaction Reference Number"
              value={payment.transactionRef || "—"}
            />
          </div>
        </ReviewSection>

        <div className="app-form-callout">
          <InfoIcon />
          <span>
            Any extra amount paid or deducted due to a duplicate or failed
            payment is auto-refunded to the source account.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-form-section">
      <p className="app-form-step-sub">
        A one-time admission processing fee confirms your Part-I application.
      </p>

      {payment.status === "failed" && (
        <div className="app-form-pay-failed">
          <span>
            Your last payment attempt failed. No amount was deducted. Please try
            again.
          </span>
        </div>
      )}

      <div className="app-form-pay-pending">
        <div>
          <p className="app-form-pay-key">Amount Payable</p>
          <p className="app-form-pay-value app-form-pay-value--big">
            &#8377;{PAYMENT_AMOUNT}
          </p>
        </div>
        <Button onClick={onPayNow}>Pay Now</Button>
      </div>

      <div className="app-form-callout">
        <InfoIcon />
        <span>
          You will be redirected to a secure payment gateway to complete this
          transaction.
        </span>
      </div>
    </div>
  );
}

const YES_NO_FLAG_LABELS: { key: keyof CategoryData; label: string }[] = [
  { key: "handicapped", label: "Handicapped / Hearing Disability" },
  {
    key: "earthquakeOrProjectAffected",
    label: "Earthquake / Project Affected",
  },
  { key: "parentTransferred", label: "Parent Transferred to Process Area" },
  {
    key: "grandparentsFreedomFighter",
    label: "Grandparents Freedom Fighter",
  },
  {
    key: "parentDefenceServiceman",
    label: "Defence Serviceman / Ex-Serviceman",
  },
  { key: "sportsCategory", label: "Sports Category" },
  { key: "orphanQuota", label: "Orphan Quota (1%)" },
];

function LockStep({
  registration,
  personal,
  category,
  marks,
  totalMarks,
  totalOutOf,
  meritOn500,
  passingStatus,
  passedEnglish,
  passedScience,
  documents,
  payment,
  locked,
}: {
  registration: RegistrationData;
  personal: PersonalData;
  category: CategoryData;
  marks: SubjectMark[];
  totalMarks: number;
  totalOutOf: number;
  meritOn500: string;
  passingStatus: string;
  passedEnglish: string;
  passedScience: string;
  documents: DocumentRow[];
  payment: PaymentData;
  locked: boolean;
}) {
  const applicationNo = "CDSC00002859";
  const documentsUploaded = documents.filter((d) => d.fileName).length;
  const activeFlags = YES_NO_FLAG_LABELS.filter(
    (flag) => category[flag.key] === "Yes",
  );

  function handlePrint() {
    window.print();
  }

  return (
    <div className="app-form-section app-form-section--review">
      <div className="app-form-review-toolbar">
        <p className="app-form-step-sub app-form-review-toolbar-note">
          Review every section below, then lock your application to submit
          it.
        </p>
        <div className="app-form-review-toolbar-actions">
          <Button variant="secondary" type="button" onClick={handlePrint}>
            <PrintIcon /> Print
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={handlePrint}
            title="Choose 'Save as PDF' in the print dialog to download"
          >
            <DownloadIcon /> Download as PDF
          </Button>
        </div>
      </div>

      <div
        className={`app-form-lock-hero ${locked ? "app-form-lock-hero--locked" : ""}`}
      >
        <div className="app-form-lock-seal" aria-hidden="true">
          <LockIcon />
        </div>
        <h2>
          {locked
            ? `Application ${applicationNo} is locked`
            : `Ready to lock Application ${applicationNo}`}
        </h2>
        <p>
          Once locked, Part-I details cannot be edited until the next round
          begins.
        </p>
      </div>

      <ReviewSection title="Applicant Details" icon={<PersonIcon />}>
        <div className="app-form-summary-grid">
          <SummaryRow label="Full Name" value={personal.fullName} />
          <SummaryRow label="Gender" value={personal.gender} />
          <SummaryRow label="Board" value={registration.board} />
          <SummaryRow label="Seat Number" value={registration.seatNumber} />
          <SummaryRow
            label="Month &amp; Year of Examination"
            value={`${registration.month} ${registration.year}`}
          />
          <SummaryRow label="Applicant Status" value={registration.status} />
          <SummaryRow label="10th School Name" value={personal.schoolName} />
          <SummaryRow label="10th School UDISE Number" value={personal.udise} />
          <SummaryRow
            label="10th School Index Number"
            value={personal.indexNumber || "—"}
          />
          <SummaryRow label="School Area" value={registration.schoolArea} />
        </div>
      </ReviewSection>

      <ReviewSection title="Contact Details" icon={<PhoneIcon />}>
        <div className="app-form-summary-grid">
          <SummaryRow
            label="Correspondence Address"
            value={personal.address}
          />
          <SummaryRow label="City" value={personal.city} />
          <SummaryRow label="District" value={personal.district} />
          <SummaryRow label="Taluka / Area" value={personal.area} />
          <SummaryRow label="State" value={personal.state} />
          <SummaryRow label="PIN Code" value={personal.pin} />
          <SummaryRow label="Mobile Number" value={personal.mobile1} />
          <SummaryRow
            label="Alternate Mobile"
            value={personal.mobile2 || "—"}
          />
          <SummaryRow label="Landline" value={personal.landline || "—"} />
          <SummaryRow label="E-Mail ID" value={personal.email || "—"} />
        </div>
      </ReviewSection>

      <ReviewSection title="Category &amp; Reservation" icon={<CategoryIcon />}>
        <div className="app-form-summary-grid">
          <SummaryRow
            label="Original Category"
            value={category.originalCategory}
          />
          <SummaryRow
            label="Category for Admission"
            value={category.admissionCategory}
          />
          <SummaryRow label="Minority Quota" value={category.minority} />
          <SummaryRow
            label="Inhouse Quota"
            value={
              category.inhouse === "Yes, apply through Inhouse Quota"
                ? "Yes"
                : "No"
            }
          />
          {category.minority === "Belongs to Minority Category" && (
            <>
              <SummaryRow
                label="Linguistic Minority"
                value={category.linguisticMinority || "—"}
              />
              <SummaryRow
                label="Religious Minority"
                value={category.religiousMinority || "—"}
              />
            </>
          )}
        </div>

        <p className="app-form-review-subhead">Special Reservation Claims</p>
        {activeFlags.length > 0 ? (
          <div className="app-form-review-tags">
            {activeFlags.map((flag) => (
              <span className="app-form-review-tag" key={flag.key}>
                <StepCheckIcon /> {flag.label}
              </span>
            ))}
          </div>
        ) : (
          <p className="app-form-review-empty">
            No special reservation claimed.
          </p>
        )}
      </ReviewSection>

      <ReviewSection title="Qualification" icon={<MarksIcon />}>
        <div className="app-form-summary-grid">
          <SummaryRow label="Passing Status" value={passingStatus} />
          <SummaryRow
            label="Passed in English Subject"
            value={passedEnglish}
          />
          <SummaryRow
            label="Passed in Science Subject"
            value={passedScience}
          />
          <SummaryRow
            label="Merit Marks"
            value={`${meritOn500} / 500`}
            success
          />
        </div>

        <div className="app-form-table-wrap app-form-review-table-wrap">
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
              {marks.map((row) => (
                <tr key={row.subject}>
                  <td>{row.subject}</td>
                  <td>{row.name}</td>
                  <td>{row.marks}</td>
                  <td>{row.outOf}</td>
                </tr>
              ))}
              <tr className="app-form-review-total-row">
                <td colSpan={2}>Total</td>
                <td>{totalMarks}</td>
                <td>{totalOutOf}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ReviewSection>

      <ReviewSection title="Documents" icon={<DocFileIcon />}>
        <div className="app-form-review-doc-list">
          {documents.map((doc, index) => (
            <div className="app-form-review-doc-row" key={doc.name}>
              <span className="app-form-doc-num">{index + 1}</span>
              <span className="app-form-review-doc-name">{doc.name}</span>
              <span
                className={`app-form-doc-status ${doc.fileName ? "app-form-doc-status--yes" : ""}`}
              >
                <span className="app-form-doc-status-icon" aria-hidden="true">
                  {doc.fileName ? <StatusCheckIcon /> : <StatusDashIcon />}
                </span>
                <span className="app-form-doc-status-text">
                  <span className="app-form-doc-status-label">
                    {doc.fileName ? doc.fileName : "Not uploaded"}
                  </span>
                  {doc.fileName && doc.uploadedAt && (
                    <span className="app-form-doc-status-date">
                      {doc.uploadedAt}
                    </span>
                  )}
                </span>
              </span>
            </div>
          ))}
        </div>
      </ReviewSection>

      <ReviewSection title="Admission Fee" icon={<PaymentIcon />}>
        <div className="app-form-summary-grid">
          <SummaryRow
            label="Amount"
            value={`₹${PAYMENT_AMOUNT}`}
          />
          <SummaryRow
            label="Status"
            value={payment.status === "success" ? "Paid" : "Not Paid"}
            success={payment.status === "success"}
          />
          <SummaryRow label="Payment Mode" value={payment.mode || "—"} />
          <SummaryRow label="Payment Date" value={payment.date || "—"} />
          <SummaryRow
            label="Transaction Reference Number"
            value={payment.transactionRef || "—"}
          />
        </div>
      </ReviewSection>

      <div className="app-form-callout app-form-callout--declaration">
        <InfoIcon />
        <span>
          I hereby declare that the information provided above is true to the
          best of my knowledge. Locking is final for this admission round —
          Part-I details cannot be edited until the next round begins.
        </span>
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="app-form-review-section">
      <h2 className="app-form-review-section-title">
        <span className="app-form-review-section-icon" aria-hidden="true">
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </section>
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
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
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
