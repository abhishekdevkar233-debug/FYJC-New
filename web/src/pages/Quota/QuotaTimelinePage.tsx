import { useQuota } from "../../context/QuotaContext";
import "../ApplicationForm/ApplicationFormPage.css";
import "../CapOption/CapOptionPage.css";
import "./QuotaPage.css";

export function QuotaTimelinePage() {
  const { timelineLogs } = useQuota();

  return (
    <div className="app-form-page">
      <div className="app-form-shell">
        <div className="app-form-card">
          <div className="app-form-card-head">
            <h1>Timeline Log</h1>
          </div>

          <div className="app-form-section">
            <h2 className="app-form-section-title">Student Logs</h2>

            <div className="cap-table-wrap">
              <table className="cap-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Activity</th>
                    <th>Sub Activity</th>
                    <th>Activity By</th>
                    <th>Details</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {timelineLogs.map((log, index) => (
                    <tr key={`${log.date}-${index}`}>
                      <td className="cap-table-mono">{log.date}</td>
                      <td>{log.activity}</td>
                      <td>{log.subActivity}</td>
                      <td>{log.activityBy}</td>
                      <td>{log.details}</td>
                      <td className="cap-table-mono">{log.ipAddress}</td>
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
