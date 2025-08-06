import { useState, useEffect } from "react";
import VerificationService from "../../utils/repositories/verificationRepository";
import { getStatusBadge } from "../../components/Bedges/Formatted";

interface Profile {
  email: string;
  full_name: string;
  username: string;
}

interface Verification {
  id: string;
  profiles: Profile[];
  status: string;
}

interface UseVerificationReturn {
  rows: Array<Record<string, any>>;
  isDeleteModalOpen: boolean;
  selectedVerificationId: string | null;
  searchTerm: string;
  statusFilter: string;
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  loading: boolean;
  itemsPerPage: number | null;

  setIsDeleteModalOpen: (isOpen: boolean) => void;
  setSelectedVerificationId: (id: string | null) => void;
  handleConfirmDelete: () => Promise<void>;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handlePageChange: (page: number) => void;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}

export const useVerification = (): UseVerificationReturn => {
  const [results, setResults] = useState<Verification[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVerificationId, setSelectedVerificationId] = useState<
    string | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchVerificationData = async (page: number = 1) => {
    setLoading(true);
    try {
      const {
        data,
        count,
        itemsPerPage: ItemsPerPage,
      } = await VerificationService.verification_requests(
        debouncedSearchTerm,
        page,
        undefined,
        statusFilter,
      );

      if (ItemsPerPage !== undefined) {
        setItemsPerPage(ItemsPerPage);
      }

      setResults(
        (data || []).map((item) => ({
          id: item.user_id,
          profiles: Array.isArray(item.profiles)
            ? item.profiles
            : [item.profiles],
          status: item.req_status || "Unknown",
        })),
      );

      setTotalPages(
        count && ItemsPerPage ? Math.ceil(count / ItemsPerPage) : 0,
      );
      setTotalEntries(count || 0);
    } catch (error) {
      console.error("Error fetching verifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteVerification = async (ids: string[]) => {
    setLoading(true);
    try {
      const response =
        await VerificationService.deleteVerificationRequestByIds(ids);
      if (response.error) {
        console.error("Error deleting verification requests:", response.error);
        return;
      }
      await fetchVerificationData(currentPage);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting verifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedVerificationId) {
      await deleteVerification([selectedVerificationId]);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchVerificationData(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchVerificationData(newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchVerificationData(newPage);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
    fetchVerificationData(1);
  }, [debouncedSearchTerm, statusFilter]);

  const rows = results.flatMap((verification) =>
    verification.profiles.map((profile) => ({
      user_id: verification.id,
      Name: profile.full_name,
      Email: profile.email,
      Username: profile.username,
      Status: getStatusBadge(verification.status),
    })),
  );

  return {
    rows,
    isDeleteModalOpen,
    selectedVerificationId,
    searchTerm,
    statusFilter,
    currentPage,
    totalPages,
    totalEntries,
    loading,
    itemsPerPage,
    setIsDeleteModalOpen,
    setSelectedVerificationId,
    handleConfirmDelete,
    handleSearchChange: (e) => setSearchTerm(e.target.value),
    handleStatusFilterChange: (e) => setStatusFilter(e.target.value),
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
  };
};
