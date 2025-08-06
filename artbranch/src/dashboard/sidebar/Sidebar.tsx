import React from "react";
import { FiHome, FiMenu, FiX, FiChevronDown, FiFlag } from "react-icons/fi";
import { IoNotificationsCircle } from "react-icons/io5";
import { RxActivityLog } from "react-icons/rx";
import { TbMan } from "react-icons/tb";
import { FaUserCircle } from "react-icons/fa";
import { MdVerified, MdDashboard } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { FaUsersGear } from "react-icons/fa6";
import { RiUserSettingsFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../../auth/AuthContext";
import { FaUserInjured } from "react-icons/fa6";
import { VscFeedback } from "react-icons/vsc";
import useSidebar from "../sidebar/useSidebar";

interface SidebarProps {
  onSelect: (value: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const {
    isOpen,
    activeLink,
    toggleSidebar,
    handleLinkClick,
    dashboardOpen,
    monitorOpen,
    usersOpen,
    profileOpen,
    setDashboardOpen,
    setMonitorOpen,
    setUsersOpen,
    setProfileOpen,
  } = useSidebar();
  const { logout, name, role } = useAuth();

  const isSmallScreen = window.innerWidth < 768; // Adjust the breakpoint as needed

  const links = {
    dashboard: [
      { name: "Overview", icon: <FiHome />, value: "overview" },
      { name: "Users", icon: <TbMan />, value: "artists" },
      {
        name: "Profile Verifications",
        icon: <MdVerified />,
        value: "verifications",
      },
    ],
    monitor: [
      { name: "Activities", icon: <RxActivityLog />, value: "activities" },
      { name: "Stale Artists", icon: <FaUserInjured />, value: "staleArtists" },
      { name: "Post Reports", icon: <FiFlag />, value: "reports" },
      { name: "Feedback", icon: <VscFeedback />, value: "feedback" },


    ],
    users: [{ name: "Admins", icon: <FaUsersGear />, value: "admins" }],
    profiles: [{ name: "My Profile", icon: <FaUser />, value: "myProfile" }],
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="font-poppins">
      <button
        onClick={toggleSidebar}
        className={`fixed top-3 left-4 p-1 bg-light border-2 border-black text-black rounded-md focus:outline-none md:hidden z-50 transition-transform duration-300 ${
          isOpen ? "rotate-90" : "rotate-0"
        }`}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <FiX size={12} /> : <FiMenu size={12} />}
      </button>

      <div
        className={`fixed flex flex-col justify-between bg-dark dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full md:z-50 z-10 top-0 left-0 h-full border-r-2 border-gray-300 dark:border-gray-700 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64`}
      >
        {/* Fixed Logo Section */}
        <div className="flex justify-center items-center p-4 bg-dark dark:bg-gray-900 mb-4">
          <img src="../assets/newLogo.png" alt="Logo" width={110} height={40} />
        </div>

        {/* Scrollable Content Section */}
        <nav className="flex-grow overflow-y-auto overflow-hidden1 dark:text-gray-200">
          <ul className="space-y-4">
            <li className="border-b-2 border-gray-300 dark:border-gray-700 pb-4 px-4">
              <p
                onClick={() => setDashboardOpen(!dashboardOpen)}
                className="flex items-center justify-between cursor-pointer md:text-sm text-2xl font-bold text-[#1C1C1C] dark:text-gray-200 transition"
              >
                <span className="flex items-center space-x-2">
                  <MdDashboard size={20} />
                  <span>Dashboard</span>
                </span>
                <FiChevronDown
                  className={`transform transition-transform ${
                    dashboardOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </p>
              {dashboardOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="space-y-2 mt-2 pl-4"
                >
                  {links.dashboard.map((link, index) => (
                    <motion.li key={index}>
                      <p
                        className={`flex items-center space-x-3 text-gray-700 dark:text-gray-200 whitespace-nowrap hover:bg-light dark:hover:bg-gray-700 p-2 rounded-md cursor-pointer ${
                          activeLink === link.value
                            ? "bg-light dark:bg-gray-700"
                            : ""
                        }`}
                        onClick={() =>
                          handleLinkClick(onSelect, link.value, isSmallScreen)
                        }
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </p>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </li>

            {/* Repeat for other sections (Monitor, Users, Profiles) */}
            <li className="border-b-2 border-gray-300 dark:border-gray-700 pb-4 px-4">
              <p
                onClick={() => setMonitorOpen(!monitorOpen)}
                className="flex items-center justify-between cursor-pointer md:text-sm text-2xl font-bold text-[#1C1C1C] dark:text-gray-200 transition"
              >
                <span className="flex items-center space-x-2">
                  <IoNotificationsCircle size={20} />
                  <span>Monitor</span>
                </span>
                <FiChevronDown
                  className={`transform transition-transform ${
                    monitorOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </p>
              {monitorOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="space-y-2 mt-2 pl-4"
                >
                  {links.monitor.map((link, index) => (
                    <motion.li key={index}>
                      <p
                        className={`flex items-center space-x-3 text-gray-700 dark:text-gray-200 whitespace-nowrap hover:bg-light dark:hover:bg-gray-700 p-2 rounded-md cursor-pointer ${
                          activeLink === link.value
                            ? "bg-light dark:bg-gray-700"
                            : ""
                        }`}
                        onClick={() =>
                          handleLinkClick(onSelect, link.value, isSmallScreen)
                        }
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </p>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </li>

            {/* Similar setup for Users and Profiles sections */}

            {/* users */}
            {role === "SuperAdmin" && (
              <li className="border-b-2 border-gray-300 dark:border-gray-700 pb-4 px-4">
                <p
                  onClick={() => setUsersOpen(!usersOpen)}
                  className="flex items-center justify-between cursor-pointer md:text-sm text-2xl font-bold text-[#1C1C1C] dark:text-gray-200 transition"
                >
                  <span className="flex items-center space-x-2">
                    <RiUserSettingsFill size={20} />
                    <span>Users</span>
                  </span>
                  <FiChevronDown
                    className={`transform transition-transform ${
                      usersOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </p>
                {usersOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="space-y-2 mt-2 pl-4"
                  >
                    {links.users.map((link, index) => (
                      <motion.li key={index}>
                        <p
                          className={`flex items-center space-x-3 text-gray-700 dark:text-gray-200 whitespace-nowrap hover:bg-light dark:hover:bg-gray-700 p-2 rounded-md cursor-pointer ${
                            activeLink === link.value
                              ? "bg-light dark:bg-gray-700"
                              : ""
                          }`}
                          onClick={() =>
                            handleLinkClick(onSelect, link.value, isSmallScreen)
                          }
                        >
                          {link.icon}
                          <span>{link.name}</span>
                        </p>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </li>
            )}
            <li className="border-b-2 border-gray-300 dark:border-gray-700 pb-4 px-4">
              <p
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center justify-between cursor-pointer md:text-sm text-2xl font-bold text-[#1C1C1C] dark:text-gray-200 transition"
              >
                <span className="flex items-center space-x-2">
                  <IoSettings size={20} />
                  <span>Settings</span>
                </span>
                <FiChevronDown
                  className={`transform transition-transform ${
                    profileOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </p>
              {profileOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="space-y-2 mt-2 pl-4"
                >
                  {links.profiles.map((link, index) => (
                    <motion.li key={index}>
                      <p
                        className={`flex items-center space-x-3 text-gray-700 dark:text-gray-200 whitespace-nowrap hover:bg-light dark:hover:bg-gray-700 p-2 rounded-md cursor-pointer ${
                          activeLink === link.value
                            ? "bg-light dark:bg-gray-700"
                            : ""
                        }`}
                        onClick={() =>
                          handleLinkClick(onSelect, link.value, isSmallScreen)
                        }
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </p>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </li>
          </ul>
        </nav>

        {/* Footer */}

        <div className="flex items-center justify-between px-4 py-4 border-t border-gray-300 dark:border-gray-700 bg-dark dark:bg-gray-800">
          <div className="flex items-center space-x-2">
            <FaUserCircle
              size={40}
              className="text-gray-700 dark:text-gray-200"
            />
            <div className="text-gray-700 dark:text-gray-200">
              <p className="font-semibold">{name}</p>
              <p className="text-sm">{role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="transform hover:scale-105 transition"
          >
            <LuLogOut
              size={20}
              className=" text-gray-700 dark:text-gray-200 hover:text-[#FF0000]"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
