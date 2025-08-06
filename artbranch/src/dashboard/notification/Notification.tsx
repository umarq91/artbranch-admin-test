import { useEffect, useRef } from "react";
import { FiBell, FiX } from "react-icons/fi";
import { useNotification } from "./useNotification";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const { isOpen, setIsOpen, notifications, latestArtists } = useNotification();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const renderActivitiesBlock = () => (
    <div className="mb-4 flex flex-col items-start md:mt-0 mt-14 bg-dark w-full ">
      <h2 className="font-bold md:text-md mb-2 text-left">Activities</h2>
      <div className="rounded-md p-2 md:text-sm text-xl font-semibold max-h-90 overflow-y-auto">
        {notifications.slice(0, 4).map((item, index) => (
          <div
            key={index}
            className="flex items-center py-1  transition-colors duration-200 ease-in-out hover:bg-light rounded-md px-2 w-full"
          >
            <a
              href={`https://artbranch.com.au/portfolio?post=${item?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full"
              onClick={closeSidebar}
            >
              <img
                src={item.imgSrc}
                alt="Activity"
                className="w-8 h-8 rounded-full mr-2"
              />
              <div className="text-left">
                <div className="md:text-[12px] text-sm">
                  {item.name} {item.message}
                </div>
                {item.time && (
                  <div className="md:text-[10px] text-sm text-gray-400">
                    {item.time}
                  </div>
                )}
              </div>
            </a>
          </div>
        ))}
        <div
          className="text-blue-500 cursor-pointer mt-2"
          onClick={() => {
            navigate("/activities");
            closeSidebar();
          }}
        >
          See All
        </div>
      </div>
    </div>
  );

  const renderLatestArtistsBlock = () => (
    <div className="mb-4 flex flex-col items-start md:mt-0 mt-4 bg-dark w-full">
      <h2 className="font-bold md:text-md mb-2 text-left">Latest Artists</h2>
      <div className="rounded-md p-2 md:text-sm text-xl font-semibold max-h-90 overflow-y-auto">
        {latestArtists.slice(0, 4).map((item, index) => (
          <a
            key={index}
            href={`https://artbranch.com.au/portfolio/${item.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center py-1 cursor-pointer transition-colors duration-200 ease-in-out hover:bg-light rounded-md px-2 w-full"
            onClick={closeSidebar}
          >
            <img
              src={item.imgSrc}
              alt="Artist"
              className="w-8 h-8 rounded-full mr-2"
            />
            <div className="text-left">
              <div className="md:text-[12px] text-sm">{item.name}</div>
              <div className="text-[10px] text-gray-400">{item.email}</div>
              {item.time && (
                <div className="md:text-xs text-md text-gray-400">
                  {item.time}
                </div>
              )}
            </div>
          </a>
        ))}
        <div
          className="text-blue-500 cursor-pointer mt-2"
          onClick={() => {
            navigate("/artist");
            closeSidebar();
          }}
        >
          See All
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Button to togglee notifications */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`notification-btn fixed md:top-4 top-3 md:right-6 right-4 p-1 bg-light text-black border-2 border-black rounded-md focus:outline-none z-50 ${
          isOpen ? "rotate-bell" : ""
        }`}
        aria-label="Toggle Notifications"
      >
        {isOpen ? (
          <FiX size={12} className="font-bold" />
        ) : (
          <FiBell size={12} className="font-bold" />
        )}
      </button>

      {/* Notification Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed md:w-72 w-full top-0 right-0 h-full overflow-hidden overflow-hidden1 overflow-y-auto bg-dark shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 w-full flex flex-wrap flex-col md:items-start items-center border-l-2 border-l-sideBorder  z-50 font-poppins md:mt-14">
          {renderActivitiesBlock()}

          {renderLatestArtistsBlock()}
        </div>
      </div>
    </div>
  );
};

export default Notification;