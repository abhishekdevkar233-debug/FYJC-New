import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/Login/LoginPage";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { ApplicationFormPage } from "./pages/ApplicationForm/ApplicationFormPage";
import { CapOptionPage } from "./pages/CapOption/CapOptionPage";
import {
  InHouseQuotaPage,
  MinorityQuotaPage,
  ManagementQuotaPage,
} from "./pages/Quota/QuotaCollegePage";
import { QuotaDocumentsPage } from "./pages/Quota/QuotaDocumentsPage";
import { QuotaTimelinePage } from "./pages/Quota/QuotaTimelinePage";
import { PaymentHistoryPage } from "./pages/Miscellaneous/PaymentHistoryPage";
import { GrievancePage } from "./pages/Miscellaneous/GrievancePage";
import { WithdrawApplicationPage } from "./pages/Miscellaneous/WithdrawApplicationPage";
import { CapAllotmentStatusPage } from "./pages/CapAdmission/CapAllotmentStatusPage";
import { CapAdmissionSummaryPage } from "./pages/CapAdmission/CapAdmissionSummaryPage";
import { WhatsAppPrototypePage } from "./pages/WhatsApp/WhatsAppPrototypePage";
import { PaymentGatewayPage } from "./pages/PaymentGateway/PaymentGatewayPage";
import { ApplicationFormProvider } from "./context/ApplicationFormContext";
import { CapOptionProvider } from "./context/CapOptionContext";
import { QuotaProvider } from "./context/QuotaContext";
import { LanguageProvider } from "./context/LanguageContext";
import { PortalStyleProvider } from "./context/PortalStyleContext";

function App() {
  return (
    <PortalStyleProvider>
      <LanguageProvider>
        <ApplicationFormProvider>
          <CapOptionProvider>
            <QuotaProvider>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/payment-gateway" element={<PaymentGatewayPage />} />
                <Route path="/whatsapp" element={<WhatsAppPrototypePage />} />
                <Route element={<AppShell />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route
                    path="/application-form"
                    element={<ApplicationFormPage />}
                  />
                  <Route path="/cap-option" element={<CapOptionPage />} />
                  <Route path="/quota" element={<Navigate to="/quota/in-house" replace />} />
                  <Route path="/quota/in-house" element={<InHouseQuotaPage />} />
                  <Route path="/quota/minority" element={<MinorityQuotaPage />} />
                  <Route path="/quota/management" element={<ManagementQuotaPage />} />
                  <Route path="/quota/documents" element={<QuotaDocumentsPage />} />
                  <Route path="/quota/timeline" element={<QuotaTimelinePage />} />
                  <Route
                    path="/miscellaneous"
                    element={<Navigate to="/miscellaneous/payment-history" replace />}
                  />
                  <Route
                    path="/miscellaneous/payment-history"
                    element={<PaymentHistoryPage />}
                  />
                  <Route path="/miscellaneous/grievance" element={<GrievancePage />} />
                  <Route
                    path="/miscellaneous/withdraw-application"
                    element={<WithdrawApplicationPage />}
                  />
                  <Route
                    path="/cap-admission"
                    element={<Navigate to="/cap-admission/status" replace />}
                  />
                  <Route
                    path="/cap-admission/status"
                    element={<CapAllotmentStatusPage />}
                  />
                  <Route
                    path="/cap-admission/summary"
                    element={<CapAdmissionSummaryPage />}
                  />
                </Route>
              </Routes>
            </QuotaProvider>
          </CapOptionProvider>
        </ApplicationFormProvider>
      </LanguageProvider>
    </PortalStyleProvider>
  );
}

export default App;
