import { useEffect, useState } from "react";
import type { SupabaseUser, SupabaseActivityLog } from "../../types";
import { fetchActivityLogs, createActivityLog } from "../../services/activityService";

interface UseActivityReturn {
  logs: SupabaseActivityLog[];
  addLog: (action: string, currentUser: SupabaseUser | null) => Promise<void>;
}

export default function useActivity(
  user: SupabaseUser | null,
  activeBoard: string
): UseActivityReturn {

  const [logs, setLogs] = useState<SupabaseActivityLog[]>([]);

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

    const optimisticLog: SupabaseActivityLog = {
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