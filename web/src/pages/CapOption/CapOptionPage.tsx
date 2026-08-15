import { useEffect, useMemo, useRef, useState } from "react";
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

const STEPS = ["Choose Stream & Medium", "Rank Your Preferences", "Review & Lock"];
const STATUS_OPTIONS = ["Self Financed", "Aided", "Government"];
const CART_SECTION_ID = "cap-selected-colleges-cart";
const PREFERENCES_SECTION_ID = "cap-set-preferences-section";

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
  const [incompleteModalOpen, setIncompleteModalOpen] = useState(false);

  function canAccessStep(index: number) {
    if (index === 0) return true;
    return Boolean(stream) && Boolean(medium);
  }

  function goTo(index: number) {
    if (locked || !canAccessStep(index)) return;
    setCurrent(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToSelection() {
    setIncompleteModalOpen(false);
    window.setTimeout(() => {
      document
        .getElementById(CART_SECTION_ID)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 10);
  }

  function handleNext() {
    if (current === 1 && preferences.length > 0 && preferences.length < MAX_PREFERENCES) {
      setIncompleteModalOpen(true);
      return;
    }
    setCompleted((prev) => new Set(prev).add(current));
    if (current < STEPS.length - 1) goTo(current + 1);
  }

  function handleContinueAnyway() {
    setIncompleteModalOpen(false);
    setCompleted((prev) => new Set(prev).add(current));
    goTo(current + 1);
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
    (current === 0 && (!stream || !medium)) ||
    (current === 1 && preferences.length === 0);

  return (
    <div className="app-form-page cap-page">
      <div className="app-form-topbar">
        <div>CAP Option (Part II) &mdash; Junior College Preferences</div>
        <span
          className={`app-form-status ${locked ? "app-form-status--locked" : ""}`}
        >
          <span className="app-form-status-dot" />
          {locked ? "Locked" : "In Progress"}
        </span>
      </div>

      <div className="app-form-stepper-wrap">
        <ol className="app-form-stepper cap-stepper">
          {STEPS.map((label, index) => {
            const isDone = locked || completed.has(index);
            const isCurrent = index === current;
            const isLast = index === STEPS.length - 1;
            const isLocked = !canAccessStep(index);
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
                    className={`app-form-step-trigger ${isCurrent ? "app-form-step-trigger--current" : ""} ${isLocked ? "app-form-step-trigger--locked" : ""}`}
                    onClick={() => goTo(index)}
                    disabled={locked || isLocked}
                    aria-current={isCurrent ? "step" : undefined}
                    aria-label={isLocked ? `${label} (complete Step 1 first)` : label}
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
            <StreamMediumStep
              stream={stream}
              setStream={setStream}
              medium={medium}
              setMedium={setMedium}
            />
          )}
          {current === 1 && (
            <SearchAndRankStep
              stream={stream}
              medium={medium}
              preferences={preferences}
              addCollege={addCollege}
              removeCollege={removeCollege}
              reorder={reorder}
              moveUp={moveUp}
              moveDown={moveDown}
              onEditStreamMedium={() => goTo(0)}
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
              onEditStreamMedium={() => goTo(0)}
              onEditColleges={() => goTo(1)}
            />
          )}

          {!locked && (
            <div className="app-form-footer">
              {current > 0 ? (
                <Button variant="secondary" onClick={handlePrev}>
                  &larr; Previous
                </Button>
              ) : (
                <span />
              )}
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

      {incompleteModalOpen && (
        <div className="cap-modal-overlay" role="dialog" aria-modal="true">
          <div className="cap-modal">
            <h3>Set Your Preferences</h3>
            <p>
              You&apos;ve selected {preferences.length} of {MAX_PREFERENCES}{" "}
              colleges. Add more colleges and arrange them in priority order
              before continuing, or proceed with your current selection.
            </p>
            <div className="cap-modal-actions">
              <Button variant="secondary" onClick={handleContinueAnyway}>
                Continue Anyway
              </Button>
              <Button onClick={scrollToSelection}>Set Preferences</Button>
            </div>
          </div>
        </div>
      )}

      <Toast message="Preferences locked successfully" visible={toastVisible} />
    </div>
  );
}

/* ---------------- Step 1: Stream & Medium only ---------------- */

function StreamMediumStep({
  stream,
  setStream,
  medium,
  setMedium,
}: {
  stream: string;
  setStream: (v: string) => void;
  medium: string;
  setMedium: (v: string) => void;
}) {
  return (
    <div className="app-form-section">
      <h2 className="app-form-section-title">Select Your Stream</h2>
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

      <h2 className="app-form-section-title">Select Your Medium</h2>
      {!stream && (
        <p className="cap-medium-hint">Select a stream above to choose your medium.</p>
      )}
      <div className="app-form-choice-grid cap-medium-grid">
        {MEDIUM_OPTIONS.map((option) => (
          <ChoiceCard
            key={option}
            name="medium"
            title={option}
            selected={medium === option}
            disabled={!stream}
            onSelect={() => setMedium(option)}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Step 2: Cart + Search + Filters + Results + Rank ---------------- */

function SearchAndRankStep({
  stream,
  medium,
  preferences,
  addCollege,
  removeCollege,
  reorder,
  moveUp,
  moveDown,
  onEditStreamMedium,
}: {
  stream: string;
  medium: string;
  preferences: JuniorCollege[];
  addCollege: (college: JuniorCollege) => void;
  removeCollege: (id: string) => void;
  reorder: (fromIndex: number, toIndex: number) => void;
  moveUp: (index: number) => void;
  moveDown: (index: number) => void;
  onEditStreamMedium: () => void;
}) {
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("All Districts");
  const [status, setStatus] = useState("All Types");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [detailsCollege, setDetailsCollege] = useState<JuniorCollege | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const prevCountRef = useRef(preferences.length);

  const selectedIds = useMemo(
    () => new Set(preferences.map((c) => c.id)),
    [preferences],
  );
  const atLimit = preferences.length >= MAX_PREFERENCES;
  const readyToRank = preferences.length === MAX_PREFERENCES;
  const activeFilterCount =
    (district !== "All Districts" ? 1 : 0) + (status !== "All Types" ? 1 : 0);

  const results = useMemo(() => {
    return JUNIOR_COLLEGES.filter((c) => {
      if (c.stream !== stream) return false;
      if (c.medium !== medium) return false;
      if (district !== "All Districts" && c.district !== district) return false;
      if (status !== "All Types" && c.status !== status) return false;
      if (
        search.trim() &&
        !c.name.toLowerCase().includes(search.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [stream, medium, district, status, search]);

  // Auto-reveal & scroll to the preference-ordering section the moment the 10th college is added.
  useEffect(() => {
    if (prevCountRef.current < MAX_PREFERENCES && preferences.length === MAX_PREFERENCES) {
      window.setTimeout(() => {
        document
          .getElementById(PREFERENCES_SECTION_ID)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
    prevCountRef.current = preferences.length;
  }, [preferences.length]);

  function scrollToPreferences() {
    document
      .getElementById(PREFERENCES_SECTION_ID)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!stream || !medium) {
    return (
      <div className="app-form-section">
        <div className="cap-empty-state">
          <p>Choose your stream and medium first to search for colleges.</p>
          <Button onClick={onEditStreamMedium}>Choose Stream &amp; Medium</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-form-section">
      <div className="cap-chip-row">
        <span className="cap-meta-chip">Stream: {stream}</span>
        <span className="cap-meta-chip">Medium: {medium}</span>
        <button type="button" className="app-form-inline-link" onClick={onEditStreamMedium}>
          Change
        </button>
      </div>

      {/* Section 1: Selected Colleges cart */}
      <div className="cap-cart" id={CART_SECTION_ID}>
        <div className="cap-cart-header">
          <h2 className="cap-cart-title">Selected Colleges</h2>
          <div className="cap-cart-header-right">
            <span className="cap-cart-counter">
              {preferences.length} / {MAX_PREFERENCES} Colleges Selected
            </span>
            {readyToRank && (
              <button
                type="button"
                className="cap-set-prefs-cta"
                onClick={scrollToPreferences}
              >
                Set Preferences &rarr;
              </button>
            )}
          </div>
        </div>
        <div className="cap-limit-bar-track cap-cart-track">
          <div
            className="cap-limit-bar-fill"
            style={{
              width: `${Math.min(100, (preferences.length / MAX_PREFERENCES) * 100)}%`,
            }}
          />
        </div>
        {preferences.length === 0 ? (
          <p className="cap-cart-empty">
            No colleges selected yet. Use the search below to find and add
            colleges.
          </p>
        ) : (
          <ul className="cap-cart-list">
            {preferences.map((college) => (
              <li key={college.id} className="cap-cart-chip">
                <span className="cap-cart-chip-name">{college.name}</span>
                <button
                  type="button"
                  className="cap-cart-chip-remove"
                  aria-label={`Remove ${college.name}`}
                  onClick={() => removeCollege(college.id)}
                >
                  <CloseIcon />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Section 2: Find Your College search & filters */}
      <div className="cap-search-panel">
        <h2 className="app-form-section-title">Find Your College</h2>
        <div className="cap-search-row">
          <TextField
            className="ux4g-field--tight cap-search-input"
            label="Search College by Name"
            placeholder="e.g. Champions Junior College"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            className={`cap-filters-btn ${filtersOpen ? "cap-filters-btn--open" : ""}`}
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <FilterIcon />
            Filters
            {activeFilterCount > 0 && (
              <span className="cap-filters-count">{activeFilterCount}</span>
            )}
          </button>
        </div>

        {filtersOpen && (
          <div className="cap-filters-drawer">
            <SelectField
              className="ux4g-field--tight"
              label="District"
              options={["All Districts", ...DISTRICT_OPTIONS]}
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
            <SelectField
              className="ux4g-field--tight"
              label="College Type"
              options={["All Types", ...STATUS_OPTIONS]}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
            <button
              type="button"
              className="app-form-inline-link cap-filters-clear"
              onClick={() => {
                setDistrict("All Districts");
                setStatus("All Types");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {activeFilterCount > 0 && (
          <div className="cap-filter-chip-row">
            {district !== "All Districts" && (
              <span className="cap-filter-chip">
                District: {district}
                <button type="button" onClick={() => setDistrict("All Districts")} aria-label="Remove district filter">
                  <CloseIcon />
                </button>
              </span>
            )}
            {status !== "All Types" && (
              <span className="cap-filter-chip">
                Type: {status}
                <button type="button" onClick={() => setStatus("All Types")} aria-label="Remove type filter">
                  <CloseIcon />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {atLimit && (
        <div className="app-form-callout cap-callout--warn">
          <InfoIcon />
          <span>
            You have reached the maximum of {MAX_PREFERENCES} colleges. Remove
            a college from your Selected Colleges cart above to add a
            different one.
          </span>
        </div>
      )}

      {/* Section 3: Available Colleges results */}
      <div className="cap-available-section">
        <div className="cap-available-header">
          <h2 className="app-form-section-title cap-available-title">Available Colleges</h2>
          <span className="cap-available-count">{results.length} colleges found</span>
        </div>

        <div className="cap-college-grid">
          {results.length === 0 && (
            <p className="cap-empty-note">
              No colleges match {stream} / {medium}
              {district !== "All Districts" ? ` in ${district}` : ""}
              {status !== "All Types" ? ` (${status})` : ""}
              {search.trim() ? ` for "${search.trim()}"` : ""}. Try adjusting
              your filters.
            </p>
          )}
          {results.map((college) => {
            const isSelected = selectedIds.has(college.id);
            const disableAdd = !isSelected && atLimit;
            return (
              <div key={college.id} className="cap-college-card">
                <p className="cap-college-name">{college.name}</p>
                <p className="cap-college-address">{college.address}</p>
                <div className="cap-college-meta">
                  <span>{college.choiceCode}</span>
                  <span>{college.district}</span>
                  <span>{college.status}</span>
                  <span>
                    {college.fees > 0
                      ? `₹${college.fees.toLocaleString("en-IN")} / yr`
                      : "No Fees"}
                  </span>
                </div>
                <div className="cap-college-card-actions">
                  <Button
                    variant="secondary"
                    className="cap-college-view-btn"
                    onClick={() => setDetailsCollege(college)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant={isSelected ? "secondary" : "primary"}
                    className="cap-college-add-btn"
                    disabled={isSelected || disableAdd}
                    onClick={() => addCollege(college)}
                  >
                    {isSelected ? "Added ✓" : disableAdd ? "Limit Reached" : "Add to Preferences"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preference ordering unlocks once the cart is full */}
      {readyToRank ? (
        <div id={PREFERENCES_SECTION_ID} className="cap-preferences-section">
          <h2 className="app-form-section-title">Set Your Preferences</h2>
          <p className="app-form-step-sub">
            Drag colleges to reorder, or use the arrow buttons. Priority 1 is
            your most preferred college and will be considered first during
            CAP allotment.
          </p>
          <ol className="cap-rank-list cap-rank-list--scroll">
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
        </div>
      ) : (
        preferences.length > 0 && (
          <div className="app-form-callout">
            <InfoIcon />
            <span>
              Add {MAX_PREFERENCES - preferences.length} more college
              {MAX_PREFERENCES - preferences.length === 1 ? "" : "s"} to
              unlock priority ordering. Your colleges are currently kept in
              the order you added them.
            </span>
          </div>
        )
      )}

      {detailsCollege && (
        <div
          className="cap-modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setDetailsCollege(null)}
        >
          <div className="cap-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{detailsCollege.name}</h3>
            <dl className="cap-details-list">
              <div>
                <dt>Address</dt>
                <dd>{detailsCollege.address}</dd>
              </div>
              <div>
                <dt>Choice Code</dt>
                <dd>{detailsCollege.choiceCode}</dd>
              </div>
              <div>
                <dt>District / Taluka</dt>
                <dd>
                  {detailsCollege.district}, {detailsCollege.taluka}
                </dd>
              </div>
              <div>
                <dt>Stream</dt>
                <dd>{detailsCollege.stream}</dd>
              </div>
              <div>
                <dt>Medium</dt>
                <dd>{detailsCollege.medium}</dd>
              </div>
              <div>
                <dt>College Type</dt>
                <dd>{detailsCollege.status}</dd>
              </div>
              <div>
                <dt>Fees</dt>
                <dd>
                  {detailsCollege.fees > 0
                    ? `₹${detailsCollege.fees.toLocaleString("en-IN")} / yr`
                    : "No Fees"}
                </dd>
              </div>
            </dl>
            <div className="cap-modal-actions">
              <Button variant="secondary" onClick={() => setDetailsCollege(null)}>
                Close
              </Button>
              <Button
                disabled={
                  selectedIds.has(detailsCollege.id) ||
                  (!selectedIds.has(detailsCollege.id) && atLimit)
                }
                onClick={() => {
                  addCollege(detailsCollege);
                  setDetailsCollege(null);
                }}
              >
                {selectedIds.has(detailsCollege.id) ? "Added ✓" : "Add to Preferences"}
              </Button>
            </div>
          </div>
        </div>
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
  onEditStreamMedium,
  onEditColleges,
}: {
  stream: string;
  medium: string;
  preferences: JuniorCollege[];
  locked: boolean;
  onLock: () => void;
  onEditStreamMedium: () => void;
  onEditColleges: () => void;
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
        <PreferenceTable preferences={preferences} />
      </div>
    );
  }

  return (
    <div className="app-form-section">
      <p className="app-form-step-sub">
        This is a preview of your complete Part-II application. Review every
        detail carefully &mdash; you can still make changes before locking.
      </p>

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
          <span className="cap-summary-label">Total Colleges Selected</span>
          <span className="cap-summary-value">
            {preferences.length} / {MAX_PREFERENCES}
          </span>
        </div>
      </div>

      <div className="cap-review-actions">
        <button type="button" className="app-form-inline-link" onClick={onEditStreamMedium}>
          Edit Stream &amp; Medium
        </button>
        <button type="button" className="app-form-inline-link" onClick={onEditColleges}>
          Edit Colleges &amp; Preference Order
        </button>
      </div>

      <h2 className="app-form-section-title">College Preference Order</h2>
      <PreferenceTable preferences={preferences} />

      <div className="cap-confirm-section">
        <div className="app-form-callout cap-callout--warn">
          <InfoIcon />
          <span>
            Please review all your details carefully before locking your
            preferences. Once locked, you will not be able to change the
            college list or priority order until the next CAP round opens.
          </span>
        </div>

        <label className="cap-confirm-checkbox">
          <input
            type="checkbox"
            checked={confirmChecked}
            onChange={(e) => setConfirmChecked(e.target.checked)}
          />
          I have reviewed and confirmed that all the information and college
          preferences are correct.
        </label>

        <Button
          className="cap-lock-btn"
          disabled={!confirmChecked}
          onClick={() => setConfirmOpen(true)}
        >
          Lock Preferences
        </Button>
      </div>

      {confirmOpen && (
        <div className="cap-modal-overlay" role="dialog" aria-modal="true">
          <div className="cap-modal">
            <h3>Lock your preferences?</h3>
            <p>
              You are about to lock {preferences.length} college
              {preferences.length === 1 ? "" : "s"} in the order shown. Your
              preferences may not be editable after this and this action
              cannot be undone for the current CAP round.
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

function PreferenceTable({ preferences }: { preferences: JuniorCollege[] }) {
  if (preferences.length === 0) {
    return <p className="cap-empty-note">No colleges selected.</p>;
  }

  return (
    <div className="cap-table-wrap">
      <table className="cap-table">
        <thead>
          <tr>
            <th className="cap-table-priority-col">Priority</th>
            <th>College Name</th>
            <th>Code</th>
            <th>Location</th>
            <th>Stream</th>
            <th>Medium</th>
            <th>Fees</th>
          </tr>
        </thead>
        <tbody>
          {preferences.map((college, index) => (
            <tr key={college.id}>
              <td className="cap-table-priority-col">
                <span className="cap-priority-badge">{index + 1}</span>
              </td>
              <td>
                <p className="cap-table-college-name">{college.name}</p>
                <p className="cap-table-college-address">{college.address}</p>
              </td>
              <td className="cap-table-mono">{college.choiceCode}</td>
              <td>
                {college.district}
                <br />
                <span className="cap-table-muted">{college.taluka}</span>
              </td>
              <td>{college.stream}</td>
              <td>{college.medium}</td>
              <td>
                {college.fees > 0
                  ? `₹${college.fees.toLocaleString("en-IN")}`
                  : "No Fees"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
