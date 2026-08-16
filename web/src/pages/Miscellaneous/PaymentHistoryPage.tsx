import { useApplicationForm } from "../../context/ApplicationFormContext";
import "../ApplicationForm/ApplicationFormPage.css";
import "./MiscellaneousPage.css";

export function PaymentHistoryPage() {
  const { payment, personal } = useApplicationForm();

  const rows =
    payment.status === "success" && payment.transactionRef
      ? [
          {
            transactionId: payment.transactionRef,
            amount: 100,
            status: "SUCCESS" as const,
            date: payment.date ?? "",
            purpose: personal.fullName || "Applicant",
            mode: payment.mode ?? "UPI",
            doneBy: "CBSE00012859",
          },
        ]
      : [];

  return (
    <div className="app-form-page">
      <div className="app-form-shell">
        <div className="app-form-card">
          <div className="app-form-card-head">
            <h1>Payment History</h1>
          </div>

          <div className="app-form-section">
            <h2 className="app-form-section-title">Transactions</h2>

            {rows.length === 0 ? (
              <p className="misc-empty-note">
                No payment transactions found yet.
              </p>
            ) : (
              <div className="misc-table-wrap">
                <table className="misc-table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Transaction Id</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Transaction Date</th>
                      <th>Payment Date</th>
                      <th>Purpose</th>
                      <th>Payment Mode</th>
                      <th>Payment Done By</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={row.transactionId}>
                        <td>{index + 1}</td>
                        <td className="misc-table-mono">{row.transactionId}</td>
                        <td>&#8377;{row.amount}</td>
                        <td>
                          <span className="misc-tag misc-tag--success">
                            {row.status}
                          </span>
                        </td>
                        <td>{row.date}</td>
                        <td>{row.date}</td>
                        <td>{row.purpose}</td>
                        <td>{row.mode}</td>
                        <td>{row.doneBy}</td>
                        <td>
                          <button
                            type="button"
                            className="misc-icon-btn"
                            aria-label="Print receipt"
                            onClick={() => window.print()}
                          >
                            <PrintIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PrintIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M6 14h12v7H6v-7Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
