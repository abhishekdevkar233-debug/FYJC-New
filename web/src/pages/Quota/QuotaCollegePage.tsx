import { useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { SelectField } from "../../components/ui/SelectField";
import { useQuota, MAX_QUOTA_COLLEGES } from "../../context/QuotaContext";
import type { QuotaKind } from "../../context/QuotaContext";
import { JUNIOR_COLLEGES, MEDIUM_OPTIONS, DISTRICT_OPTIONS } from "../../data/juniorColleges";
import "../ApplicationForm/ApplicationFormPage.css";
import "../CapOption/CapOptionPage.css";
import "./QuotaPage.css";

const STATUS_OPTIONS = ["Self Financed", "Aided", "Government"];

function QuotaCollegeSection({
  kind,
  title,
  disabledNote,
}: {
  kind: QuotaKind;
  title: string;
  disabledNote?: string;
}) {
  const { selections, savedAt, addCollege, removeCollege, saveChoices } = useQuota();
  const [search, setSearch] = useState("");
  const [medium, setMedium] = useState("All Mediums");
  const [district, setDistrict] = useState("All Districts");
  const [status, setStatus] = useState("All Types");

  const list = selections[kind];
  const isDisabled = Boolean(disabledNote);
  const selectedIds = useMemo(() => new Set(list.map((c) => c.id)), [list]);
  const atLimit = list.length >= MAX_QUOTA_COLLEGES;

  const results = useMemo(() => {
    if (isDisabled) return [];
    return JUNIOR_COLLEGES.filter((c) => {
      if (medium !== "All Mediums" && c.medium !== medium) return false;
      if (district !== "All Districts" && c.district !== district) return false;
      if (status !== "All Types" && c.status !== status) return false;
      if (
        search.trim() &&
        !c.name.toLowerCase().includes(search.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    }).slice(0, 24);
  }, [isDisabled, medium, district, status, search]);

  return (
    <div className="app-form-page">
      <div className="app-form-shell">
        <div className="app-form-card">
          <div className="app-form-card-head">
            <h1>{title}</h1>
          </div>

          <div className="app-form-section">
            <h2 className="app-form-section-title">Choose Jr. Colleges</h2>

            <div className="quota-instructions">
              <p className="quota-instructions-title">Instructions:</p>
              <ul>
                <li>
                  Search for colleges using the filters below to see a list of
                  Junior Colleges matching your criteria.
                </li>
                <li>
                  Click <strong>Add</strong> next to a college to choose it.
                  You can select a maximum of {MAX_QUOTA_COLLEGES} Junior
                  Colleges &mdash; they will appear in the table below.
                </li>
                <li>
                  To remove a college you&apos;ve selected, click the delete
                  icon next to it in the table.
                </li>
                <li>
                  After shortlisting your colleges, click{" "}
                  <strong>Save Choices</strong>.
                </li>
              </ul>
            </div>

            {!isDisabled && (
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
                  <SelectField
                    className="ux4g-field--tight cap-search-input"
                    label="Medium"
                    options={["All Mediums", ...MEDIUM_OPTIONS]}
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                  />
                  <SelectField
                    className="ux4g-field--tight cap-search-input"
                    label="District"
                    options={["All Districts", ...DISTRICT_OPTIONS]}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                  <SelectField
                    className="ux4g-field--tight cap-search-input"
                    label="College Type"
                    options={["All Types", ...STATUS_OPTIONS]}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </div>
              </div>
            )}

            {disabledNote && (
              <div className="app-form-callout cap-callout--warn">
                <InfoIcon />
                <span>{disabledNote}</span>
              </div>
            )}

            {!isDisabled && (
              <div className="cap-available-section">
                <div className="cap-available-header">
                  <h2 className="app-form-section-title cap-available-title">
                    Available Colleges
                  </h2>
                  <span className="cap-available-count">
                    {results.length} colleges found
                  </span>
                </div>

                <div className="cap-college-grid">
                  {results.length === 0 && (
                    <p className="cap-empty-note">
                      No colleges match your search criteria. Try adjusting
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
                            variant={isSelected ? "secondary" : "primary"}
                            className="cap-college-add-btn"
                            disabled={isSelected || disableAdd}
                            onClick={() => addCollege(kind, college)}
                          >
                            {isSelected
                              ? "Added ✓"
                              : disableAdd
                                ? "Limit Reached"
                                : "Add"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <h2 className="app-form-section-title">
              Select Jr. Colleges of Your Choice
            </h2>

            {list.length === 0 ? (
              <p className="cap-empty-note">There are no records to display</p>
            ) : (
              <div className="cap-table-wrap">
                <table className="cap-table">
                  <thead>
                    <tr>
                      <th>Pref No.</th>
                      <th>Stream Code</th>
                      <th>College Name &amp; Address</th>
                      <th>Block</th>
                      <th>Stream</th>
                      <th>Status</th>
                      <th>Medium</th>
                      <th>Fees</th>
                      {!isDisabled && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((college, index) => (
                      <tr key={college.id}>
                        <td className="cap-table-priority-col">
                          <span className="cap-priority-badge">{index + 1}</span>
                        </td>
                        <td className="cap-table-mono">{college.choiceCode}</td>
                        <td>
                          <p className="cap-table-college-name">{college.name}</p>
                          <p className="cap-table-college-address">
                            {college.address}
                          </p>
                        </td>
                        <td>{college.taluka}</td>
                        <td>{college.stream}</td>
                        <td>{college.status}</td>
                        <td>{college.medium}</td>
                        <td>
                          {college.fees > 0
                            ? `₹${college.fees.toLocaleString("en-IN")}`
                            : "No Fees"}
                        </td>
                        {!isDisabled && (
                          <td>
                            <button
                              type="button"
                              className="cap-icon-btn cap-icon-btn--danger"
                              aria-label={`Remove ${college.name}`}
                              onClick={() => removeCollege(kind, college.id)}
                            >
                              <TrashIcon />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="quota-saved-note">
              Selected Preferences Status As On {savedAt[kind]}
            </p>
            {!isDisabled && (
              <p className="quota-save-hint">
                Note: If you shuffle your choices/preferences don&apos;t
                forget to click on Save Choices.
              </p>
            )}
          </div>

          {!isDisabled && (
            <div className="app-form-footer">
              <span />
              <div className="app-form-footer-right">
                <Button onClick={() => saveChoices(kind)}>Save Choices</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function InHouseQuotaPage() {
  return (
    <QuotaCollegeSection
      kind="inHouse"
      title="Apply for In-House Quota"
      disabledNote="During Special Round the filling Options for this Quota is not available"
    />
  );
}

export function MinorityQuotaPage() {
  return <QuotaCollegeSection kind="minority" title="Apply for Minority Quota" />;
}

export function ManagementQuotaPage() {
  return (
    <QuotaCollegeSection
      kind="management"
      title="Apply for Management Quota"
      disabledNote="Apply for Management Quota will remain disabled until the next round begins"
    />
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" strokeLinejoin="round" />
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
