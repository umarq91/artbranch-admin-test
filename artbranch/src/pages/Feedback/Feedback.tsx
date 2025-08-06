import React, { useState } from "react";
import { useFeedback } from "./useFeedback";
import Table from "../../components/TableData/Table";
import Pagination from "../../components/TableData/Pagination";
import EmailModal from "../../components/EmailModal"; 
import { AiOutlineClose } from "react-icons/ai";

const Feedback: React.FC = () => {
  const label = "Feedback";
  const columns = ["Name", "Email", "Message", "Date & Time"];
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
  } = useFeedback();

  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [modalContent, setModalContent] = useState(""); 
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false); 
  const [emailList, setEmailList] = useState<string>(""); 
  const [selectedIds, setSelectedIds] = useState<string[]>([]); 

  // Function to toggle message expansion
  const toggleMessageExpansion = (_index: number, message: string) => {
    setModalContent(message);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  // Function to truncate text
  const truncateText = (text: string, length: number, isExpanded: boolean) => {
    const words = text.split(" ");
    if (isExpanded || words.length <= length) {
      return text;
    }
    return words.slice(0, length).join(" ") + "...";
  };

  // Function to toggle row selection
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Function to handle bulk email click
  const handleBulkEmailClick = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one feedback entry.");
      return;
    }

    // Extract emails of selected rows
    const selectedEmails = rows
      .filter((row) => selectedIds.includes(row.id))
      .map((row) => row.Email);

    setEmailList(selectedEmails.join(", ")); 
    setIsEmailModalOpen(true); 
  };

  // Function to handle single email click
  const handleSingleEmailClick = (email: string) => {
    setEmailList(email); 
    setIsEmailModalOpen(true); 
  };

  // Process rows to include truncated message and "Read More" button
  const processedRows = rows.map((row, index) => {
    return {
      ...row,
      Message: (
        <div>
          <p>{truncateText(row.Message, 7, false)}</p>
          {row.Message.split(" ").length > 7 && (
            <button
              onClick={() => toggleMessageExpansion(index, row.Message)}
              className="text-black-500 underline text-sm mt-1"
            >
              Read More
            </button>
          )}
        </div>
      ),
    };
  });

  return (
    <>
      <Table
        label={label}
        columns={columns}
        data={processedRows}
        onSearchChange={handleSearchChange}
        showSearch={false}
        showStatusFilter={false}
        showViewIcon={false}
        showEditIcon={false}
        showEmailIcon={true} // Enable email icon in the table
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

      {/* EmailModal for sending emails */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        emailAddresses={emailList}
      />

      {/* Modal for full message content */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 w-96 rounded-lg relative overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Feedback</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  document.body.style.overflow = "auto";
                }}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                <AiOutlineClose />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-auto max-h-96">
              <p>{modalContent}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Feedback;