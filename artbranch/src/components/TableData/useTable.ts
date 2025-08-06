import { useState, useEffect } from "react";

interface UseTableProps {
  rows: any[];
  deleteArtists?: (id: string[]) => void;
  deleteVerification?: (id: string[]) => void;
  deleteActivities?: (id: string[]) => void;
}

const useTable = ({
  rows,
  deleteArtists,
  deleteVerification,
  deleteActivities,
}: UseTableProps) => {
  const [currentItems, setCurrentItems] = useState(rows);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setCurrentItems(rows);
  }, [rows]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id],
    );
  };

  const toggleSelectAll = (selectAll = true) => {
    if (selectAll) {
      setSelectedIds(rows.map((row) => row.id)); 
    } else {
      setSelectedIds([]); 
    }
  };
  

  const handleDeleteAll = () => {
    if (deleteArtists) {
      deleteArtists(
        selectedIds.filter((id) => currentItems.find((d) => d.id === id)),
      );
    }
    if (deleteVerification) {
      deleteVerification(
        selectedIds.filter((user_id) =>
          currentItems.find((d) => d.user_id === user_id),
        ),
      );
    }
    if (deleteActivities) {
      deleteActivities(
        selectedIds.filter((id) => currentItems.find((d) => d.id === id)),
      );
    }

    setCurrentItems((prevData) =>
      prevData.filter((item) => !selectedIds.includes(item.user_id || item.id)),
    );
    setSelectedIds([]);
  };

  return {
    currentItems,
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    handleDeleteAll,
  };
};

export default useTable;
