import { useState, useEffect } from "react";
import { adminService } from "../../utils/repositories/adminsRepository";

interface Admin {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
}

interface UseAdminReturn {
  rows: Array<Record<string, any>>;
  isDeleteModalOpen: boolean;
  selectedAdminId: string | null;
  searchTerm: string;
  statusFilter: string;
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  loading: boolean;
  itemsPerPage: number | null;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  setSelectedAdminId: (id: string | null) => void;
  handleConfirmDelete: () => Promise<void>;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handlePageChange: (page: number) => void;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}

export const useAdmin = (): UseAdminReturn => {
  const [results, setResults] = useState<Admin[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchAdminData = async (
    filters: { full_name?: string; email?: string; status?: string } = {},
    page: number = 1,
  ) => {
    setLoading(true);
    try {
      const {
        data,
        error,
        count,
        itemsPerPage: ItemsPerPage,
      } = await adminService.fetchAdmins(filters, page);

      if (error) throw new Error(error);

      if (ItemsPerPage !== undefined) {
        setItemsPerPage(ItemsPerPage);
      }

      setResults(data || []);
      setTotalPages(
        count && ItemsPerPage ? Math.ceil(count / ItemsPerPage) : 0,
      );
      setTotalEntries(count || 0);
    } catch (error) {
      console.error("Error fetching admins:", error);
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
    fetchAdminData(
      {
        full_name: debouncedSearchTerm,
        email: debouncedSearchTerm,
        status: statusFilter,
      },
      currentPage,
    );
  }, [currentPage, debouncedSearchTerm, statusFilter]);

  // Deleting admins by ID using adminService
  const deleteAdmin = async (ids: string[]) => {
    setLoading(true);
    try {
      const response = await adminService.deleteAdminsByIds(ids);
      if (response.error) {
        console.error("Error deleting admins:", response.error);
        return;
      }
      await fetchAdminData(
        {
          full_name: debouncedSearchTerm,
          email: debouncedSearchTerm,
          status: statusFilter,
        },
        currentPage,
      );
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedAdminId) {
      await deleteAdmin([selectedAdminId]);
      setCurrentPage(1);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAdminData(
      {
        full_name: debouncedSearchTerm,
        email: debouncedSearchTerm,
        status: statusFilter,
      },
      page,
    );
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchAdminData(
        {
          full_name: debouncedSearchTerm,
          email: debouncedSearchTerm,
          status: statusFilter,
        },
        currentPage - 1,
      );
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      fetchAdminData(
        {
          full_name: debouncedSearchTerm,
          email: debouncedSearchTerm,
          status: statusFilter,
        },
        currentPage + 1,
      );
    }
  };

  const rows = results.map((admin) => {
    return {
      id: admin.id,
      "Admin Name": admin.full_name || "Unknown",
      Email: admin.email || "No email",
      Role: admin.role || "No role",
    };
  });

  return {
    rows,
    isDeleteModalOpen,
    selectedAdminId,
    searchTerm,
    statusFilter,
    currentPage,
    totalPages,
    totalEntries,
    loading,
    itemsPerPage,
    setIsDeleteModalOpen,
    setSelectedAdminId,
    handleConfirmDelete,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
  };
};
