import { useState, useEffect } from "react";
import AdminNotificationsService from "../../utils/repositories/adminNotificationsRepository";
import { artistService } from "../../utils/repositories/artistRepository";

interface NotificationItem {
  id?: string;
  full_name?: string;
  email?: string;
  profile?: string;
  message?: string;
  name?: string;
  time?: string;
  imgSrc?: string;
  slug?: string;
  created_at?: string;
}

export const useNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [latestArtists, setLatestArtists] = useState<NotificationItem[]>([]);

  const formatTimeDifference = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - createdDate.getTime()) / 1000,
    );

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const fetchedNotifications =
          await AdminNotificationsService.fetchNotifications();

        if (fetchedNotifications.data) {
          const formattedNotifications = fetchedNotifications.data.map(
            (notification: any) => ({
              message: notification.message,
              time: formatTimeDifference(notification.created_at),
              name: notification.profiles?.full_name,
              imgSrc:
                notification.profiles?.profile ||
                "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
              slug: notification?.portfolio?.slug,
            }),
          );

          setNotifications(formattedNotifications);
        } else {
          console.error("Error: No data in fetched notifications.");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []); // Empty dependency array ensures it runs only once after the component mounts

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await artistService.fetchLatestArtists();
        if (response.data) {
          const formattedArtists = response.data.map((artist: any) => ({
            name: artist.full_name,
            email: artist.email,
            id: artist?.id,
            imgSrc:
              artist.profile ||
              "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
          }));
          setLatestArtists(formattedArtists);
        } else {
          console.error("Error fetching latest artists:", response.error);
        }
      } catch (error) {
        console.error("Error fetching latest artists:", error);
      }
    };

    fetchArtists();
  }, []);

  return {
    isOpen,
    setIsOpen,
    notifications,
    latestArtists,
  };
};
