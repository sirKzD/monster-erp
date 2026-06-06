import type { ActivityLogRow } from "../types/activity.types";

interface ActivityLogProps {
  logs: ActivityLogRow[];
}

function ActivityLog({ logs }: ActivityLogProps) {
  return (
    <div className="activity-log">
      <h3>📜 Activity Log</h3>

      {logs.length === 0 && <p>No activity yet...</p>}

      {logs.map((log, index) => (
        <div key={index} className="activity-item">
          <strong>{log.user_email}</strong>
          <p>{log.text}</p>        
          <small>
            {new Date(log.created_at ?? "").toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default ActivityLog;