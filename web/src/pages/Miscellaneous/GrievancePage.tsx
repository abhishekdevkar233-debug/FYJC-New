import { useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { SelectField } from "../../components/ui/SelectField";
import { DISTRICT_OPTIONS } from "../../data/juniorColleges";
import "../ApplicationForm/ApplicationFormPage.css";
import "../CapOption/CapOptionPage.css";
import "./MiscellaneousPage.css";

interface Grievance {
  ticketId: string;
  title: string;
  createdDate: string;
  resolvedDate: string | null;
  status: "PENDING" | "RESOLVED";
  resolution: string;
  name: string;
  district: string;
  block: string;
  region: string;
}

const DEFAULT_GRIEVANCES: Grievance[] = [
  {
    ticketId: "CBSE00012859-4599",
    title: "Merit List Query",
    createdDate: "16/05/2026 09:23:17",
    resolvedDate: null,
    status: "PENDING",
    resolution: "",
    name: "Abhishek Devkar",
    district: "Sangli",
    block: "Sangli Miraj Kupwad M. Corporation (273510)",
    region: "Kolhapur",
  },
  {
    ticketId: "CBSE00012859-1",
    title: "Technical Query",
    createdDate: "09/04/2026 18:47:16",
    resolvedDate: "10/04/2026 11:02:40",
    status: "RESOLVED",
    resolution: "Issue resolved by helpdesk team.",
    name: "Abhishek Devkar",
    district: "Pune",
    block: "Akurdi (272520)",
    region: "Pune",
  },
];

export function GrievancePage() {
  const [grievances, setGrievances] = useState<Grievance[]>(DEFAULT_GRIEVANCES);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewing, setViewing] = useState<Grievance | null>(null);
  const [title, setTitle] = useState("");
  const [district, setDistrict] = useState(DISTRICT_OPTIONS[0]);
  const [block, setBlock] = useState("");
  const [region, setRegion] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return grievances;
    return grievances.filter(
      (g) =>
        g.title.toLowerCase().includes(q) || g.ticketId.toLowerCase().includes(q),
    );
  }, [grievances, search]);

  function resetForm() {
    setTitle("");
    setDistrict(DISTRICT_OPTIONS[0]);
    setBlock("");
    setRegion("");
  }

  function handleAddGrievance() {
    if (!title.trim()) return;
    const ticketId = `CBSE00012859-${grievances.length + 1}`;
    const newGrievance: Grievance = {
      ticketId,
      title: title.trim(),
      createdDate: new Date().toLocaleString("en-IN"),
      resolvedDate: null,
      status: "PENDING",
      resolution: "",
      name: "Abhishek Devkar",
      district,
      block: block.trim() || "-",
      region: region.trim() || "-",
    };
    setGrievances((prev) => [newGrievance, ...prev]);
    resetForm();
    setModalOpen(false);
  }

  return (
    <div className="app-form-page">
      <div className="app-form-shell">
        <div className="app-form-card">
          <div className="app-form-section">
            <div className="grievance-toolbar">
              <h1>Grievance List</h1>
              <div className="grievance-toolbar-actions">
                <TextField
                  className="ux4g-field--tight grievance-search"
                  label="Search"
                  placeholder="Search by title or ticket ID"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={() => setModalOpen(true)}>+ Add Grievance</Button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <p className="misc-empty-note">No grievances found.</p>
            ) : (
              <div className="misc-table-wrap">
                <table className="misc-table">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Ticket Id</th>
                      <th>Title</th>
                      <th>Created Date</th>
                      <th>Resolved Date</th>
                      <th>Status</th>
                      <th>Resolution</th>
                      <th>Name</th>
                      <th>District</th>
                      <th>Block / Tehsil / Taluka</th>
                      <th>Region</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((g, index) => (
                      <tr key={g.ticketId}>
                        <td>{index + 1}</td>
                        <td className="misc-table-mono">{g.ticketId}</td>
                        <td>{g.title}</td>
                        <td>{g.createdDate}</td>
                        <td>{g.resolvedDate ?? "-"}</td>
                        <td>
                          <span
                            className={`misc-tag ${g.status === "RESOLVED" ? "misc-tag--success" : "misc-tag--pending"}`}
                          >
                            {g.status}
                          </span>
                        </td>
                        <td>{g.resolution || "-"}</td>
                        <td>{g.name}</td>
                        <td>{g.district}</td>
                        <td>{g.block}</td>
                        <td>{g.region}</td>
                        <td>
                          <div className="quota-doc-actions">
                            <button
                              type="button"
                              className="misc-icon-btn"
                              aria-label={`View ${g.title}`}
                              onClick={() => setViewing(g)}
                            >
                              <EyeIcon />
                            </button>
                            {g.status === "PENDING" && (
                              <button
                                type="button"
                                className="misc-icon-btn"
                                aria-label={`Edit ${g.title}`}
                              >
                                <EditIcon />
                              </button>
                            )}
                          </div>
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

      {modalOpen && (
        <div className="cap-modal-overlay" role="dialog" aria-modal="true">
          <div className="cap-modal">
            <h3>Add Grievance</h3>
            <div className="grievance-form-grid">
              <TextField
                className="ux4g-field--tight"
                label="Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <SelectField
                className="ux4g-field--tight"
                label="District"
                options={DISTRICT_OPTIONS}
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
              <TextField
                className="ux4g-field--tight"
                label="Block / Tehsil / Taluka"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
              />
              <TextField
                className="ux4g-field--tight"
                label="Region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </div>
            <div className="cap-modal-actions">
              <Button
                variant="secondary"
                onClick={() => {
                  resetForm();
                  setModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button disabled={!title.trim()} onClick={handleAddGrievance}>
                Submit Grievance
              </Button>
            </div>
          </div>
        </div>
      )}

      {viewing && (
        <div
          className="cap-modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setViewing(null)}
        >
          <div className="cap-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{viewing.title}</h3>
            <dl className="cap-details-list">
              <div>
                <dt>Ticket Id</dt>
                <dd>{viewing.ticketId}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{viewing.status}</dd>
              </div>
              <div>
                <dt>Created Date</dt>
                <dd>{viewing.createdDate}</dd>
              </div>
              <div>
                <dt>Resolved Date</dt>
                <dd>{viewing.resolvedDate ?? "-"}</dd>
              </div>
              <div>
                <dt>Resolution</dt>
                <dd>{viewing.resolution || "Pending review"}</dd>
              </div>
              <div>
                <dt>District</dt>
                <dd>{viewing.district}</dd>
              </div>
              <div>
                <dt>Block / Taluka</dt>
                <dd>{viewing.block}</dd>
              </div>
              <div>
                <dt>Region</dt>
                <dd>{viewing.region}</dd>
              </div>
            </dl>
            <div className="cap-modal-actions">
              <Button variant="secondary" onClick={() => setViewing(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
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

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
