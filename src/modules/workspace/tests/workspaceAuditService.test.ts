import {
    describe,
    it,
    expect
} from "vitest";

import {
    createAuditEvent,
    filterAuditEvents
} from "../services/workspaceAuditService";

describe("workspaceAuditService", () => {

    it("creates audit event", () => {

        const event = createAuditEvent(
             "workspace-1",
             "user-1",
             "invite_member",
             "user@test.com"
            );

            expect(event.workspaceId)
              .toBe("workspace-1");

            expect(event.action)
              .toBe("invite_member");

            expect(event.target)
              .toBe("user@test.com");

            expect(event.createdAt)
              .toBeTruthy();
    });

    it("filter audit events", () => {

        const events = [
            createAuditEvent(
                "workspace-1",
                "user-1",
                "invite_member"
            ),
            createAuditEvent(
                "workspace-1",
                "user-1",
                "remove_member"
            )
        ];

        const result = 
          filterAuditEvents(
            events,
            "invite_member"
          );

        expect(result).toHaveLength(1);
        expect(result[0].action)
          .toBe("invite_member");
    });
});