import { Link } from "react-router-dom";
import "./DashboardPage.css";

export function DashboardPage() {
  return (
    <div className="dashboard-page">
      <h1>You're signed in</h1>
      <p>This is a placeholder screen for the next page in the FYJC portal.</p>
      <Link className="dashboard-back-link" to="/">
        Back to Sign In
      </Link>
    </div>
  );
}
