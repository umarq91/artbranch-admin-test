import { FiStar } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import {
  BreadcrumbLink,
  ActiveBreadcrumb,
  BreadcrumbSeparator,
} from "../components/Breadcrumb";

const Navbar = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  const isOverviewPage = pathParts[0] === "overview";
  const isArtistPage = pathParts[0] === "artist" && pathParts.length === 1;
  const isEditArtistPage =
    pathParts[0] === "editArtist" && pathParts.length === 2;
  const isVerificationPage =
    pathParts[0] === "verifications" && pathParts.length === 1;
  const isVerificationDetailPage =
    pathParts[0] === "verificationDetails" && pathParts.length === 2;
  const isActivitiesPage =
    pathParts[0] === "activities" && pathParts.length === 1;
  const isAdminPage = pathParts[0] === "admins" && pathParts.length === 1;
  const isEditAdminPage =
    pathParts[0] === "editAdmin" && pathParts.length === 2;
  const isNewAdminPage =
    pathParts[0] === "admins" &&
    pathParts[1] === "new" &&
    pathParts.length === 2;
  const isProfilePage = pathParts[0] === "myProfile";
  const isStaleArtistsPage =
    pathParts[0] === "staleArtists" && pathParts.length === 1;
    const isFeedbackPage =
    pathParts[0] === "feedback" && pathParts.length === 1;

  return (
    <div className="flex md:justify-between md:left-64 justify-center md:fixed fixed items-center px-4 py-4 border-b-2 border-gray-300 w-full z-50 bg-dark shadow-sm">
      <div className="flex items-center">
        <FiStar className="text-gray-500 mr-2" />
        <span className="md:text-lg text-sm flex items-center space-x-2">
          <BreadcrumbLink to="/overview" isActive={isOverviewPage}>
            Dashboard
          </BreadcrumbLink>

          {isOverviewPage && <BreadcrumbSeparator />}
          {isOverviewPage && <ActiveBreadcrumb text="Overview" />}

          {isProfilePage && <BreadcrumbSeparator />}
          {isProfilePage && <ActiveBreadcrumb text="My Profile" />}

          {isArtistPage && (
            <>
              <BreadcrumbSeparator />
              <ActiveBreadcrumb text="Users" />
            </>
          )}

          {isEditArtistPage && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbLink 
               to="/artist"
               isActive={false}
               >
               Users
              </BreadcrumbLink>
              <BreadcrumbSeparator />
              <ActiveBreadcrumb text="Edit User" />
            </>
          )}

          {isVerificationPage && (
            <>
              <BreadcrumbSeparator />
              <ActiveBreadcrumb text="Verification" />
            </>
          )}

          {isVerificationDetailPage && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbLink to="/verifications" isActive={false}>
                Verification
              </BreadcrumbLink>
              <BreadcrumbSeparator />
              <ActiveBreadcrumb text="Verification Details" />
            </>
          )}

          {isActivitiesPage && <BreadcrumbSeparator />}
          {isActivitiesPage && <ActiveBreadcrumb text="Activities" />}

          {isStaleArtistsPage && <BreadcrumbSeparator />}
          {isStaleArtistsPage && <ActiveBreadcrumb text="Stale Artists" />}
          {isFeedbackPage && <BreadcrumbSeparator />}
          {isFeedbackPage && <ActiveBreadcrumb text="Feedback" />}
          {isAdminPage && <BreadcrumbSeparator />}
          {isEditAdminPage && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbLink to="/admins" isActive={false}>
                Admin
              </BreadcrumbLink>
              <BreadcrumbSeparator />
              <ActiveBreadcrumb text="Edit Admin" />
            </>
          )}
          {isAdminPage && <ActiveBreadcrumb text="Admins" />}
          {/* {isAdminPage && <BreadcrumbSeparator />} */}
          {isNewAdminPage && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbLink to="/admins" isActive={false}>
                Admins
              </BreadcrumbLink>
              <BreadcrumbSeparator />
              <ActiveBreadcrumb text="New Admin" />
            </>
          )}
        </span>
      </div>

      {/* Search bar */}
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="rounded-md px-2 py-1 mr-2 text-sm outline-none md:block hidden bg-gray-100 border border-gray-300 focus:border-indigo-500"
        />
      </div>
    </div>
  );
};

export default Navbar;
