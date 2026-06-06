import { supabase } from "../../../utils/supabase";
import type { ActivityLogRow, ActivityLogInsert } from "../types/activity.types";

export const activityRepository = {

  async findByBoard(
    boardId: string,
    limit = 30
  ): Promise<ActivityLogRow[]> {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("board_id", boardId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[activityRepository.findByBoard]", error);
      return [];
    }

    return data ?? [];
  },

  async insert(
    payload: ActivityLogInsert
  ): Promise<ActivityLogRow | null> {
    const { data, error } = await supabase
      .from("activity_logs")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("[activityRepository.insert]", error);
      return null;
    }

    return data;
  }
};