import { supabase } from "../services/supabase";
class VerificationService {
  private className = "verification_requests";

  public async verification_requests(
    searchQuery: string,
    page: number = 1,
    itemsPerPage: number = 30,
    req_status?: string,
  ) {
    try {
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;

      let query = supabase.from(this.className).select(
        `
            *,
            profiles !inner(id, email, full_name, username)
          `,
        { count: "exact" },
      );

      if (searchQuery) {
        query = query.or(
          `email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`,
          { referencedTable: "profiles" },
        );
      }

      if (req_status) {
        query = query.eq("req_status", req_status);
      }

      query = query.range(start, end).order("created_at", { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching verification requests:", error);
        return { data: [], count: 0, itemsPerPage };
      }

      return { data, count, itemsPerPage };
    } catch (error) {
      console.error("Unexpected error in verification_requests:", error);
      return { data: [], count: 0, itemsPerPage };
    }
  }

  public async getVerificationRequestById(user_id: string) {
    try {
      const { data, error } = await supabase
        .from(this.className)
        .select("*")
        .eq("user_id", user_id)
        .single();
      return { data, error };
    } catch (error) {
      console.error("Error fetching verification request by user ID:", error);
      return { data: null, error };
    }
  }

  public async deleteVerificationRequestByIds(user_ids: string[]) {
    try {
      const { data, error } = await supabase
        .from(this.className)
        .delete()
        .in("user_id", user_ids);

      return { data, error };
    } catch (error) {
      console.error("Error deleting verification requests by user IDs:", error);
      return { data: null, error };
    }
  }

  public async updateVerificationStatus(user_id: string, is_verified: boolean) {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .update({ is_verified })
        .eq("id", user_id);

      if (profileError) {
        throw new Error("Failed to update is_verified in profiles table");
      }

      const req_status = is_verified ? "verified" : "rejected";

      const { data: requestData, error: requestError } = await supabase
        .from("verification_requests")
        .update({ req_status })
        .eq("user_id", user_id);

      if (requestError) {
        throw new Error(
          "Failed to update req_status in verification_requests table",
        );
      }

      return { profileData, requestData, error: null };
    } catch (error) {
      console.error("Error updating verification status:", error);
      return { data: null, error };
    }
  }
}

export default new VerificationService();
