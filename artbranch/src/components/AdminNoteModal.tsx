import React, { useState } from "react";
import { supabase } from "../utils/services/supabase";
import { toast } from "react-toastify";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
}

const AdminNoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  targetUserId,
}) => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitNote = async () => {
    if (!note.trim()) {
      alert("Note cannot be empty.");
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();


    const { error } = await supabase.from("admin_notes").insert({
      content: note,
      user_id: targetUserId,
      admin_id: user?.id,
    });

    setLoading(false);

    if (error) {
      alert("Failed to add note: " + error.message);
    } else {
      toast("Note added successfully!");
      window.location.reload();
      setNote("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-dark p-6 rounded-lg w-96 shadow-xl transition-all transform">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
          Add Admin Note
        </h2>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
        className="w-full bg-light p-3 border border-gray-300 shadow-md rounded-md outline-none text-sm"
          rows={5}
          placeholder="Enter your internal note about this user"
        />

        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={onClose}
            className="bg-light text-black px-4 py-2 rounded-md hover:scale-105 transition-transform"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitNote}
            disabled={loading}
            className="bg-light text-black px-4 py-2 rounded-md hover:scale-105 transition-transform"
          >
            {loading ? "Saving..." : "Save Note"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNoteModal;
