import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Spinner from "../components/Spinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    console.log("COMING HERE")
    // return <Navigate to="/login" replace />;
  }

  if (location.pathname === "/admins" && role !== "SuperAdmin") {
    return <Navigate to="/" replace />;
  }

  if (role === "Admin" && location.pathname === "/admins") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
