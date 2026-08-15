import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/Login/LoginPage";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { ApplicationFormPage } from "./pages/ApplicationForm/ApplicationFormPage";
import { CapOptionPage } from "./pages/CapOption/CapOptionPage";
import { QuotaPage } from "./pages/Quota/QuotaPage";
import { MiscellaneousPage } from "./pages/Miscellaneous/MiscellaneousPage";
import { CapAdmissionPage } from "./pages/CapAdmission/CapAdmissionPage";
import { PaymentGatewayPage } from "./pages/PaymentGateway/PaymentGatewayPage";
import { ApplicationFormProvider } from "./context/ApplicationFormContext";
import { CapOptionProvider } from "./context/CapOptionContext";

function App() {
  return (
    <ApplicationFormProvider>
      <CapOptionProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/payment-gateway" element={<PaymentGatewayPage />} />
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/application-form"
              element={<ApplicationFormPage />}
            />
            <Route path="/cap-option" element={<CapOptionPage />} />
            <Route path="/quota" element={<QuotaPage />} />
            <Route path="/miscellaneous" element={<MiscellaneousPage />} />
            <Route path="/cap-admission" element={<CapAdmissionPage />} />
          </Route>
        </Routes>
      </CapOptionProvider>
    </ApplicationFormProvider>
  );
}

export default App;
