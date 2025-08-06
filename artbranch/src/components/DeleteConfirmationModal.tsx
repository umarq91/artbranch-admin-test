import { useState } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle: string;
}
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemTitle,
}: ConfirmationModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const handleConfirm = async () => {
    if (inputValue !== itemTitle) {
      setError(`The text does not match the item name: ${itemTitle}`);
      return;
    }
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError("An error occurred while deleting. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md p-6 mx-auto my-8 bg-white rounded-lg shadow-xl transition-all transform duration-300 ease-in-out">
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
            aria-label="Close"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <FiAlertTriangle
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3
              className="text-lg leading-6 font-medium text-gray-900"
              id="modal-title"
            >
              Confirm Delete
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Please type{" "}
                <strong style={{ userSelect: "none" }}>{itemTitle}</strong> to
                confirm the deletion. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        {/* Input for item title confirmation */}
        <div className="mt-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder={`Type "${itemTitle}" to confirm`}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError("");
            }}
          />
        </div>
        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleConfirm}
          >
            {isDeleting ? "Deleting..." : "Confirm"}
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirmationModal;
