import { activityRepository } from "../repositories";
import type { SupabaseUser, SupabaseActivityLog } from "../types";


export async function fetchActivityLogs(
  activeBoard: string
): Promise<SupabaseActivityLog[]> {
  return activityRepository.findByBoard(activeBoard);
}

export async function createActivityLog(
  activeBoard: string,
  action: string,
  currentUser: SupabaseUser | null
): Promise<void> {

  if (!currentUser) return;

  await activityRepository.insert({
    board_id: activeBoard,
    user_email: currentUser.email ?? "",
    text: action,
    created_at: new Date().toISOString()
  });
}