import { useVerification } from "./useVerificationRequests";
import Table from "../../components/TableData/Table";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Pagination from "../../components/TableData/Pagination";
import EmailModal from "../../components/EmailModal"; 
import { useState } from "react";

const Verification = () => {
  const columns = ["Name", "Username", "Email", "Status"];
  const {
    rows,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    setSelectedVerificationId,
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
  } = useVerification();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false); // State for EmailModal
  const [emailList, setEmailList] = useState<string>(""); // State to store email addresses

  const handleDeleteVerification = (id: any) => {
    setSelectedVerificationId(id);
    setIsDeleteModalOpen(true);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleBulkEmailClick = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one verification request.");
      return;
    }

    // Extract emails of selected rows
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

  return (
    <>
      <Table
        label="Verification List"
        columns={columns}
        data={rows}
        deleteVerification={handleDeleteVerification}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        statusFilter={statusFilter}
        statusOptions={[
          { value: "verified", label: "Verified" },
          { value: "pending", label: "Pending" },
          { value: "rejected", label: "Rejected" },
        ]}
        showViewIcon={true}
        showEditIcon={false}
        loading={loading}
        onBulkEmailClick={handleBulkEmailClick}
        onSingleEmailClick={handleSingleEmailClick}
        toggleSelection={toggleSelection}
        selectedIds={selectedIds}
        showEmailIcon={true} // Enable email icon in the table
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
          itemTitle="Delete Verification"
        />
      )}

      {/* EmailModal for sending emails */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        emailAddresses={emailList}
      />
    </>
  );
};

export default Verification;