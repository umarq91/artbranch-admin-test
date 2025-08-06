import { supabase } from "../services/supabase";

interface FeedbackFilters {
  full_name?: string;
}

interface Feedback {
  message: string;
  profiles: {
    id: string;
    full_name: string;
  };
}

interface FeedbackResponse {
  data: Feedback[] | null;
  error: string | null;
  totalEntries?: number;
  totalPages?: number;
  itemsPerPage?: number;
}

export class FeedbackService {
  private tableName = "feedbacks";

  public async getFeedbacks(
    filters: FeedbackFilters = {},
    page: number = 1,
    itemsPerPage: number = 10
  ): Promise<FeedbackResponse> {
    try {
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;
  
      let query = supabase
        .from(this.tableName)
        .select(
          `
          message,
          profiles (
              id,
              full_name,
              email,
              created_at
          )
        `,
          { count: "exact" }
        )
        .range(start, end)
        .order("created_at", { ascending: false });
  
      // Add filtering for `full_name` and `email`
      if (filters.full_name) {
        query = query.or(
          `profiles.full_name.ilike.%${filters.full_name}%,profiles.email.ilike.%${filters.full_name}%`
        );
      }
  
      const { data, error, count } = await query;
  
      if (error) {
        console.error("Error fetching feedbacks:", error.message);
        return { data: null, error: error.message };
      }
  
      const totalPages = Math.ceil((count ?? 0) / itemsPerPage);
  
      return {
        data: data as unknown as Feedback[],
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

export const feedbackService = new FeedbackService();