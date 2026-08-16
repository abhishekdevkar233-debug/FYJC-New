import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { SelectField } from "../../components/ui/SelectField";
import { CAP_ADMISSION_ROUNDS } from "../../data/capAdmissionRounds";
import "../ApplicationForm/ApplicationFormPage.css";
import "../CapOption/CapOptionPage.css";
import "../Miscellaneous/MiscellaneousPage.css";
import "./CapAdmissionPage.css";

const ROUND_NAMES = CAP_ADMISSION_ROUNDS.map((r) => r.round);

export function CapAllotmentStatusPage() {
  const [round, setRound] = useState(ROUND_NAMES[1]);
  const [checked, setChecked] = useState(false);

  const result = CAP_ADMISSION_ROUNDS.find((r) => r.round === round);

  return (
    <div className="app-form-page">
      <div className="app-form-shell">
        <div className="app-form-card">
          <div className="app-form-section">
            <h2 className="app-form-section-title cap-allotment-title">
              Check CAP Allotment Status
            </h2>
            <p className="cap-allotment-hint">
              You can view previous rounds data by selecting rounds from the
              round filter.
            </p>

            <div className="cap-search-row">
              <TextField
                className="ux4g-field--tight cap-search-input"
                label="Application Form Number"
                required
                readOnly
                value="CBSE00012859"
              />
              <SelectField
                className="ux4g-field--tight cap-search-input"
                label="Round"
                required
                options={ROUND_NAMES}
                value={round}
                onChange={(e) => {
                  setRound(e.target.value);
                  setChecked(false);
                }}
              />
              <Button
                className="cap-allotment-check-btn"
                onClick={() => setChecked(true)}
              >
                Check Status
              </Button>
            </div>

            {checked && result && (
              <div className="withdraw-grid cap-allotment-result">
                <div className="withdraw-row">
                  <span className="withdraw-key">Round</span>
                  <span className="withdraw-value">{result.round}</span>
                </div>
                <div className="withdraw-row">
                  <span className="withdraw-key">Activity</span>
                  <span className="withdraw-value">{result.activity}</span>
                </div>
                <div className="withdraw-row">
                  <span className="withdraw-key">Stream Code</span>
                  <span className="withdraw-value">{result.streamCode}</span>
                </div>
                <div className="withdraw-row">
                  <span className="withdraw-key">College Name</span>
                  <span className="withdraw-value">{result.collegeName}</span>
                </div>
                <div className="withdraw-row">
                  <span className="withdraw-key">Status</span>
                  <span className="withdraw-value">{result.status}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
