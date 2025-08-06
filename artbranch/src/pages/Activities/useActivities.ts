import { useState, useEffect } from "react";
import AdminNotificationsService from "../../utils/repositories/adminNotificationsRepository";
import { useToast } from "../../components/Toast";

interface Activity {
  id: string;
  "Artist Name": string;
  Type: string;
  Message: string;
  "Date & Time": string;
  slug: string;
  comments: string;
}

interface UseActivitiesReturn {
  activities: Activity[];
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  loading: boolean;
  isDeleteModalOpen: boolean;
  itemsPerPage: number | null;
  selectedActivityIds: string[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  setSelectedActivityIds: (ids: string[]) => void;
  fetchActivities: (page?: number, typeFilter?: string) => void;
  handleConfirmDelete: () => Promise<void>;
  handlePageChange: (page: number) => void;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  deleteActivitiesDirectly: (id: string[]) => void;
}

export const useActivities = (): UseActivitiesReturn => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [typeFilter, _] = useState("");
  const { showToast } = useToast();

  const fetchActivities = async (
    page: number = 1,
    typeFilterValue: string = "",
  ) => {
    setLoading(true);
    try {
      const {
        data,
        count,
        itemsPerPage: ItemsPerPage,
      } = await AdminNotificationsService.fetchNotifications(
        page,
        undefined,
        debouncedSearchTerm,
        typeFilterValue,
      );

      if (ItemsPerPage !== undefined) {
        setItemsPerPage(ItemsPerPage);
      }

      const formattedActivities = data.map((notification: any) => ({
        id: notification.id,
        "Artist Name": notification.profiles?.full_name,
        Type: notification.type === "update post" ? "Updated" : "Post",
        Message: notification.message,
        "Date & Time": new Date(notification.created_at).toLocaleString(),
        slug: notification?.portfolio?.slug,
        user_id: notification.profiles?.id,
        comments: notification.comments,      }));
      setActivities(formattedActivities);

      setTotalPages(
        count && ItemsPerPage ? Math.ceil(count / ItemsPerPage) : 0,
      );
      setTotalEntries(count || 0);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteActivities = async () => {
    setLoading(true);
    try {
      const response =
        await AdminNotificationsService.deleteAllActivitiesByIds(
          selectedActivityIds,
        );
      if (response.error) {
        showToast("Error deleting activities.", "error");
        console.error("Error deleting activities:", response.error);
      } else {
        showToast("Activities deleted successfully!", "success");
        fetchActivities(currentPage, typeFilter);
        setIsDeleteModalOpen(false);
        setSelectedActivityIds([]);
      }
    } catch (error) {
      showToast("Error deleting activities.", "error");
      console.error("Error deleting activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    await deleteActivities();
  };

  const deleteActivitiesDirectly = async (ids: string[]) => {
    setLoading(true);
    try {
      const response =
        await AdminNotificationsService.deleteAllActivitiesByIds(ids);
      if (response.error) {
        showToast("Error deleting activities.", "error");
        console.error("Error deleting activities directly:", response.error);
      } else {
        showToast("Activities deleted successfully!", "success");
        fetchActivities(currentPage, typeFilter);
      }
    } catch (error) {
      showToast("Error deleting activities.", "error");
      console.error("Error deleting activities directly:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchActivities(page, typeFilter);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchActivities(newPage, typeFilter);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchActivities(newPage, typeFilter);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchActivities(currentPage, typeFilter);
  }, [currentPage, debouncedSearchTerm, typeFilter]);

  return {
    activities,
    currentPage,
    totalPages,
    totalEntries,
    loading,
    isDeleteModalOpen,
    itemsPerPage,
    selectedActivityIds,
    searchTerm,
    setSearchTerm,
    setIsDeleteModalOpen,
    setSelectedActivityIds,
    fetchActivities,
    handleConfirmDelete,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
    deleteActivitiesDirectly,
  };
};
