import type {
    Workspace,
    WorkspaceInvite,
    WorkspaceMember
} from "../types/workspace.types";

import type { WorkspaceBoard } from "./workspaceBoardService";
import type { WorkspaceFeedItem } from "./workspaceActivityFeedService";
import type { WorkspaceNotification } from "./workspaceNotificationService";

export interface WorkspaceDashboardSummary {
    membersCount: number;
    pendingInvitesCount: number;
    unreadNotificationsCount: number;
    recentActivityCount: number;
    boardsCount: number;
}

export function createWorkspaceDashboardSummary(
    members: WorkspaceMember[],
    invites: WorkspaceInvite[],
    notifications: WorkspaceNotification[],
    feed: WorkspaceFeedItem[],
    boards: WorkspaceBoard[]
): WorkspaceDashboardSummary {
    return {
        membersCount: members.length,
        pendingInvitesCount: invites.filter(
            invite => invite.status === "pending"
        ).length,
        unreadNotificationsCount: notifications.filter(
            notifications => !notifications.read 
        ).length,
        recentActivityCount: feed.length,
        boardsCount: boards.length
    };
}