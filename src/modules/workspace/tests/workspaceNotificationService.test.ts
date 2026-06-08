import {
    describe,
    it,
    expect,
    vi,
    beforeEach
} from "vitest";

import {
    createNotificationFromAuditEvent,
    markNotificationRead,
    filterUnreadNotifications
} from "../services/workspaceNotificationService";

import {
    createAuditEvent
} from "../services/workspaceAuditService";

beforeEach(() => {
    vi.stubGlobal("crypto", {
        randomUUID: () => "notification-1"
    });
});

describe("workspaceNotificationServices", () => {
    it("creates notification from audit event", () => {
        const event = createAuditEvent(
            "workspace-1",
            "actor-1",
            "invite_member",
            "user@test.com"
        );

        const notification =
          createNotificationFromAuditEvent(
            event,
            "user-2"
          );

        expect(notification).toMatchObject({
            id: "notification-1",
            workspaceId: "workspace-1",
            userId: "user-2",
            title: "invite_member",
            message: "invite_member: user@test.com",
            read: false
        });

        expect(notification.createdAt).toBeTruthy();
    });

    it("marks notification as read", () => {
        const event = createAuditEvent(
            "workspace-1",
            "actor-1",
            "remove_member"
        );

        const notification =
          createNotificationFromAuditEvent(
            event,
            "user-2"
          );

          const readNotification =
            markNotificationRead(notification);

        expect(readNotification.read).toBe(true);
    });

    it("filter unread noification", () => {
        const event = createAuditEvent(
            "workspace-1",
            "actor-1",
            "role_changed"
        );

        const notification =
          createNotificationFromAuditEvent(
            event,
            "user-2"
          );

          const readNotification =
            markNotificationRead(notification);

          const result = 
            filterUnreadNotifications([
                notification,
                readNotification
            ]);

        expect(result).toHaveLength(1);
        expect(result[0].read).toBe(false)
    });
});