import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const useSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string>("overview");
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [monitorOpen, setMonitorOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prevState) => !prevState);
  };

  const setActive = (value: string) => {
    setActiveLink(value);
  };

  const handleLinkClick = (
    onSelect: (value: string) => void,
    value: string,
    closeSidebar: boolean = false
  ) => {
    onSelect(value);
    setActive(value);
    if (closeSidebar) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActiveLink("overview");
    } else if (path.includes("/artist")) {
      setActiveLink("artists");
    } else if (path.includes("/editArtist")) {
      setActiveLink("artists");
    } else if (path.includes("/subscription")) {
      setActiveLink("subscriptions");
    } else if (path.includes("/packages")) {
      setActiveLink("packages");
    } else if (path.includes("/verifications")) {
      setActiveLink("verifications");
    } else if (path.includes("/verificationDetails")) {
      setActiveLink("verifications");
    } else if (path.includes("/activities")) {
      setActiveLink("activities");
    } else if (path.includes("/admins")) {
      setActiveLink("admins");
    } else if (path.includes("/myProfile")) {
      setActiveLink("myProfile");
    } else if(path.includes("/staleArtists")){
      setActiveLink("staleArtists");
    }else if(path.includes("/feedback")){
      setActiveLink("feedback");
    }
  }, [location.pathname]);

  return {
    isOpen,
    activeLink,
    toggleSidebar,
    setActive,
    handleLinkClick,
    dashboardOpen,
    monitorOpen,
    usersOpen,
    profileOpen,
    setDashboardOpen,
    setMonitorOpen,
    setUsersOpen,
    setProfileOpen,
  };
};

export default useSidebar;