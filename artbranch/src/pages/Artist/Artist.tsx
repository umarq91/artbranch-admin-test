import { useEffect, useState } from "react";
import { useArtists } from "./useArtists";
import Table from "../../components/TableData/Table";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Pagination from "../../components/TableData/Pagination";
import EmailModal from "../../components/EmailModal";
import { AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Artist = () => {
  const label = "Users list";
  const columns = [
    "Artist Name",
    "Role",
    "Joined on",
    "Categories",
    "Post Code",
    "Email",
    "Recent Note",
    "Status",
  ];
  const {
    rows,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    setSelectedArtistId,
    handleConfirmDelete,
    handleSearchChange,
    currentPage,
    totalPages,
    totalEntries,
    handlePreviousPage,
    handleNextPage,
    handlePageChange,
    statusFilter,
    handleStatusFilterChange,
    itemsPerPage,
    loading,
    handleStatusUpdate,
    handleSelectRoles,
  } = useArtists();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailList, setEmailList] = useState<string>("");

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleBulkEmailClick = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one artist.");
      return;
    }

    const selectedEmails = rows
      .filter((row) => selectedIds.includes(row.id))
      .map((row) => row.Email);

    setEmailList(selectedEmails.join(", "));
    setIsEmailModalOpen(true);
  };

  const handleSingleEmailClick = (email: string) => {
    setEmailList(email);
    setIsEmailModalOpen(true);
  };

  const handleDeleteArtist = (id: any) => {
    setSelectedArtistId(id);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    setSelectedIds([]); // Reset selection when page changes
  }, [currentPage]);
  const router = useNavigate();
  
  return (
    <>
      <Table
        label={label}
        columns={columns}
        data={rows.map((row) => ({
          ...row,
          "Artist Name": (
            <div
            onClick={(e)=>{
              e.stopPropagation();
              router(`/editArtist/${row.id}`);
            }}
            className="flex items-center underline cursor-pointer">
              {row["Artist Name"]}
              {row.is_featured && (
                <AiFillStar size={18} className="text-[#bc893c] ml-2" />
              )}
            </div>
          ),
          Status: (
            <select
              value={row.Status}
              onChange={(e) => handleStatusUpdate(row.id, e.target.value, row["Artist Name"], row.Email)}
              className="p-1 border rounded bg-dark text-sm"
            >
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
              <option value="rejected">Rejected</option>
              <option value="verification_pending">Verification Pending</option>
            </select>
          ),
        }))}
        deleteArtists={handleDeleteArtist}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        statusFilter={statusFilter}
        showViewIcon={true}
        showEditIcon={true}
        showStatusFilter={true}
        editRoute="editArtist"
        loading={loading}
        onBulkEmailClick={handleBulkEmailClick}
        onSingleEmailClick={handleSingleEmailClick}
        handleSelectRoles={handleSelectRoles}
        toggleSelection={toggleSelection}
        selectedIds={selectedIds}
        showEmailIcon={true}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={totalEntries}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        handlePageChange={handlePageChange}
        itemsPerPage={itemsPerPage ?? 0}
      />
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemTitle="Delete Artist"
        />
      )}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        emailAddresses={emailList}
      />
    </>
  );
};

export default Artist;
