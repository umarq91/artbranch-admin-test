import { useState, useEffect } from "react";
import { artistService } from "../../utils/repositories/artistRepository";
import emailjs from "@emailjs/browser";

interface Artist {
  id: string;
  full_name: string;
  categories: string[];
  email: string;
  city: string;
  status: string;
  is_featured: boolean;
  role?: string;
  postal: string;
  created_at?: string | Date;
  admin_notes?: any;
}

// interface UseArtistsReturn {
//   rows: Array<Record<string, any>>;
//   isDeleteModalOpen: boolean;
//   selectedArtistId: string | null;
//   searchTerm: string;
//   statusFilter: string;
//   isFeaturedFilter: boolean | null;
//   currentPage: number;
//   totalPages: number;
//   totalEntries: number;
//   loading: boolean;
//   itemsPerPage: number | null;
//   setIsDeleteModalOpen: (isOpen: boolean) => void;
//   setSelectedArtistId: (id: string | null) => void;
//   handleConfirmDelete: () => Promise<void>;
//   handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   handleStatusFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   handleFeaturedChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   handlePageChange: (page: number) => void;
//   handlePreviousPage: () => void;
//   handleNextPage: () => void;
//   handleStatusUpdate: (id: string, newStatus: string) => Promise<void>; // New function

// }

export const useArtists = () => {
  const [results, setResults] = useState<Artist[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [statusFilter, setStatusFilter] = useState("verification_pending");
  const [isFeaturedFilter, setIsFeaturedFilter] = useState<boolean | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState<
    "All Roles" | "Artist" | "Audience"
  >("Artist");

  const fetchArtistsData = async (
    filters: {
      full_name?: string;
      email?: string;
      status?: string;
      is_featured?: boolean | null;
      role?: string;
    } = {},
    page: number = 1
  ) => {
    setLoading(true);
    try {
      const {
        data,
        error,
        count,
        itemsPerPage: ItemsPerPage,
      } = await artistService.fetchArtists(
        { ...filters, is_featured: isFeaturedFilter ?? undefined },
        page
      );

      if (error) throw new Error(error);

      setResults(data || []);
      if (ItemsPerPage !== undefined) setItemsPerPage(ItemsPerPage);
      setTotalPages(
        count && ItemsPerPage ? Math.ceil(count / ItemsPerPage) : 0
      );
      setTotalEntries(count || 0);
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on currentPage, filters, or search change
  useEffect(() => {
    fetchArtistsData(
      {
        full_name: debouncedSearchTerm,
        email: debouncedSearchTerm,
        status: statusFilter !== "featured" ? statusFilter : undefined,
        is_featured: statusFilter === "featured" ? true : undefined,
        role: roleFilter === "All Roles" ? "All Roles" : roleFilter,
      },
      currentPage
    );
  }, [currentPage, debouncedSearchTerm, statusFilter,roleFilter]);

  const handleSelectRoles = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value as "All Roles" | "Artist" | "Audience");
    setCurrentPage(1); // Reset to first page on role change
  };

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const deleteArtist = async (ids: string[]) => {
    setLoading(true);
    try {
      const response = await artistService.deleteArtistsByIds(ids);
      if (response.error) throw new Error(response.error);
      setCurrentPage(1); // This will trigger data fetch via useEffect
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting artists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedArtistId) {
      await deleteArtist([selectedArtistId]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    if (value === "featured") {
      setIsFeaturedFilter(true);
      setStatusFilter(""); // reset to avoid conflict
    } else {
      setIsFeaturedFilter(null);
      setStatusFilter(value);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage((prev) => prev - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage((prev) => prev + 1);

  const handleStatusUpdate = async (
    id: string,
    newStatus: string,
    name: string,
    email: string
  ) => {
    try {
      await artistService.updateArtistStatus(id, newStatus);

      fetchArtistsData(
        {
          full_name: debouncedSearchTerm,
          email: debouncedSearchTerm,
          status: statusFilter,
          is_featured: isFeaturedFilter,
        },
        currentPage
      );

      if (newStatus === "active") {
        await emailjs.send(
          "service_85wu0nm",
          "template_bu8o9t8",
          {
            name,
            email,
          },
          "-exD4uPbg8mEcqCRj"
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  function formatFriendlyDate(value: string | Date): string {
    const date = new Date(value);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
  const rows = results.map((artist) => ({
    id: artist.id,
    "Joined on": formatFriendlyDate(artist.created_at!),
    Role: artist.role,
    "Artist Name": artist.full_name || "Unknown",
    Categories: artist.categories?.join(", ") || "No categories",
    Email: artist.email || "No email",
    Status: artist.status || "Inactive",
    is_featured: artist?.is_featured,
    "Recent Note":
      artist?.admin_notes?.length > 0
        ? artist?.admin_notes[0].content
        : "No notes",
    "Post Code": artist.postal || "No Post Code",
  }));

  return {
    rows,
    isDeleteModalOpen,
    selectedArtistId,
    searchTerm,
    statusFilter,
    isFeaturedFilter,
    currentPage,
    totalPages,
    totalEntries,
    loading,
    itemsPerPage,
    roleFilter,
    setIsDeleteModalOpen,
    setSelectedArtistId,
    handleConfirmDelete,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
    handleStatusUpdate,
    handleSelectRoles,
  };
};
