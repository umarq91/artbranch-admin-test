import { supabase } from "../services/supabase";

interface StaleArtistFilters {
  full_name?: string;
  email?: string;
}

interface StaleArtistResponse {
  data: any[] | null;
  error: string | null;
  totalEntries?: number;
  totalPages?: number;
  itemsPerPage?: number;
}

class StaleArtists {
  private tableName = "portfolio";

  public async fetchStaleArtists(
    filters: StaleArtistFilters = {},
    page: number = 1,
    itemsPerPage: number = 1
  ): Promise<StaleArtistResponse> {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;

      let query = supabase
        .from(this.tableName)
        .select(
          `
          id,
          user,
          created_at,
          profiles:profiles!inner(id, full_name, email, categories)
        `,
          { count: "exact" }
        )
        .lt("created_at", sixMonthsAgo.toISOString()) 
        .range(start, end) 
        .order("created_at", { ascending: false }); 

      if (filters.full_name || filters.email) {
        const filterConditions = [];
        if (filters.full_name) {
          filterConditions.push(`full_name.ilike.%${filters.full_name}%`);
        }
        if (filters.email) {
          filterConditions.push(`email.ilike.%${filters.email}%`);
        }
        query = query.or(filterConditions.join(","), {
          referencedTable: "profiles",
        });
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching stale artists:", error.message);
        return { data: null, error: error.message };
      }

      const totalPages = Math.ceil((count ?? 0) / itemsPerPage);

      return {
        data,
        error: null,
        totalEntries: count ?? 0,
        totalPages,
        itemsPerPage,
      };
    } catch (error) {
      console.error("Unexpected error occurred:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Unexpected error occurred",
      };
    }
  }
}

export const staleArtists = new StaleArtists();
