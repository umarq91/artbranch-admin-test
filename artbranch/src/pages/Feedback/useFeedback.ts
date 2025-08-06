import { useState, useEffect } from "react";
import { feedbackService } from "../../utils/repositories/feedbackRepository";

interface Feedback {
  message: string;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    created_at: string;
  };
}

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = async (
    filters: { full_name?: string; email?: string } = {},
    page: number = 1
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedbackService.getFeedbacks(
        filters,
        page,
        itemsPerPage
      );

      if (response.error) throw new Error(response.error);

      const data: Feedback[] = (response.data || []).map((item: any) => ({
        message: item.message,
        profiles: {
          id: item.profiles.id,
          full_name: item.profiles.full_name,
          email: item.profiles.email,
          created_at: item.profiles.created_at,
        },
      }));

      setFeedbacks(data);
      setTotalPages(response.totalPages || 0);
      setTotalEntries(response.totalEntries || 0);

      if (response.itemsPerPage) {
        setItemsPerPage(response.itemsPerPage);
      }
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    fetchFeedbacks(
      {
        full_name: debouncedSearchTerm,
      },
      currentPage
    );
  }, [currentPage, debouncedSearchTerm, itemsPerPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const rows = feedbacks.map((feedback) => ({
    id: feedback.profiles.id,
    Message: feedback.message,
    Name: feedback.profiles?.full_name || "Unknown",
    Email: feedback.profiles?.email || "Unknown",
    "Date & Time": new Date(feedback.profiles.created_at).toLocaleString(),
  }));

  return {
    rows,
    searchTerm,
    currentPage,
    totalPages,
    totalEntries,
    loading,
    itemsPerPage,
    error,
    handleSearchChange,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
  };
};