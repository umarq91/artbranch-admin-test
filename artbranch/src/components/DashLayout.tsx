import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
// import Sidebar from "../dashboard/Sidebar/Sidebar";
// import Notification from "../dashboard/Notification/Notification";
import Navbar from "../dashboard/Navbar";
import { useAuth } from "../auth/AuthContext";
import Sidebar from "../dashboard/sidebar/Sidebar";
import Notification from "../dashboard/notification/Notification";

const DashLayout: React.FC = () => {
  const { role } = useAuth();

  const navigate = useNavigate();

  const handleSelect = (value: string) => {
    switch (value) {
      case "overview":
        navigate("/overview");
        break;
      case "subscriptions":
        navigate("/subscription");
        break;
      case "artists":
        navigate("/artist");
        break;
      case "reports":
        navigate("/reports");
        break;
      case "feedback":
        navigate("/feedback");
        break;
      case "approvals":
        navigate("/approvals");
        break;
      case "packages":
        navigate("/packages");
        break;
      case "verifications":
        navigate("/verifications");
        break;
      case "activities":
        navigate("/activities");
        break;
      case "staleArtists":
        navigate("/staleArtists");
        break;

      case "admins":
        if (role === "SuperAdmin") {
          navigate("/admins");
        } else {
          alert("Access denied: Only SuperAdmins can access this route.");
        }
        break;
      case "admins/new":
        if (role === "SuperAdmin") {
          navigate("/admins/new");
        } else {
          alert("Access denied: Only SuperAdmins can access this route.");
        }
        break;
      case "myProfile":
        navigate("/myProfile");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="flex flex-wrap font-poppins">
      <Navbar />
      <div>
        <Sidebar onSelect={handleSelect} />
      </div>
      <div className="absolute md:left-64 left-0 right-0">
        <Outlet />
      </div>
      <Notification />
    </div>
  );
};

export default DashLayout;
