import { useEffect, useState } from "react";
import {
  fetchActivityLogs,
  createActivityLog
} from "../services/activityService";
import type { ActivityLogRow } from "../types/activity.types";
import type { SupabaseUser } from "../../../types";

interface UseActivityReturn {
  logs: ActivityLogRow[];
  addLog: (action: string, currentUser: SupabaseUser | null) => Promise<void>;
}

export default function useActivity(
  user: SupabaseUser | null,
  activeBoard: string
): UseActivityReturn {

  const [logs, setLogs] = useState<ActivityLogRow[]>([]);

  useEffect(() => {
    if (!activeBoard) return;

    const loadLogs = async (): Promise<void> => {
      const data = await fetchActivityLogs(activeBoard);
      setLogs(data);
    };

    loadLogs();
  }, [activeBoard]);

  const addLog = async (
    action: string,
    currentUser: SupabaseUser | null
  ): Promise<void> => {
    if (!currentUser) return;

    const optimisticLog: ActivityLogRow = {
      id: Date.now(),
      board_id: activeBoard,
      user_email: currentUser.email ?? "",
      text: action,            
      created_at: new Date().toISOString()
    };

    setLogs(prev => [optimisticLog, ...prev]);
    await createActivityLog(activeBoard, action, currentUser);
  };

  return { logs, addLog };
}