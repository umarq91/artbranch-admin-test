import { supabase } from "../services/supabase";

interface AdminFilters {
  full_name?: string;
  email?: string;
  status?: string;
}

interface Admin {
  id: string;
  full_name: string;
  email: string;
  status: string;
  role: string;
}

interface AdminResponse {
  data: Admin[] | null;
  error: string | null;
  count?: number;
  itemsPerPage?: number;
}

class AdminService {
  private className = "profiles";

  // Fetch Admins with optional filters
  public async fetchAdmins(
    filters: AdminFilters = {},
    page: number = 1,
    itemsPerPage: number = 30,
  ): Promise<AdminResponse> {
    const { full_name, email, status } = filters;

    try {
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;

      let query = supabase
        .from(this.className)
        .select("*", { count: "exact" })
        .eq("role", "Admin")
        .range(start, end);

      if (full_name || email) {
        query = query.or(
          `full_name.ilike.%${full_name}%,email.ilike.%${email}%`,
        );
      }
      if (status) {
        query = query.eq("status", status);
      }

      const { data, error, count } = await query;

      return {
        data,
        error: error ? error.message : null,
        count: count ?? 0,
        itemsPerPage,
      };
    } catch (error) {
      console.error("Error fetching admins:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  public async deleteAdminsByIds(ids: string[]): Promise<AdminResponse> {
    if (ids.length === 0) {
      return { data: null, error: "No IDs provided for deletion." };
    }

    try {
      const { data, error } = await supabase
        .from(this.className)
        .delete()
        .in("id", ids);

      if (error) {
        console.error("Error deleting admins from backend:", error.message);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error deleting admins:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Fetch admin by ID
  public async fetchAdminById(id: string): Promise<AdminResponse> {
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
      console.error("Error fetching admin:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Edit admin details
  public async editAdmin(
    id: string,
    data: { full_name?: string; status?: string; email?: string },
  ): Promise<AdminResponse> {
    try {
      const updateData = {
        full_name: data.full_name || undefined,
        status: data.status || undefined,
        email: data.email || undefined,
      };

      const { error } = await supabase
        .from(this.className)
        .update(updateData)
        .eq("id", id);

      return { data: null, error: error ? error.message : null };
    } catch (error) {
      console.error("Error editing admin:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

export const adminService = new AdminService();
