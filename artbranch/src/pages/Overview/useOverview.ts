import { useState, useEffect } from "react";
import OverviewService from "../../utils/repositories/overviewRepository";

interface Profile {
  id: string;
  created_at: string;
  category?: string;
  state?: string;
  collaborators?: number;
}

interface Artist {
  id: string;
  created_at: string;
  category?: string;
  state?: string;
}

interface Collaboration {
  id: string;
  created_at: string;
}

interface ChartData {
  name: string;
  total_users: number;
  total_artists: number;
}

interface CategoryData {
  name: string;
  uv: number;
}

interface StateData {
  name: string;
  value: number;
}

export const useOverview = () => {
  const [loading, setLoading] = useState(true);
  const [portfoliosCount, setPortfoliosCount] = useState<number>(0);
  const [stateDistribution, setStateDistribution] = useState<StateData[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState<string>(currentYear);
  const [selectedDataType, setSelectedDataType] = useState<string>("total_users");
  const [filteredChartData, setFilteredChartData] = useState<ChartData[]>([]);
  const [topCategoriesData, setTopCategoriesData] = useState<CategoryData[]>([]);
  const [monthlyStats, setMonthlyStats] = useState({
    usersPercentage: "0.00%",
    artistsPercentage: "0.00%",
    portfoliosPercentage: "0.00%",
    collaboratorsPercentage: "0.00%",
  });
  const [selectedPieChartCategory, setSelectedPieChartCategory] = useState<
    "users" | "artists"
  >("users");

  const monthNames = Array.from({ length: 12 }, (_, index) =>
    new Date(0, index).toLocaleString("default", { month: "short" }).slice(0, 2)
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const service = new OverviewService();
    
      try {
        const { data: profilesData, error: profilesError } = await service.fetchProfiles(year);
        if (!profilesError) setProfiles(profilesData ?? []);
    
        const { data: portfoliosData, error: portfoliosError } = await service.fetchPortfolios(year);
        if (!portfoliosError) setPortfoliosCount((portfoliosData ?? []).length);
    
        const { data: artistsData, error: artistsError } = await service.fetchArtists(year);
        if (!artistsError) setArtists(artistsData ?? []);
    
        const { data: collaborationsData, error: collaborationsError } = await service.fetchCollaborations(year);
        if (!collaborationsError) setCollaborations(collaborationsData ?? []);
      } catch (error) {
        console.error("Error in fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchData();
  }, [year]);


  useEffect(() => {
    const currentMonth = new Date().getMonth();
  
    // Filter current month's collaborations
    const currentMonthCollaborations = collaborations.filter((collaboration) => {
      const createdAt = new Date(collaboration.created_at);
      return createdAt.getMonth() === currentMonth;
    });
  
    const totalCollaborationsInMonth = currentMonthCollaborations.length;
    const totalCollaborations = collaborations.length;
  
    const collaboratorsPercentage = totalCollaborations
      ? ((totalCollaborationsInMonth / totalCollaborations) * 100).toFixed(2)
      : "0.00";
  
    setMonthlyStats((prevStats) => ({
      ...prevStats,
      collaboratorsPercentage: `${collaboratorsPercentage}%`,
    }));
  }, [collaborations]);
  
  useEffect(() => {
    const calculateStateDistribution = () => {
      const stateCount: Record<string, number> = {};
      const dataSource = selectedPieChartCategory === "users" ? profiles : artists;

      dataSource.forEach((item) => {
        if (item.state) {
          stateCount[item.state] = (stateCount[item.state] || 0) + 1;
        }
      });

      const totalStateCount = Object.values(stateCount).reduce((acc, count) => acc + count, 0);

      const distribution = Object.entries(stateCount).map(([name, count]) => ({
        name,
        value: Math.round((count / totalStateCount) * 100),
      }));

      setStateDistribution(distribution);
    };

    calculateStateDistribution();
  }, [profiles, artists, selectedPieChartCategory]);

  useEffect(() => {
    const calculateTopCategories = () => {
      const categoryCount: Record<string, number> = {};

      profiles.forEach((profile) => {
        if (profile.category) {
          categoryCount[profile.category] = (categoryCount[profile.category] || 0) + 1;
        }
      });

      const topCategories = Object.entries(categoryCount)
        .map(([name, count]) => ({ name, uv: count }))
        .sort((a, b) => b.uv - a.uv)
        .slice(0, 5);

      setTopCategoriesData(topCategories);
    };

    calculateTopCategories();
  }, [profiles]);

  useEffect(() => {
    const currentMonth = new Date().getMonth();

    const currentMonthProfiles = profiles.filter((profile) => {
      const createdAt = new Date(profile.created_at);
      return createdAt.getMonth() === currentMonth;
    });

    const portfoliosPercentage = portfoliosCount
      ? ((currentMonthProfiles.length / portfoliosCount) * 100).toFixed(2)
      : "0.00";

    const usersPercentage = profiles.length
      ? ((currentMonthProfiles.length / profiles.length) * 100).toFixed(2)
      : "0.00";

    const currentMonthArtists = artists.filter((artist) => {
      const createdAt = new Date(artist.created_at);
      return createdAt.getMonth() === currentMonth;
    });

    const artistsPercentage = artists.length
      ? ((currentMonthArtists.length / artists.length) * 100).toFixed(2)
      : "0.00";

    const totalCollaboratorsInMonth = currentMonthProfiles.reduce(
      (acc, profile) => acc + (profile.collaborators || 0),
      0
    );
    const totalCollaborators = profiles.reduce(
      (acc, profile) => acc + (profile.collaborators || 0),
      0
    );
    const collaboratorsPercentage = totalCollaborators
      ? ((totalCollaboratorsInMonth / totalCollaborators) * 100).toFixed(2)
      : "0.00";

    setMonthlyStats({
      usersPercentage: `${usersPercentage}%`,
      artistsPercentage: `${artistsPercentage}%`,
      portfoliosPercentage: `${portfoliosPercentage}%`,
      collaboratorsPercentage: `${collaboratorsPercentage}%`,
    });
  }, [profiles, artists, portfoliosCount]);

  useEffect(() => {
    const filterData = () => {
      const monthData: ChartData[] = monthNames.map((month, index) => {
        const total_users = profiles.filter((profile) => {
          const createdAt = new Date(profile.created_at);
          return createdAt.getMonth() === index;
        }).length;

        const total_artists = artists.filter((artist) => {
          const createdAt = new Date(artist.created_at);
          return createdAt.getMonth() === index;
        }).length;

        return {
          name: month,
          total_users,
          total_artists,
        };
      });

      setFilteredChartData(monthData);
    };

    filterData();
  }, [profiles, artists]);

  return {
    loading,
    portfoliosCount,
    profiles,
    artists,
    collaborations,
    year,
    setYear,
    selectedDataType,
    setSelectedDataType,
    filteredChartData,
    topCategoriesData,
    stateDistribution,
    monthlyStats,
    selectedPieChartCategory,
    setSelectedPieChartCategory,
  };
};

export default useOverview;
