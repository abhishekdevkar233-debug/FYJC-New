import { useApplicationForm } from "../../context/ApplicationFormContext";
import { Button } from "../../components/ui/Button";
import "../ApplicationForm/ApplicationFormPage.css";
import "./MiscellaneousPage.css";

const SPECIAL_RESERVATION_LABELS: Record<string, string> = {
  handicapped: "Handicapped (Divyang) / Hearing Disability",
  earthquakeOrProjectAffected: "Earthquake or Project Affected",
  parentTransferred: "Parent Transferred to Online Process Area",
  grandparentsFreedomFighter: "Grandparents Freedom Fighters",
  parentDefenceServiceman: "Parent(s) Defence Serviceman / Ex-Serviceman",
  sportsCategory: "Sports Category",
  orphanQuota: "Orphan 1% Quota",
};

export function WithdrawApplicationPage() {
  const { registration, personal, category, marks, documents, payment } =
    useApplicationForm();

  const totalMarks = marks.reduce((sum, row) => sum + (Number(row.marks) || 0), 0);
  const totalOutOf = marks.reduce((sum, row) => sum + (Number(row.outOf) || 0), 0);
  const meritOn500 =
    totalOutOf > 0 ? ((totalMarks / totalOutOf) * 500).toFixed(2) : "0.00";

  const specialReservations = (
    Object.keys(SPECIAL_RESERVATION_LABELS) as Array<keyof typeof category>
  ).filter((key) => category[key] === "Yes");

  return (
    <div className="app-form-page">
      <div className="app-form-shell">
        <div className="app-form-card">
          <div className="app-form-section">
            <p className="withdraw-banner">
              Application Form No : FYJC2026-00842
            </p>

            <div className="withdraw-section">
              <h2 className="withdraw-section-title">
                Personal Details and Board Details of Applicant
              </h2>
              <div className="withdraw-grid">
                <Row label="Full Name" value={personal.fullName} />
                <Row label="Mother Name" value={personal.motherName} />
                <Row label="Gender" value={personal.gender} />
                <Row label="Date of Birth" value={personal.dob} />
                <Row label="Board" value={registration.board} />
                <Row
                  label="Month & Year of Examination"
                  value={`${registration.month}, ${registration.year}`}
                />
                <Row label="Seat Number" value={registration.seatNumber} />
                <Row label="Residence" value={personal.residence} />
                <Row label="10th School Name" value={personal.schoolName} />
                <Row label="10th School UDISE Number" value={personal.udise} />
                <Row
                  label="10th School Index Number"
                  value={personal.indexNumber || "-"}
                />
              </div>
            </div>

            <div className="withdraw-section">
              <h2 className="withdraw-section-title">
                Address for Correspondence and Contact Details
              </h2>
              <div className="withdraw-grid">
                <Row label="Correspondence Address" value={personal.address} />
                <Row label="Mobile Number" value={personal.mobile1} />
                <Row
                  label="Alternative Mobile Number"
                  value={personal.mobile2 || "-"}
                />
                <Row label="E-Mail ID" value={personal.email || "-"} />
                <Row label="Phone Number" value={personal.landline || "-"} />
              </div>
            </div>

            <div className="withdraw-section">
              <h2 className="withdraw-section-title">Reservation Details</h2>
              <div className="withdraw-grid">
                <Row label="Original Category" value={category.originalCategory} />
                <Row
                  label="Category for Admission"
                  value={category.admissionCategory}
                />
              </div>
            </div>

            <div className="withdraw-section">
              <h2 className="withdraw-section-title">
                Other / Special Reservation Details
              </h2>
              {specialReservations.length === 0 ? (
                <div className="withdraw-empty">
                  No special reservation applicable.
                </div>
              ) : (
                <div className="withdraw-grid">
                  {specialReservations.map((key) => (
                    <Row
                      key={key}
                      label={SPECIAL_RESERVATION_LABELS[key]}
                      value="Yes"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="withdraw-section">
              <h2 className="withdraw-section-title">Minority Quota Admission</h2>
              <div className="withdraw-grid">
                <Row
                  label="Do You belong to Minority Category?"
                  value={
                    category.minority === "Belongs to Minority Category"
                      ? "Yes"
                      : "No"
                  }
                />
                {category.minority === "Belongs to Minority Category" && (
                  <>
                    <Row
                      label="Linguistic Minority"
                      value={category.linguisticMinority || "-"}
                    />
                    <Row
                      label="Religious Minority"
                      value={category.religiousMinority || "-"}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="withdraw-section">
              <h2 className="withdraw-section-title">Inhouse Quota Admission</h2>
              <div className="withdraw-grid">
                <Row
                  label="Do you want to take admission through Inhouse Quota?"
                  value={
                    category.inhouse === "Yes, apply through Inhouse Quota"
                      ? "Yes"
                      : "No"
                  }
                />
              </div>
            </div>

            <div className="withdraw-section">
              <h2 className="withdraw-section-title">
                10th Standard Examination Details
              </h2>
              <div className="withdraw-grid">
                <Row label="Passing Status" value="PASS" />
                <Row label="Passed in English Subject" value="Yes" />
              </div>
              <div className="app-form-table-wrap">
                <table className="app-form-table">
                  <thead>
                    <tr>
                      <th>Language</th>
                      <th>Subject</th>
                      <th>Out Of</th>
                      <th>Marks</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((row) => {
                      const outOf = Number(row.outOf) || 0;
                      const scored = Number(row.marks) || 0;
                      const pct = outOf > 0 ? ((scored / outOf) * 100).toFixed(0) : "0";
                      return (
                        <tr key={row.subject}>
                          <td>{row.subject}</td>
                          <td>{row.name}</td>
                          <td>{row.outOf}</td>
                          <td>{row.marks}</td>
                          <td>{pct}</td>
                        </tr>
                      );
                    })}
                    <tr className="app-form-table-total">
                      <td colSpan={2}>Total</td>
                      <td>{totalOutOf}</td>
                      <td>{totalMarks}</td>
                      <td>
                        {totalOutOf > 0
                          ? ((totalMarks / totalOutOf) * 100).toFixed(2)
                          : "0.00"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="app-form-merit-value withdraw-merit-value">
                Merit Marks: {meritOn500} (Converted Out Of 500)
              </p>
            </div>

            <div className="withdraw-section">
              <h2 className="withdraw-section-title">Documents Verification List</h2>
              <div className="misc-table-wrap">
                <table className="misc-table">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Document Name</th>
                      <th>File Name</th>
                      <th>Document Upload Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, index) => (
                      <tr key={doc.name}>
                        <td>{index + 1}</td>
                        <td>{doc.name}</td>
                        <td>{doc.fileName ?? "No file uploaded"}</td>
                        <td>{doc.fileName ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="withdraw-section">
              <h2 className="withdraw-section-title">Payment Information</h2>
              <div className="withdraw-grid">
                <Row
                  label="Registration Payment Date"
                  value={payment.date ?? "-"}
                />
                <Row
                  label="Transaction Reference Number"
                  value={payment.transactionRef ?? "-"}
                />
              </div>
            </div>

            <div className="withdraw-section">
              <h2 className="withdraw-section-title">Application Form Status</h2>
              <div className="withdraw-grid">
                <Row label="Last Modified On" value={new Date().toLocaleString("en-IN")} />
                <Row label="Last Modified By" value="FYJC2026-00842" />
                <Row
                  label="Current Status"
                  value={
                    <span className="withdraw-status-verified">Self Verified</span>
                  }
                />
              </div>
            </div>

            <div className="withdraw-action">
              <Button disabled className="withdraw-action-btn">
                Withdraw Application
              </Button>
              <p className="withdraw-footer-note">
                Withdraw Applicant Form will remain disabled until the next
                round begins.
              </p>
            </div>
            <p className="withdraw-copyright">
              &copy; This is the official website of School Education and
              Sports Department. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string | number | React.ReactNode;
}) {
  return (
    <div className="withdraw-row">
      <span className="withdraw-key">{label}</span>
      <span className="withdraw-value">{value}</span>
    </div>
  );
}
