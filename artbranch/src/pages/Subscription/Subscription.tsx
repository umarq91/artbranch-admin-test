import { useEffect, useState } from "react";
import Table from "../../components/TableData/Table";
import { useSubscriptions } from "./useSubscription";

const Subscription = () => {
  const label = "Subscription";
  const columns = [
    "Artist Name",
    "Art Category",
    "Start Date",
    "Email",
    "End Date",
  ];

  const { rows, fetchSubscriptions } = useSubscriptions();
      const [selectedIds, setSelectedIds] = useState<string[]>([]);

      const toggleSelection = (id: string) => {
        setSelectedIds((prev) =>
          prev.includes(id)
            ? prev.filter((selectedId) => selectedId !== id)
            : [...prev, id]
        );
      };
    
      const handleBulkEmailClick = (emails: string[]) => {
        if (emails.length === 0) {
          alert("Please select at least one artist.");
          return;
        }
        console.log("Bulk Email to:", emails);
      };
    
      const handleSingleEmailClick = (email: string) => {
        console.log("Single Email to:", email);
      };
  

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <Table
      label={label}
      columns={columns}
      data={rows}
      // showDeleteAll={false}
      showStatusFilter={false}
      showSearch={false}
      onBulkEmailClick={handleBulkEmailClick}
      onSingleEmailClick={handleSingleEmailClick}
      toggleSelection={toggleSelection}
      selectedIds={selectedIds}
      
    />
  );
};

export default Subscription;
