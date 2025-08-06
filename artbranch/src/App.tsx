import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashLayout from "./components/DashLayout";
import Subscription from "./pages/Subscription/Subscription";
import Artists from "./pages/Artist/Artist";
import Packages from "./pages/Packages/Packages";
import Overview from "./pages/Overview/Overview";
import EditArtist from "./pages/Artist/EditArtists/EditArtists";
import LogIn from "./pages/Login/Login";
import ProtectedRoute from "../src/auth/ProtectedRoute";
import VerificationRequests from "./pages/Verification/VerificationRequests";
import DetailsPage from "./pages/Verification/DetailVerification/DetailsPage";
import Activities from "./pages/Activities/Activities";
import Admin from "./pages/Users/Admin";
import NewAdmin from "./pages/Users/create/NewAdmin";
import EditAdmin from "./pages/Users/edit/EditAdmin";
import Profile from "./pages/myProfile/Profile";
import StaleArtists from "./pages/staleArtists/StaleArtists";
import Feedback from "./pages/Feedback/Feedback";
import UserReports from "./pages/reports/Reports";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          element={
            <ProtectedRoute>
              <DashLayout />
            </ProtectedRoute>
          }
        >
          {/* Accessible to both Admin and SuperAdmin */}
          <Route path="subscription" element={<Subscription />} />
          <Route path="artist" element={<Artists />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/editArtist/:id" element={<EditArtist />} />
          <Route path="packages" element={<Packages />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="verifications" element={<VerificationRequests />} />
          <Route path="/myProfile" element={<Profile />} />
          <Route path="/staleArtists" element={<StaleArtists />} />
          <Route
            path="/verificationDetails/:user_id"
            element={<DetailsPage />}
          />
          <Route path="/activities" element={<Activities />} />
          <Route path="/reports" element={<UserReports />} />

          {/* Accessible only to SuperAdmin */}
          <Route path="/admins" element={<Admin />} />
          <Route path="/admins/new" element={<NewAdmin />} />
          <Route path="/editAdmin/:id" element={<EditAdmin />} />
        </Route>
        <Route path="/login" element={<LogIn />} />
         
      </Routes>
    </Router>
  );
}
