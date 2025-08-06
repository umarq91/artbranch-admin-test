import { useEffect, useState } from "react";
import { supabase } from "../utils/services/supabase";
import { BiTrash } from "react-icons/bi";

interface AdminNotesListProps {
  userId: string;
}

type AdminNote = {
  id: string;
  content: string;
  created_at: string;
  admin_id: string;
  profiles: {
    full_name: string;
  };
};

export default function AdminNotesList({ userId }: AdminNotesListProps) {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSuperAdmin, setSuperAdmin] = useState(false);

  // Fetch current user role
  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (user && !userError) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        console.log("Profile Role:", profile?.role);
        if (!profileError && profile?.role === "SuperAdmin") {
          setSuperAdmin(true);
        }
      }
    };

    checkRole();
  }, []);

  // Fetch admin notes
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("admin_notes")
        .select("id, content, created_at, admin_id, profiles:admin_id(full_name)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setNotes(data as any);
      }
      setLoading(false);
    };

    if (userId) fetchNotes();
  }, [userId]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("admin_notes").delete().eq("id", id);

    if (!error) {
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } else {
      alert("Failed to delete note. Try again.");
    }
  };

  return (
    <div className="bg-[#e4ded8] border border-[#d6cfc8] rounded-lg p-4 mt-6 w-full max-w-4xl mx-auto">
      <h2 className="text-md font-semibold text-black mb-4">Admin Notes</h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-400 text-sm">No notes added yet.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li
              key={note.id}
              className="bg-[#f6f1ea] border border-[#dcd2c8] rounded-md p-4 relative group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    {"Added By " + (note.profiles?.full_name || "Unknown Admin")}
                  </p>
                  <p className="text-[11px] text-gray-500 mb-2">
                    {new Date(note.created_at).toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>

                {isSuperAdmin && (
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                    title="Delete Note"
                  >
                    <BiTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
