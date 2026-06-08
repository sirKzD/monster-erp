import type { WorkspaceAuditEvent } from "./workspaceAuditService";

export interface WorkspaceNotification {
    id: string;
    workspaceId: string;
    userId: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export function createNotificationFromAuditEvent(
    event: WorkspaceAuditEvent,
    userId: string 
): WorkspaceNotification {
    return {
        id: crypto.randomUUID(),
        workspaceId: event.workspaceId,
        userId,
        title: event.action,
        message: event.target
          ? `${event.action}: ${event.target}`
          : event.action,
          read: false,
          createdAt: new Date().toISOString()
    };
}

export function markNotificationRead(
    notification: WorkspaceNotification
): WorkspaceNotification {
    return {
        ...notification,
        read: true
    };
}

export function filterUnreadNotifications(
    notifications: WorkspaceNotification[]
): WorkspaceNotification[] {
    return notifications.filter(
        notification => !notification.read 
    );
}