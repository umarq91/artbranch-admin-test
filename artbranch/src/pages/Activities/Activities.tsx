import { useActivities } from "./useActivities";
import Table from "../../components/TableData/Table";
import Pagination from "../../components/TableData/Pagination";
import { useState } from "react";

const Activities = () => {
  const label = "Activities List";
  const columns = ["Artist Name", "Type", "Message", "Date & Time"];

  const {
    activities,
    currentPage,
    totalPages,
    totalEntries,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
    itemsPerPage,
    loading,
    setSearchTerm,
    deleteActivitiesDirectly,
    fetchActivities,
  } = useActivities();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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

  const handleDeleteDirectly = (ids: string[]) => {
    deleteActivitiesDirectly(ids);
  };

  const handlePostChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPostType = e.target.value;
    fetchActivities(currentPage, selectedPostType);
  };


  return (
    <>
      <Table
        label={label}
        columns={columns}
        data={activities}
        deleteActivities={handleDeleteDirectly}
        showSearch={true}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        showStatusFilter={false}
        showViewIcon={true}
        loading={loading}
        showPostDropdown={true}
        onPostChange={handlePostChange}
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
    </>
  );
};

export default Activities;
