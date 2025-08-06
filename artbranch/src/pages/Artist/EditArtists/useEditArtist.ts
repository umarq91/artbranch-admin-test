import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { artistService } from "../../../utils/repositories/artistRepository";
import { useToast } from "../../../components/Toast";

const useEditArtist = (id: string) => {
  const { showToast } = useToast();
  const [artistData, setArtistData] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtistAndCategories = async () => {
      try {
        const { data: artistData, error: artistError } =
          await artistService.fetchArtistById(id);
        if (artistError) {
          setError(artistError);
          return;
        }
        const artist = Array.isArray(artistData) ? artistData[0] : artistData;
        setArtistData({
          ...artist,
          selectedCategories: artist?.categories || [],
        });

        const uniqueCategories = await artistService.fetchCategories();
        setCategories(uniqueCategories);
      } catch (error) {
        setError("Error fetching artist data");
      } finally {
        setLoading(false);
      }
    };

    fetchArtistAndCategories();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setArtistData((prevData: any) => ({ ...prevData, [name]: value }));
  };

  const handleCategoryChange = (category: string) => {
    setArtistData((prevData: any) => {
      const updatedCategories = prevData.selectedCategories.includes(category)
        ? prevData.selectedCategories.filter((cat: string) => cat !== category)
        : [...prevData.selectedCategories, category];

      return { ...prevData, selectedCategories: updatedCategories };
    });
  };

  const handleFavoriteToggle = async (newFavoriteStatus: boolean) => {
    try {
        setArtistData((prevData: any) => ({
            ...prevData,
            is_featured: newFavoriteStatus,
        }));
        await artistService.toggleFavorite(id, newFavoriteStatus);
        
    } catch (error) {
        setError("Error toggling favorite status");
    }
};


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...artistData,
        categories: artistData?.selectedCategories,
        is_featured: artistData?.is_featured,
      };
      await artistService.editArtist(id, updatedData);
      navigate("/artist");
      showToast("Artist data updated successfully", "info");
    } catch (error) {
      setError("Error updating artist data");
    }
  };

  return {
    artistData,
    categories,
    loading,
    error,
    handleChange,
    handleCategoryChange,
    handleSubmit,
    navigate,
    handleFavoriteToggle
  };
};

export default useEditArtist;
