import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  handlePageChange: (page: number) => void;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalEntries,
  handlePreviousPage,
  handleNextPage,
  handlePageChange,
  itemsPerPage,
}) => {
  const maxButtons = 3;
  const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

  const getPageButtons = () => {
    const pages: number[] = [];
    const halfButtons = Math.floor(maxButtons / 2);

    let start = Math.max(currentPage - halfButtons, 1);
    let end = Math.min(currentPage + halfButtons, totalPages);

    if (currentPage <= halfButtons) {
      end = Math.min(maxButtons, totalPages);
    } else if (currentPage + halfButtons >= totalPages) {
      start = Math.max(totalPages - maxButtons + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageButtons = getPageButtons();

  return (
    <div className="flex justify-between items-center mt-4 bg-light px-4 py-3 rounded-2xl shadow-md mx-4 mb-4">
      <div className="text-xs">
        Showing {endEntry} of {totalEntries} entries
      </div>

      <div className="flex space-x-2 items-center">
        {/* Previous Page Button */}
        <button
          onClick={handlePreviousPage}
          className={`p-2 rounded-sm ${
            currentPage === 1
              ? "bg-light text-black cursor-not-allowed"
              : "bg-black text-white"
          }`}
          disabled={currentPage === 1}
        >
          <FiChevronLeft />
        </button>

        {/* Page Buttons */}
        {pageButtons.map((page) => (
          <button
            key={page}
            onClick={() => {
              if (page !== currentPage) {
                handlePageChange(page);
              }
            }}
            className={`px-3 py-1 rounded-sm ${
              currentPage === page
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Last Page Button (Show Total Pages) */}
        {pageButtons[pageButtons.length - 1] < totalPages && (
          <>
            {pageButtons[pageButtons.length - 1] < totalPages - 1 && (
              <span>...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-1 rounded-sm bg-gray-200 text-black"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Page Button */}
        <button
          onClick={handleNextPage}
          className={`p-2 rounded-sm ${
            currentPage === totalPages
              ? "bg-light text-black cursor-not-allowed"
              : "bg-black text-white"
          }`}
          disabled={currentPage === totalPages}
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
