import { describe, it, expect } from "vitest";

import {
  createWorkspaceDashboardSummary
} from "../services/workspaceDashboardService";

describe("workspaceDashboardService", () => {
  it("creates workspace dashboard summary", () => {
    const summary = createWorkspaceDashboardSummary(
      [
        {
          workspaceId: "workspace-1",
          userId: "user-1",
          email: "owner@test.com",
          role: "owner",
          joinedAt: "2026-01-01T00:00:00.000Z"
        }
      ],
      [
        {
          workspaceId: "workspace-1",
          email: "new@test.com",
          role: "member",
          invitedBy: "user-1",
          createdAt: "2026-01-01T00:00:00.000Z",
          status: "pending"
        }
      ],
      [
        {
          id: "notification-1",
          workspaceId: "workspace-1",
          userId: "user-1",
          title: "invite_member",
          message: "invite_member: new@test.com",
          read: false,
          createdAt: "2026-01-01T00:00:00.000Z"
        }
      ],
      [
        {
          actorId: "user-1",
          action: "invite_member",
          target: "new@test.com",
          createdAt: "2026-01-01T00:00:00.000Z"
        }
      ],
      [
        {
          workspaceId: "workspace-1",
          boardId: "board-1",
          createdBy: "user-1",
          createdAt: "2026-01-01T00:00:00.000Z"
        }
      ]
    );

    expect(summary).toEqual({
      membersCount: 1,
      pendingInvitesCount: 1,
      unreadNotificationsCount: 1,
      recentActivityCount: 1,
      boardsCount: 1
    });
  });
});