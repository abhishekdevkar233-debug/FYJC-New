import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "../../components/ui/TextField";
import { SelectField } from "../../components/ui/SelectField";
import { ChoiceCard } from "../../components/ui/ChoiceCard";
import { Button } from "../../components/ui/Button";
import { Toast } from "../../components/ui/Toast";
import { useCapOption, MAX_PREFERENCES } from "../../context/CapOptionContext";
import {
  JUNIOR_COLLEGES,
  STREAM_OPTIONS,
  MEDIUM_OPTIONS,
  DISTRICT_OPTIONS,
} from "../../data/juniorColleges";
import type { JuniorCollege } from "../../data/juniorColleges";
import "../ApplicationForm/ApplicationFormPage.css";
import "./CapOptionPage.css";

const STEPS = ["Choose Stream, Medium & Colleges", "Rank Your Preferences", "Review & Lock"];

export function CapOptionPage() {
  const navigate = useNavigate();
  const {
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
  } = useCapOption();
  const [toastVisible, setToastVisible] = useState(false);

  function goTo(index: number) {
    if (locked) return;
    setCurrent(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNext() {
    setCompleted((prev) => new Set(prev).add(current));
    if (current < STEPS.length - 1) goTo(current + 1);
  }

  function handlePrev() {
    if (current > 0) goTo(current - 1);
  }

  function showToast(message: string) {
    setToastVisible(false);
    window.setTimeout(() => setToastVisible(true), 10);
    window.setTimeout(() => setToastVisible(false), 3000);
    void message;
  }

  const nextDisabled =
    (current === 0 && preferences.length === 0) ||
    (current === 1 && preferences.length === 0);

  return (
    <div className="app-form-page cap-page">
      <div className="app-form-topbar">
        <div>
          CAP Option (Part II) &mdash; Junior College Preferences
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
          {STEPS.map((label, index) => {
            const isDone = locked || completed.has(index);
            const isCurrent = index === current;
            const isLast = index === STEPS.length - 1;
            return (
              <li
                key={label}
                className={`app-form-step-item ${!isLast ? "app-form-step-item--grow" : ""}`}
              >
                {isDone && !isCurrent ? (
                  <span
                    className="app-form-step-trigger app-form-step-trigger--done"
                    aria-label={`${label} (completed)`}
                  >
                    <span className="app-form-step-badge app-form-step-badge--done">
                      <StepCheckIcon />
                    </span>
                    <span className="app-form-step-text">
                      <span className="app-form-step-title">{label}</span>
                    </span>
                  </span>
                ) : (
                  <button
                    type="button"
                    className={`app-form-step-trigger ${isCurrent ? "app-form-step-trigger--current" : ""}`}
                    onClick={() => goTo(index)}
                    disabled={locked}
                    aria-current={isCurrent ? "step" : undefined}
                    aria-label={label}
                  >
                    <span
                      className={`app-form-step-badge ${isCurrent ? "app-form-step-badge--current" : ""}`}
                    >
                      {index + 1}
                    </span>
                    <span className="app-form-step-text">
                      <span className="app-form-step-title">{label}</span>
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
        <div className="app-form-card">
          <div className="app-form-card-head">
            <h1>{STEPS[current]}</h1>
            <span className="app-form-step-count">
              STEP {String(current + 1).padStart(2, "0")} / {STEPS.length}
            </span>
          </div>

          {current === 0 && (
            <SelectStep
              stream={stream}
              setStream={setStream}
              medium={medium}
              setMedium={setMedium}
              preferences={preferences}
              addCollege={addCollege}
              onGoToRank={() => goTo(1)}
            />
          )}
          {current === 1 && (
            <RankStep
              preferences={preferences}
              removeCollege={removeCollege}
              reorder={reorder}
              moveUp={moveUp}
              moveDown={moveDown}
              onAddMore={() => goTo(0)}
            />
          )}
          {current === 2 && (
            <ReviewStep
              stream={stream}
              medium={medium}
              preferences={preferences}
              locked={locked}
              onLock={() => {
                lockPreferences();
                showToast("Preferences locked successfully");
              }}
              onEditColleges={() => goTo(0)}
              onEditOrder={() => goTo(1)}
            />
          )}

          {!locked && (
            <div className="app-form-footer">
              <Button
                variant="secondary"
                onClick={handlePrev}
                disabled={current === 0}
              >
                &larr; Previous
              </Button>
              <div className="app-form-footer-right">
                {current < STEPS.length - 1 && (
                  <Button onClick={handleNext} disabled={nextDisabled}>
                    Next &rarr;
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {locked && (
          <div className="app-form-locked-note">
            Your Part-II college preferences are locked. Return to the{" "}
            <button
              type="button"
              className="app-form-inline-link"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>{" "}
            to track your CAP admission status.
          </div>
        )}
      </div>

      <Toast message="Preferences locked successfully" visible={toastVisible} />
    </div>
  );
}

/* ---------------- Step 1: Stream, Medium & College search/select ---------------- */

function SelectStep({
  stream,
  setStream,
  medium,
  setMedium,
  preferences,
  addCollege,
  onGoToRank,
}: {
  stream: string;
  setStream: (v: string) => void;
  medium: string;
  setMedium: (v: string) => void;
  preferences: JuniorCollege[];
  addCollege: (college: JuniorCollege) => void;
  onGoToRank: () => void;
}) {
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("All Districts");

  const selectedIds = useMemo(
    () => new Set(preferences.map((c) => c.id)),
    [preferences],
  );
  const atLimit = preferences.length >= MAX_PREFERENCES;

  const results = useMemo(() => {
    return JUNIOR_COLLEGES.filter((c) => {
      if (c.stream !== stream) return false;
      if (c.medium !== medium) return false;
      if (district !== "All Districts" && c.district !== district) return false;
      if (
        search.trim() &&
        !c.name.toLowerCase().includes(search.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [stream, medium, district, search]);

  return (
    <div className="app-form-section">
      <p className="app-form-step-sub">
        Pick your stream and medium of instruction first, then search and add
        up to {MAX_PREFERENCES} Junior Colleges. You can reorder and swap
        colleges any time before locking.
      </p>

      <h2 className="app-form-section-title">1. Select Your Stream</h2>
      <div className="app-form-choice-grid">
        {STREAM_OPTIONS.map((option) => (
          <ChoiceCard
            key={option}
            name="stream"
            title={option}
            selected={stream === option}
            onSelect={() => setStream(option)}
          />
        ))}
      </div>

      <h2 className="app-form-section-title">2. Select Your Medium</h2>
      <div className="app-form-choice-grid cap-medium-grid">
        {MEDIUM_OPTIONS.map((option) => (
          <ChoiceCard
            key={option}
            name="medium"
            title={option}
            selected={medium === option}
            onSelect={() => setMedium(option)}
          />
        ))}
      </div>

      <h2 className="app-form-section-title">3. Search &amp; Add Colleges</h2>

      <div className="cap-limit-bar">
        <div className="cap-limit-bar-track">
          <div
            className="cap-limit-bar-fill"
            style={{
              width: `${Math.min(100, (preferences.length / MAX_PREFERENCES) * 100)}%`,
            }}
          />
        </div>
        <span className="cap-limit-bar-label">
          <strong>{preferences.length}</strong> of {MAX_PREFERENCES} colleges
          selected
        </span>
        {preferences.length > 0 && (
          <button
            type="button"
            className="app-form-inline-link cap-limit-bar-link"
            onClick={onGoToRank}
          >
            View &amp; rank my preferences &rarr;
          </button>
        )}
      </div>

      <div className="app-form-field-grid">
        <TextField
          className="ux4g-field--tight"
          label="Search College by Name"
          placeholder="e.g. Champions Junior College"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SelectField
          className="ux4g-field--tight"
          label="District"
          options={["All Districts", ...DISTRICT_OPTIONS]}
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        />
      </div>

      {atLimit && (
        <div className="app-form-callout cap-callout--warn">
          <InfoIcon />
          <span>
            You have reached the maximum of {MAX_PREFERENCES} colleges. Remove
            a college from your preferences to add a different one.
          </span>
        </div>
      )}

      <div className="cap-results-list">
        {results.length === 0 && (
          <p className="cap-empty-note">
            No colleges match {stream} / {medium}
            {district !== "All Districts" ? ` in ${district}` : ""}
            {search.trim() ? ` for "${search.trim()}"` : ""}. Try adjusting
            your filters.
          </p>
        )}
        {results.map((college) => {
          const isSelected = selectedIds.has(college.id);
          const disableAdd = !isSelected && atLimit;
          return (
            <div key={college.id} className="cap-college-row">
              <div className="cap-college-row-main">
                <p className="cap-college-name">{college.name}</p>
                <p className="cap-college-address">{college.address}</p>
                <div className="cap-college-meta">
                  <span>{college.choiceCode}</span>
                  <span>{college.district}</span>
                  <span>{college.taluka}</span>
                  <span>{college.status}</span>
                  <span>
                    {college.fees > 0
                      ? `₹${college.fees.toLocaleString("en-IN")} / yr`
                      : "No Fees"}
                  </span>
                </div>
              </div>
              <Button
                variant={isSelected ? "secondary" : "primary"}
                className="cap-college-add-btn"
                disabled={isSelected || disableAdd}
                onClick={() => addCollege(college)}
              >
                {isSelected ? "Added ✓" : disableAdd ? "Limit Reached" : "+ Add"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Step 2: Rank preferences (drag & drop + up/down) ---------------- */

function RankStep({
  preferences,
  removeCollege,
  reorder,
  moveUp,
  moveDown,
  onAddMore,
}: {
  preferences: JuniorCollege[];
  removeCollege: (id: string) => void;
  reorder: (fromIndex: number, toIndex: number) => void;
  moveUp: (index: number) => void;
  moveDown: (index: number) => void;
  onAddMore: () => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  if (preferences.length === 0) {
    return (
      <div className="app-form-section">
        <div className="cap-empty-state">
          <p>You haven&apos;t selected any colleges yet.</p>
          <Button onClick={onAddMore}>Choose Colleges</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-form-section">
      <p className="app-form-step-sub">
        Drag colleges to reorder, or use the arrow buttons. Priority 1 is your
        most preferred college and will be considered first during CAP
        allotment.
      </p>

      <div className="cap-limit-bar">
        <div className="cap-limit-bar-track">
          <div
            className="cap-limit-bar-fill"
            style={{
              width: `${Math.min(100, (preferences.length / MAX_PREFERENCES) * 100)}%`,
            }}
          />
        </div>
        <span className="cap-limit-bar-label">
          <strong>{preferences.length}</strong> of {MAX_PREFERENCES} colleges
          selected
        </span>
      </div>

      <ol className="cap-rank-list">
        {preferences.map((college, index) => (
          <li
            key={college.id}
            className={`cap-rank-row ${dragIndex === index ? "cap-rank-row--dragging" : ""} ${dragOverIndex === index && dragIndex !== null && dragIndex !== index ? "cap-rank-row--drag-over" : ""}`}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragIndex !== null && dragIndex !== index) {
                setDragOverIndex(index);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex !== null) reorder(dragIndex, index);
              setDragIndex(null);
              setDragOverIndex(null);
            }}
            onDragEnd={() => {
              setDragIndex(null);
              setDragOverIndex(null);
            }}
          >
            <span className="cap-drag-handle" aria-hidden="true">
              <DragHandleIcon />
            </span>
            <span className="cap-priority-badge">{index + 1}</span>
            <div className="cap-rank-row-main">
              <p className="cap-college-name">{college.name}</p>
              <p className="cap-college-address">{college.address}</p>
              <div className="cap-college-meta">
                <span>{college.choiceCode}</span>
                <span>{college.district}</span>
                <span>{college.medium}</span>
                <span>{college.status}</span>
              </div>
            </div>
            <div className="cap-rank-row-actions">
              <button
                type="button"
                className="cap-icon-btn"
                aria-label={`Move ${college.name} up`}
                disabled={index === 0}
                onClick={() => moveUp(index)}
              >
                <ChevronUpIcon />
              </button>
              <button
                type="button"
                className="cap-icon-btn"
                aria-label={`Move ${college.name} down`}
                disabled={index === preferences.length - 1}
                onClick={() => moveDown(index)}
              >
                <ChevronDownIcon />
              </button>
              <button
                type="button"
                className="cap-icon-btn cap-icon-btn--danger"
                aria-label={`Remove ${college.name}`}
                onClick={() => removeCollege(college.id)}
              >
                <TrashIcon />
              </button>
            </div>
          </li>
        ))}
      </ol>

      {preferences.length < MAX_PREFERENCES && (
        <Button variant="secondary" className="cap-add-more-btn" onClick={onAddMore}>
          + Add More Colleges ({MAX_PREFERENCES - preferences.length} slots left)
        </Button>
      )}
    </div>
  );
}

/* ---------------- Step 3: Review & Lock ---------------- */

function ReviewStep({
  stream,
  medium,
  preferences,
  locked,
  onLock,
  onEditColleges,
  onEditOrder,
}: {
  stream: string;
  medium: string;
  preferences: JuniorCollege[];
  locked: boolean;
  onLock: () => void;
  onEditColleges: () => void;
  onEditOrder: () => void;
}) {
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (locked) {
    return (
      <div className="app-form-section">
        <div className="cap-success-panel">
          <span className="cap-success-icon">
            <StepCheckIcon />
          </span>
          <h2>Preferences Locked Successfully</h2>
          <p>
            Your Part-II option form is locked with {preferences.length}{" "}
            college{preferences.length === 1 ? "" : "s"} in priority order.
            You cannot edit this list until the next CAP round begins.
          </p>
        </div>
        <ReadOnlySummary stream={stream} medium={medium} preferences={preferences} />
      </div>
    );
  }

  return (
    <div className="app-form-section">
      <h2 className="app-form-section-title">Summary</h2>
      <div className="cap-summary-grid">
        <div className="cap-summary-item">
          <span className="cap-summary-label">Stream</span>
          <span className="cap-summary-value">{stream}</span>
        </div>
        <div className="cap-summary-item">
          <span className="cap-summary-label">Medium</span>
          <span className="cap-summary-value">{medium}</span>
        </div>
        <div className="cap-summary-item">
          <span className="cap-summary-label">Colleges Selected</span>
          <span className="cap-summary-value">
            {preferences.length} / {MAX_PREFERENCES}
          </span>
        </div>
      </div>

      <div className="cap-review-actions">
        <button type="button" className="app-form-inline-link" onClick={onEditColleges}>
          Edit stream, medium or colleges
        </button>
        <button type="button" className="app-form-inline-link" onClick={onEditOrder}>
          Edit preference order
        </button>
      </div>

      <h2 className="app-form-section-title">Your Preference Order</h2>
      <ReadOnlySummary stream={stream} medium={medium} preferences={preferences} hideHeading />

      <div className="app-form-callout cap-callout--warn">
        <InfoIcon />
        <span>
          Locking your preferences is an important, final step for this CAP
          round. Once locked, you will not be able to change the college list
          or priority order until the next round opens.
        </span>
      </div>

      <label className="cap-confirm-checkbox">
        <input
          type="checkbox"
          checked={confirmChecked}
          onChange={(e) => setConfirmChecked(e.target.checked)}
        />
        I have reviewed my preference order above and confirm it is final.
      </label>

      <Button
        className="cap-lock-btn"
        disabled={!confirmChecked}
        onClick={() => setConfirmOpen(true)}
      >
        Lock My Preferences
      </Button>

      {confirmOpen && (
        <div className="cap-modal-overlay" role="dialog" aria-modal="true">
          <div className="cap-modal">
            <h3>Lock preferences?</h3>
            <p>
              You are about to lock {preferences.length} college
              {preferences.length === 1 ? "" : "s"} in the order shown. This
              action cannot be undone for the current CAP round.
            </p>
            <div className="cap-modal-actions">
              <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setConfirmOpen(false);
                  onLock();
                }}
              >
                Yes, Lock My Preferences
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReadOnlySummary({
  stream,
  medium,
  preferences,
  hideHeading,
}: {
  stream: string;
  medium: string;
  preferences: JuniorCollege[];
  hideHeading?: boolean;
}) {
  return (
    <div>
      {!hideHeading && (
        <div className="cap-summary-grid">
          <div className="cap-summary-item">
            <span className="cap-summary-label">Stream</span>
            <span className="cap-summary-value">{stream}</span>
          </div>
          <div className="cap-summary-item">
            <span className="cap-summary-label">Medium</span>
            <span className="cap-summary-value">{medium}</span>
          </div>
          <div className="cap-summary-item">
            <span className="cap-summary-label">Colleges Selected</span>
            <span className="cap-summary-value">
              {preferences.length} / {MAX_PREFERENCES}
            </span>
          </div>
        </div>
      )}
      <ol className="cap-rank-list cap-rank-list--readonly">
        {preferences.map((college, index) => (
          <li key={college.id} className="cap-rank-row cap-rank-row--readonly">
            <span className="cap-priority-badge">{index + 1}</span>
            <div className="cap-rank-row-main">
              <p className="cap-college-name">{college.name}</p>
              <p className="cap-college-address">{college.address}</p>
              <div className="cap-college-meta">
                <span>{college.choiceCode}</span>
                <span>{college.district}</span>
                <span>{college.medium}</span>
                <span>{college.status}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------------- Icons ---------------- */

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StepCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DragHandleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0-1 13a1 1 0 01-1 1H8a1 1 0 01-1-1L6 7h12z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
