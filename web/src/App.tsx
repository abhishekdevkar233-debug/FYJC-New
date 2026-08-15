import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/Login/LoginPage";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { ApplicationFormPage } from "./pages/ApplicationForm/ApplicationFormPage";
import { CapOptionPage } from "./pages/CapOption/CapOptionPage";
import { QuotaPage } from "./pages/Quota/QuotaPage";
import { MiscellaneousPage } from "./pages/Miscellaneous/MiscellaneousPage";
import { CapAdmissionPage } from "./pages/CapAdmission/CapAdmissionPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/application-form" element={<ApplicationFormPage />} />
        <Route path="/cap-option" element={<CapOptionPage />} />
        <Route path="/quota" element={<QuotaPage />} />
        <Route path="/miscellaneous" element={<MiscellaneousPage />} />
        <Route path="/cap-admission" element={<CapAdmissionPage />} />
      </Route>
    </Routes>
  );
}

export default App;
