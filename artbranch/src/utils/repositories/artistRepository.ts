import { supabase } from "../services/supabase";

interface ArtistFilters {
  full_name?: string;
  category?: string;
  city?: string;
  email?: string;
  status?: string;
  is_featured?: boolean;
  role?: string;
}

interface Artist {
  id: string;
  full_name: string;
  category: string;
  email: string;
  city: string;
  status: string;
  categories: string[];
  is_featured: boolean;
  postal: string;
  admin_notes?:any
}

interface ArtistResponse {
  data: Artist[] | null;
  error: string | null;
  count?: number;
  itemsPerPage?: number;
}

interface ArtistPreview {
  full_name: string;
  profile: string;
}

interface ArtistPreviewResponse {
  data: ArtistPreview[] | null;
  error: string | null;
}

class ArtistService {
  private className = "profiles";

  public async fetchArtists(
    filters: ArtistFilters = {},
    page: number = 1,
    itemsPerPage: number = 30
  ): Promise<ArtistResponse> {
    const { full_name, category, city, status, is_featured, role } =
      filters;

    try {
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;

      let query = supabase
        .from(this.className)
        .select("*, admin_notes:admin_notes!user_id(*)", { count: "exact" })

        .order("created_at", { ascending: false })
        .range(start, end);

      // IMPORTANT: full_name is considering a searchTerm
      const isPostalRange = /^\d{4}-\d{4}$/.test(full_name || "");

      if (isPostalRange && full_name) {
        const [minPostal, maxPostal] = full_name.split("-").map(Number);

        // Convert postal column to integer first if it's string
        query = query.gte("postal", minPostal).lte("postal", maxPostal);
      } else if (full_name) {
        query = query.or(
          `full_name.ilike.%${full_name}%,email.ilike.%${full_name}%,postal.ilike.%${full_name}%`
        );
      }

      if (category) query = query.ilike("category", `%${category}%`);
      if (city) query = query.ilike("city", `%${city}%`);
      if (status) query = query.eq("status", status);
      if (status === "featured") query = query.eq("is_featured", is_featured);
      if (role && role !== "All Roles") query = query.eq("role", role);

      const { data, error, count } = await query;

      // 👉 Pick the latest note from each user's notes
      const enrichedData = data?.map((artist) => {
        const notes = artist.admin_notes || [];
        const latestNote = notes.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        return {
          ...artist,
          latest_note: latestNote || null,
        };
      });

      return {
        data: enrichedData as any,
        error: error ? error.message : null,
        count: count ?? 0,
        itemsPerPage,
      };
    } catch (error) {
      console.error("Error fetching artists:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  public async fetchLatestArtists(
    limit: number = 6
  ): Promise<ArtistPreviewResponse> {
    try {
      const { data, error } = await supabase
        .from(this.className)
        .select("id, full_name, profile, email")
        .eq("role", "Artist")
        .limit(limit);

      return {
        data: data as ArtistPreview[] | null,
        error: error ? error.message : null,
      };
    } catch (error) {
      console.error("Error fetching latest artists:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  public async toggleFavorite(
    id: string,
    isFeatured: boolean
  ): Promise<ArtistResponse> {
    try {
      const { error } = await supabase
        .from(this.className)
        .update({ is_featured: isFeatured })
        .eq("id", id);
      return { data: null, error: error ? error.message : null };
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  public async fetchCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from(this.className)
        .select("categories")
        .eq("role", "Artist");

      if (error) {
        console.error("Error fetching categories:", error.message);
        return [];
      }

      const uniqueCategories = Array.from(
        new Set(data?.flatMap((item) => item.categories) || [])
      );

      return uniqueCategories;
    } catch (error) {
      console.error("Unexpected error fetching categories:", error);
      return [];
    }
  }

  public async deleteArtistsByIds(ids: string[]): Promise<ArtistResponse> {
    if (ids.length === 0) {
      return { data: null, error: "No IDs provided for deletion." };
    }

    try {
      const { data, error } = await supabase
        .from(this.className)
        .delete()
        .in("id", ids);

      if (error) {
        console.error("Error deleting artists from backend:", error.message);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error deleting artists:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  public async deleteAllArtists(): Promise<ArtistResponse> {
    try {
      const { data, error } = await supabase
        .from(this.className)
        .delete()
        .match({ role: "Artist" });
      return { data, error: error ? error.message : null };
    } catch (error) {
      console.error("Error deleting artists:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  public async fetchArtistById(id: string): Promise<ArtistResponse> {
    try {
      const { data, error } = await supabase
        .from(this.className)
        .select("*")
        .eq("id", id)
        .single();
      return {
        data: data ? [data] : null,
        error: error ? error.message : null,
      };
    } catch (error) {
      console.error("Error fetching artist:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  public async editArtist(
    id: string,
    data: { full_name?: string; categories?: string[]; status?: string }
  ): Promise<ArtistResponse> {
    try {
      const updateData = {
        full_name: data.full_name || "",
        categories: data.categories || [],
        status: data.status || "",
      };

      const { error } = await supabase
        .from(this.className)
        .update(updateData)
        .eq("id", id);

      return { data: null, error: error ? error.message : null };
    } catch (error) {
      console.error("Error editing artist:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  public async updateArtistStatus(
    id: string,
    status: string
  ): Promise<ArtistResponse> {
    try {
      const { error } = await supabase
        .from(this.className)
        .update({ status })
        .eq("id", id);

      return { data: null, error: error ? error.message : null };
    } catch (error) {
      console.error("Error updating artist status:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

export const artistService = new ArtistService();
