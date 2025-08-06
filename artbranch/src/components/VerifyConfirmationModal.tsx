import { useState } from "react";
import { FiCheckCircle, FiX } from "react-icons/fi";

interface VerifyConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userName: string;
}

const VerifyConfirmationModal: React.FC<VerifyConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleConfirm = async () => {
    if (inputValue !== userName) {
      setError(`The text does not match the confirmation: ${userName}`);
      return;
    }

    setIsVerifying(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(
        "An error occurred while processing your request. Please try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md p-6 mx-auto my-8 bg-white rounded-lg shadow-xl transition-all transform duration-300 ease-in-out">
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className="text-center">
          <FiCheckCircle
            className="h-12 w-12 text-green-600 mx-auto"
            aria-hidden="true"
          />
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
            {userName}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Type <strong>{userName}</strong> to confirm your action.
          </p>
        </div>
        <div className="mt-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder={`Type "${userName}" to confirm`}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError("");
            }}
            onPaste={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
          />
        </div>
        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="mt-5 flex justify-center">
          <button
            onClick={handleConfirm}
            className={`bg-green-500 text-white px-4 py-2 rounded transition-transform transform hover:scale-105 ${
              isVerifying ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isVerifying}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyConfirmationModal;
