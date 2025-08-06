import React, { useState, useEffect } from "react";
import { triggerArtistMessage } from "../utils/services/emailService";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailAddresses: string;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, emailAddresses }) => {
  const [email, setEmail] = useState<string>(emailAddresses);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setEmail(emailAddresses);
  }, [emailAddresses]);

  useEffect(() => {
    if (!email) {
      onClose();
    }
  }, [email, onClose]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleRemoveEmail = () => {
    setEmail("");
  };

  const handleSendEmail = async () => {
    if (!message.trim()) {
      alert("Message cannot be empty.");
      return;
    }

    const result = await triggerArtistMessage(email, message);

    if (result.success) {
      alert(`Email sent to ${email}`);
      onClose();
    } else {
      alert("Failed to send email: " + result.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center shadow-md z-50">
      <div className="bg-dark p-6 rounded-lg w-96 shadow-xl transform transition-all">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
          Send Email
        </h2>

        {/* Display Email Address */}
        <div className="mb-4">
          {email && (
            <div
              className="w-full overflow-y-auto border border-gray-300 rounded-md p-2 bg-light shadow-md"
            >
              <div
                className="flex items-center justify-between bg-dark px-2 py-1 rounded-full shadow-sm border border-gray-300"
              >
                <span className="text-[9px] text-gray-700">{email}</span>
                <button
                  onClick={handleRemoveEmail}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  &#10005;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message Body */}
        <textarea
          value={message}
          onChange={handleMessageChange}
          className="w-full bg-light p-3 border border-gray-300 shadow-md rounded-md outline-none"
          rows={5}
          placeholder="Enter your message"
        ></textarea>

        {/* Buttons */}
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={onClose}
            className="bg-light text-black px-4 py-2 rounded-md transition-transform transform hover:scale-105"
          >
            Close
          </button>
          <button
            onClick={handleSendEmail}
            className="bg-light text-black px-4 py-2 rounded-md transition-transform transform hover:scale-105"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
