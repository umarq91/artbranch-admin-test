import { supabase } from "../services/supabase";

class AdminNotificationsService {
  private className = "admin_notifications";

  public async fetchNotifications(
    page: number = 1,
    itemsPerPage: number = 30,
    searchQuery: string = "",
    typeFilter: string = "",
  ) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    let query = supabase
      .from(this.className)
      .select(
        `
        id, 
        message, 
        type, 
        created_at, 
        profiles:profile_id(id, full_name, profile), 
        portfolio:portfolio_id(slug)
      `,
        {
          count: "exact",
        },
      )
      .order("created_at", { ascending: false })
      .range(start, end);

    if (searchQuery) {
      query = query.ilike("profiles.full_name", `%${searchQuery}%`);
    }

    if (typeFilter) {
      query = query.eq("type", typeFilter); 
    }

    const { data: notifications, error, count } = await query;

    if (error) {
      console.error("Error fetching notifications:", error);
      return { data: [], count: 0, itemsPerPage };
    }

    return { data: notifications, count, itemsPerPage };
  }

  public async deleteAllActivitiesByIds(ids: string[]) {
    const { data, error } = await supabase
      .from(this.className)
      .delete()
      .in("id", ids);

    if (error) {
      console.error("Error deleting notifications:", error);
      return { error };
    }

    return { data };
  }
}

export default new AdminNotificationsService();
