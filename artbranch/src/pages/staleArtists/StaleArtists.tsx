import { useState } from "react";
import { useStaleArtists } from "./useStaleArtists";
import Table from "../../components/TableData/Table";
import Pagination from "../../components/TableData/Pagination";
import EmailModal from "../../components/EmailModal";

const SlateArtists = () => {
  const label = "Stale Artist";
  const columns = ["Artist Name", "Categories", "Email", "Date & Time"];
  const {
    rows,
    handleSearchChange,
    currentPage,
    totalPages,
    totalEntries,
    handlePreviousPage,
    handleNextPage,
    handlePageChange,
    itemsPerPage,
    loading,
  } = useStaleArtists();

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailList, setEmailList] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkEmailClick = (emails: string[]) => {
    if (emails.length === 0) {
      alert("Please select at least one email.");
      return;
    }
    setEmailList(emails.join(", "));
    setIsEmailModalOpen(true);
  };

  const handleSingleEmailClick = (email: string) => {
    setEmailList(email);
    setIsEmailModalOpen(true);
  };

  return (
    <>
      <Table
        label={label}
        columns={columns}
        data={rows}
        onSearchChange={handleSearchChange}
        showStatusFilter={false}
        showViewIcon={false}
        showEditIcon={false}
        showEmailIcon={true}
        selectedIds={selectedIds}
        toggleSelection={toggleSelection}
        onBulkEmailClick={handleBulkEmailClick}
        onSingleEmailClick={handleSingleEmailClick}
        loading={loading}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={totalEntries}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        handlePageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
      />

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        emailAddresses={emailList}
      />
    </>
  );
};

export default SlateArtists;
