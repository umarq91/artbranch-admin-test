import { useNavigate } from "react-router-dom";
import { useAdmin } from "./useAdmin";
import Table from "../../components/TableData/Table";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Pagination from "../../components/TableData/Pagination";
import { useState } from "react";

const Admin = () => {
  const navigate = useNavigate();

  const label = "Admin List";
  const columns = ["Admin Name", "Email", "Role"];

  const {
    rows,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    setSelectedAdminId,
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
  } = useAdmin();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleDeleteAdmin = (id: any) => {
    setSelectedAdminId(id);
    setIsDeleteModalOpen(true);
  };

  const handleAddAdmin = () => {
    navigate("/admins/new");
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleBulkEmailClick = (emails: string[]) => {
    if (emails.length === 0) {
      alert("Please select at least one artist.");
      return;
    }
    console.log("Bulk Email to:", emails);
  };

  const handleSingleEmailClick = (email: string) => {
    console.log("Single Email to:", email);
  };

  return (
    <>
      <Table
        label={label}
        columns={columns}
        data={rows}
        deleteArtists={handleDeleteAdmin}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        statusFilter={statusFilter}
        showViewIcon={false}
        showEditIcon={true}
        editRoute="editAdmin"
        showAddButton={true}
        onAddClick={handleAddAdmin}
        showStatusFilter={false}
        loading={loading}
        onBulkEmailClick={handleBulkEmailClick}
        onSingleEmailClick={handleSingleEmailClick}
        toggleSelection={toggleSelection}
        selectedIds={selectedIds}
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
          itemTitle="Delete Admin"
        />
      )}
    </>
  );
};

export default Admin;
