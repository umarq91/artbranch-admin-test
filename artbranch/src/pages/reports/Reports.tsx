"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/services/supabase";
import { FiTrash, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function ReportedPostsTable() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("reported_posts_summary") // this is a view , not the table .. in supabase SQL
        .select("*")
        .order("last_reported_at", { ascending: false });

        console.log(data)
      if (error) {
        console.error("Error fetching reports:", error.message);
      } else {
        setReports(data);
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

  const handleDelete = async (postId: string) => {
    if (confirm("Are you sure you want to delete this reported post?")) {
      const { error } = await supabase
        .from("portfolio")
        .delete()
        .eq("id", postId);
      if (error) {
        alert("Failed to delete post.");
        console.error(error.message);
      } else {
        setReports((prev) => prev.filter((r) => r.post_id !== postId));
      }
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex flex-wrap justify-between items-center md:mt-20 mt-16 gap-3 bg-light px-4 py-3 rounded-2xl shadow-md mx-4 font-poppins">
        <div className="md:text-lg text-md font-semibold">Reports</div>
        <div className="flex items-center space-x-2 md:space-x-4 flex-wrap">
          <select className="bg-light border border-gray-300 text-[12px] px-4 py-1 rounded-md md:w-48 w-32 cursor-pointer">
            {["All Roles", "Artist", "Audience"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto shadow-md rounded-2xl mx-4">
        <table className="w-full text-sm md:text-base text-left text-gray-700 bg-light">
          <thead className="font-semibold">
            <tr className="text-left">
              <th className="p-3 border-b">Post ID</th>
              <th className="p-3 border-b">Title</th>
              <th className="p-3 border-b">Report Count</th>
               <th className="p-3 border-b">Reported By</th>
              <th className="p-3 border-b">Last Reported At</th>
              {(role === "Admin" || role === "SuperAdmin") && (
                <th className="p-3 border-b">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-4 text-center" colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td className="p-4 text-center" colSpan={5}>
                  No reports found.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr
                  key={report.post_id}
                  className="text-sm text-[#292D32] border-t border-sideBorder hover:bg-[rgba(28,28,28,0.05)] transition-colors"
                >
                  <td className="px-3 py-4">
                    <span
                      className="underline cursor-pointer"
                      onClick={() =>
                        window.open(
                          `http://localhost:3000/portfolio/${report.post_owner_id}?post=${report.slug}`,
                          "_blank"
                        )
                      }
                    >
                      {report.post_id}
                    </span>
                  </td>

                  <td className="px-3 py-4">{report.title}</td>
                  <td className="px-3 py-4">{report.report_count}</td>
                  <td className="px-3 py-4">{report.reporter_name}</td>
                  <td className="px-3 py-4">
                    {new Date(report.last_reported_at).toLocaleString()}
                  </td>

                  {(role === "Admin" || role === "SuperAdmin") && (
                    <td className="px-3 py-4 flex items-center space-x-2">
                      <FiEdit
                        className="text-gray-700 hover:bg-gray-300 h-8 w-8 p-2 rounded-md cursor-pointer transition-transform transform hover:scale-105"
                        onClick={() => navigate(`/editpost/${report.post_id}`)}
                      />
                      <FiTrash
                        className="text-[#FF0000] hover:bg-[#FFA7A7] h-8 w-8 p-2 rounded-md cursor-pointer transition-transform transform hover:scale-105"
                        onClick={() => handleDelete(report.post_id)}
                      />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
