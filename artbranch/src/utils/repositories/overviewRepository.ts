import { supabase } from "../services/supabase";

class OverviewService {
  public async fetchProfiles(year: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .gte("created_at", `${year}-01-01`)
        .lte("created_at", `${year}-12-31`);

      return { data, error };
    } catch (error) {
      console.error("Error fetching profiles:", error);
      return {};
    }
  }

  public async fetchPortfolios(year: string) {
    try {
      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .gte("created_at", `${year}-01-01`)
        .lte("created_at", `${year}-12-31`);

      return { data, error };
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      return {};
    }
  }

  public async fetchArtists(year: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "Artist")
        .gte("created_at", `${year}-01-01`)
        .lte("created_at", `${year}-12-31`);

      return { data, error };
    } catch (error) {
      console.error("Error fetching artists:", error);
      return {};
    }
  }

  public async fetchCollaborations(year: string) {
    try {
      const { data, error } = await supabase
        .from("collaborations")
        .select("id, created_at")
        .gte("created_at", `${year}-01-01`)
        .lte("created_at", `${year}-12-31`);
  
      return { data, error };
    } catch (error) {
      console.error("Error fetching collaborations:", error);
      return { data: [], error };
    }
  }
  
  
}

export default OverviewService;
