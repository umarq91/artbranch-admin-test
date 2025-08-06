import { useState } from "react";

interface Subscription {
  artistName: string;
  artCategory: string;
  startDate: string;
  email: string;
  endDate: string;
}

interface UseSubscriptionsReturn {
  rows: Subscription[];
  fetchSubscriptions: () => void;
}

export const useSubscriptions = (): UseSubscriptionsReturn => {
  const [results, setResults] = useState<Subscription[]>([]);

  const fetchSubscriptions = () => {
    const data = [
      {
        artistName: "John Doe",
        artCategory: "Painting",
        startDate: "2023-09-01",
        email: "john@example.com",
        endDate: "2023-09-30",
      },
      {
        artistName: "Jane Smith",
        artCategory: "Sculpture",
        startDate: "2023-10-01",
        email: "jane@example.com",
        endDate: "2023-10-30",
      },
      {
        artistName: "Mike Johnson",
        artCategory: "Photography",
        startDate: "2023-11-01",
        email: "mike@example.com",
        endDate: "2023-11-30",
      },
      {
        artistName: "Emily Davis",
        artCategory: "Drawing",
        startDate: "2023-12-01",
        email: "emily@example.com",
        endDate: "2023-12-30",
      },
      {
        artistName: "David Brown",
        artCategory: "Digital Art",
        startDate: "2024-01-01",
        email: "david@example.com",
        endDate: "2024-01-30",
      },
    ];
    setResults(data);
  };

  return {
    rows: results,
    fetchSubscriptions,
  };
};
