import React, { useEffect, useRef, useState } from "react";
import TableRow from "./TableRow";
import useTable from "./useTable";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { useAuth } from "../../auth/AuthContext";
import { FiMail } from "react-icons/fi";

interface TableProps {
  label: string;
  columns: string[];
  data: any[];
  deleteArtists?: (id: string[]) => void;
  deleteVerification?: (id: string[]) => void;
  deleteActivities?: (id: string[]) => void;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusFilterChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSelectRoles?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  roleFilter?: string;
  statusFilter?: string;
  isfeaturedFilter?: string;
  statusOptions?: { value: string; label: string }[];
  showSearch?: boolean;
  showStatusFilter?: boolean;
  showViewIcon?: boolean;
  showEmailIcon?: boolean;
  showEditIcon?: boolean;
  showAddButton?: boolean;
  showFeaturedDropdown?: boolean;
  onFeaturedChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddClick?: () => void;
  loading?: boolean;
  editRoute?: string;
  showPostDropdown?: boolean;
  onPostChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onTypeFilterChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  typeFilter?: string;
  typeOptions?: { value: string; label: string }[];
  showEmailButton?: boolean;
  onEmailButtonClick?: () => void;
  onBulkEmailClick: (emails: string[]) => void;
  toggleSelection: (id: string) => void;
  onSingleEmailClick: (email: string) => void;
  selectedIds: string[];
}

const Table: React.FC<TableProps> = ({
  label,
  columns,
  data,
  deleteArtists,
  deleteVerification,
  deleteActivities,
  onSearchChange,
  onStatusFilterChange,
  statusFilter = "",
  statusOptions = [
    { value: "active", label: "Active" },
    { value: "disabled", label: "Disabled" },
    { value: "verification_pending", label: "Verification Pending" },
    { value: "rejected", label: "Rejected" },
    // { value: "featured", label: "Featured" },
  ],
  roleFilter,
  showSearch = true,
  showStatusFilter = true,
  showViewIcon = false,
  showEditIcon = false,
  showAddButton = false,
  onAddClick,
  editRoute,
  showPostDropdown = false,
  showEmailIcon = false,
  onBulkEmailClick,
  onSingleEmailClick,
  handleSelectRoles,
  onPostChange,
  showFeaturedDropdown = false,
  onFeaturedChange,

  loading = false,
}) => {
  const {
    currentItems,
    selectedIds,
    toggleSelection,
    handleDeleteAll,
    toggleSelectAll,
  } = useTable({
    rows: data,
    deleteArtists,
    deleteVerification,
    deleteActivities,
  });
  const { role } = useAuth();
  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  const [showSelectCheckboxes, setShowSelectCheckboxes] = useState(false);

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = false;
    }
  }, [selectedIds, data.length]);

  const handleBulkEmail = () => {
    const selectedEmails = data
      .filter((row) => selectedIds.includes(row.id))
      .map((row) => row.Email);
    onBulkEmailClick(selectedEmails);
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center md:mt-20 mt-16 gap-3 bg-light px-4 py-3 rounded-2xl shadow-md mx-4 font-poppins">
        <div className="md:text-lg text-md font-semibold">{label}</div>

        <div className="flex items-center space-x-2 md:space-x-4 flex-wrap">
          {selectedIds.length > 0 && (
            <div className="md:block hidden">
              {showEmailIcon ? (
                <button
                  onClick={handleBulkEmail}
                  className="bg-light text-black px-3 py-1 rounded-md"
                >
                  <FiMail size={20} />
                </button>
              ) : (
                <button
                  onClick={handleDeleteAll}
                  className="bg-light text-black px-3 py-1 rounded-md"
                >
                  <MdOutlineDeleteSweep size={20} />
                </button>
              )}
            </div>
          )}

          {!(role === "Admin" && deleteArtists) && (
            <button
              onClick={() => {
                if (showSelectCheckboxes && selectedIds.length === 0) {
                  setShowSelectCheckboxes(false);
                } else if (showSelectCheckboxes && selectedIds.length > 0) {
                  toggleSelectAll(false);
                  setShowSelectCheckboxes(false);
                } else {
                  setShowSelectCheckboxes(true);
                }
              }}
              className={`px-4 py-1 rounded-md text-sm transition-all 
      ${
        showSelectCheckboxes && selectedIds.length > 0
          ? "bg-light text-black border-2 border-red-800"
          : "bg-light text-black"
      }`}
            >
              {showSelectCheckboxes && selectedIds.length > 0
                ? `Unselect (${selectedIds.length})`
                : "Select"}
            </button>
          )}

          <select
            value={roleFilter}
            onChange={handleSelectRoles}
            className="bg-light border border-gray-300 text-[12px] px-4 py-1 rounded-md md:w-48 w-32 cursor-pointer"
          >
            {["All Roles", "Artist", "Audience"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* Status filter dropdown */}
          {showStatusFilter && (
            <select
              value={statusFilter}
              onChange={onStatusFilterChange}
              className="bg-light border border-gray-300 text-[12px] px-4 py-1 rounded-md md:w-48 w-32 cursor-pointer"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {showPostDropdown && (
            <select
              onChange={onPostChange}
              className="bg-light border border-gray-300 text-[12px] px-4 py-1 rounded-md md:w-48 w-32 cursor-pointer"
            >
              <option value="">All Posts</option>
              <option value="new post">New</option>
              <option value="update post">Updated</option>
            </select>
          )}

          {showFeaturedDropdown && (
            <select
              onChange={onFeaturedChange}
              className="bg-light border border-gray-300 text-[12px] px-4 py-1 rounded-md md:w-48 w-32 cursor-pointer"
            >
              <option value="">All Artists</option>
              <option value="true">Featured Artists</option>
            </select>
          )}

          {showAddButton && (
            <button
              onClick={onAddClick}
              className="bg-light text-black px-4 py-1 rounded-md text-sm transition-transform transform hover:scale-105"
            >
              Add New Admin
            </button>
          )}

          {/* Search input */}
          {showSearch && (
            <input
              type="text"
              placeholder="Search..."
              className="rounded-md px-2 py-1 text-sm bg-light md:w-48 w-32"
              onChange={onSearchChange}
            />
          )}

          {selectedIds.length > 0 && (
            <div className="block md:hidden">
              <button
                onClick={handleDeleteAll}
                className="bg-light text-black p-1 rounded-md"
              >
                <MdOutlineDeleteSweep size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto overflow-hidden1 shadow-md rounded-2xl mx-4 ">
        <table className="w-full text-sm md:text-lg text-left text-gray-500 bg-light">
          <thead className="text-xs text-[#B5B7C0] ">
            <tr>
              {/* Checkbox for selecting all rows */}
              {showSelectCheckboxes && (
                <th className="px-3 py-3">
                  <input
                    ref={headerCheckboxRef}
                    type="checkbox"
                    className={`w-4 h-4 cursor-pointer ${
                      deleteArtists
                        ? "opacity-0 pointer-events-none"
                        : "opacity-100"
                    }`}
                    onChange={() => {
                      toggleSelectAll();
                    }}
                    checked={
                      selectedIds.length === data.length && data.length > 0
                    }
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th key={index} className="px-3 py-3 whitespace-nowrap ">
                  {column}
                </th>
              ))}
              {(showEditIcon ||
                showViewIcon ||
                showEmailIcon ||
                deleteArtists ||
                deleteActivities) && <th className="px-3 py-3">Action</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-6">
                  <div className="flex justify-center items-center">
                    <div className="border-gray-300 h-8 w-8 animate-spin rounded-full border-4 border-t-blue-600" />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-6">
                  No Data Found
                </td>
              </tr>
            ) : currentItems.length ? (
              currentItems.map((rowData, index) => (
                <TableRow
                  key={index}
                  rowData={rowData}
                  columns={columns}
                  deleteArtist={
                    deleteArtists
                      ? () => deleteArtists([rowData.id])
                      : undefined
                  }
                  deleteVerification={
                    deleteVerification
                      ? () => deleteVerification([rowData.id])
                      : undefined
                  }
                  deleteActivities={
                    deleteActivities
                      ? () => deleteActivities([rowData.id])
                      : undefined
                  }
                  toggleSelection={toggleSelection}
                  selectedIds={selectedIds}
                  showViewIcon={showViewIcon}
                  showEditIcon={showEditIcon}
                  showEmailIcon={showEmailIcon}
                  editRoute={editRoute}
                  showSelectCheckboxes={showSelectCheckboxes}
                  onSingleEmailClick={onSingleEmailClick}
                />
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-6">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
