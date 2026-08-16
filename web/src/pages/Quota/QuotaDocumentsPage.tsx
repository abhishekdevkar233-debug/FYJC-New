import { useQuota } from "../../context/QuotaContext";
import "../ApplicationForm/ApplicationFormPage.css";
import "./QuotaPage.css";

export function QuotaDocumentsPage() {
  const { documents, setDocumentFile, removeDocumentFile } = useQuota();

  return (
    <div className="app-form-page">
      <div className="app-form-shell">
        <div className="app-form-card">
          <div className="app-form-card-head">
            <h1>Upload Document</h1>
          </div>

          <div className="app-form-section">
            <div className="app-form-callout cap-callout--warn">
              <InfoIcon />
              <span>Kindly upload all the required documents for admission.</span>
            </div>

            <p className="quota-file-info">
              <strong>File Types Allowed:</strong> jpg, jpeg, png, pdf &middot;{" "}
              <strong>Maximum File Size Allowed:</strong> 1MB
            </p>

            <div className="quota-doc-table-wrap">
              <table className="quota-doc-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Document Name</th>
                    <th>File</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, index) => (
                    <tr key={doc.name}>
                      <td>
                        <span className="quota-doc-num">{index + 1}</span>
                      </td>
                      <td className="quota-doc-name-cell">
                        {doc.name}
                        {doc.required && <span className="app-form-required">*</span>}
                        {doc.sampleFormat && (
                          <button type="button" className="quota-doc-sample-link">
                            Download Sample Format
                          </button>
                        )}
                      </td>
                      <td className="quota-doc-file-cell">
                        {doc.fileName ? (
                          <span className="quota-doc-uploaded">
                            <CheckIcon /> {doc.fileName}
                          </span>
                        ) : (
                          <label className="quota-doc-drop">
                            <UploadIcon /> Choose File
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              className="quota-doc-file-input"
                              onChange={(e) =>
                                setDocumentFile(index, e.target.files?.[0]?.name)
                              }
                            />
                          </label>
                        )}
                      </td>
                      <td>
                        {doc.fileName ? (
                          <div className="quota-doc-actions">
                            <button
                              type="button"
                              className="cap-icon-btn"
                              aria-label={`View ${doc.name}`}
                            >
                              <EyeIcon />
                            </button>
                            <button
                              type="button"
                              className="cap-icon-btn cap-icon-btn--danger"
                              aria-label={`Remove ${doc.name}`}
                              onClick={() => removeDocumentFile(index)}
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        ) : (
                          <span className="quota-doc-status">Not uploaded</span>
                        )}
                      </td>
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

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 16V4M7 9l5-5 5 5M4 20h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
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
