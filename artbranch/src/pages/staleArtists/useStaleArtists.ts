import { useState, useEffect } from "react";
import { staleArtists } from "../../utils/repositories/staleArtistsRepository";

interface StaleArtist {
  id: string;
  user: string;
  created_at: string;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    categories: string[];
  };
}

export const useStaleArtists = () => {
  const [results, setResults] = useState<StaleArtist[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchStaleArtistsData = async (
    filters: { full_name?: string; email?: string } = {},
    page: number = 1
  ) => {
    setLoading(true);
    try {
      const response = await staleArtists.fetchStaleArtists(
        filters,
        page,
        itemsPerPage
      );

      if (response.error) throw new Error(response.error);

      setResults(response.data || []);
      setTotalPages(response.totalPages || 0);
      setTotalEntries(response.totalEntries || 0);

      if (response.itemsPerPage) {
        setItemsPerPage(response.itemsPerPage);
      }
    } catch (error) {
      console.error("Error fetching stale artists:", error);
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
    fetchStaleArtistsData(
      {
        full_name: debouncedSearchTerm,
        email: debouncedSearchTerm,
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

  const rows = results.map((artist) => ({
    id: artist.id,
    "Artist Name": artist.profiles?.full_name || "Unknown",
    Email: artist.profiles?.email || "No Email",
    user_id:artist.profiles.id,
    UUID: artist.user,
    Categories: artist.profiles?.categories?.join(", ") || "No categories",
    "Date & Time": new Date(artist.created_at).toLocaleString(),
  }));

  return {
    rows,
    isDeleteModalOpen,
    selectedArtistId,
    searchTerm,
    currentPage,
    totalPages,
    totalEntries,
    loading,
    itemsPerPage,
    setIsDeleteModalOpen,
    setSelectedArtistId,
    handleSearchChange,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
  };
};
