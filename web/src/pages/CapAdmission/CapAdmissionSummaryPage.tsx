import { useApplicationForm } from "../../context/ApplicationFormContext";
import { CAP_ADMISSION_ROUNDS } from "../../data/capAdmissionRounds";
import "../ApplicationForm/ApplicationFormPage.css";
import "../CapOption/CapOptionPage.css";
import "../Miscellaneous/MiscellaneousPage.css";
import "./CapAdmissionPage.css";

export function CapAdmissionSummaryPage() {
  const { personal } = useApplicationForm();

  return (
    <div className="app-form-page">
      <div className="app-form-shell">
        <div className="app-form-card">
          <div className="app-form-section">
            <div className="cap-admission-summary-header">
              <span>
                <strong>Application ID:</strong> CBSE00012859
              </span>
              <span>
                <strong>Candidate Name:</strong> {personal.fullName}
              </span>
            </div>

            <div className="misc-table-wrap">
              <table className="misc-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Round</th>
                    <th>Activity</th>
                    <th>Stream Code</th>
                    <th>College Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {CAP_ADMISSION_ROUNDS.map((row, index) => (
                    <tr key={row.round}>
                      <td>
                        <span className="cap-priority-badge">{index + 1}</span>
                      </td>
                      <td>{row.round}</td>
                      <td>{row.activity}</td>
                      <td>{row.streamCode}</td>
                      <td>{row.collegeName}</td>
                      <td>{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
