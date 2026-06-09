import {
    describe,
    it,
    expect
} from "vitest";

import {
    createAuditEvent
} from "../services/workspaceAuditService";

import {
    createFeedFromAuditEvents,
    filterFeedByActor,
    filterFeedByAction
} from "../services/workspaceActivityFeedService";

describe("workspaceActivityFeedService", () => {

  it("creates activity feed", () => {

    const events = [
      createAuditEvent(
        "workspace-1",
        "user-1",
        "invite_member"
      ),
      createAuditEvent(
        "workspace-1",
        "user-2",
        "remove_member"
      )
    ];

    const feed =
      createFeedFromAuditEvents(events);

    expect(feed).toHaveLength(2);
  });

  it("filters by actor", () => {

    const feed =
      createFeedFromAuditEvents([
        createAuditEvent(
          "workspace-1",
          "user-1",
          "invite_member"
        ),
        createAuditEvent(
          "workspace-1",
          "user-2",
          "remove_member"
        )
      ]);

    const result =
      filterFeedByActor(
        feed,
        "user-1"
      );

    expect(result).toHaveLength(1);
    expect(result[0].actorId)
      .toBe("user-1");
  });

  it("filters by action", () => {

    const feed =
      createFeedFromAuditEvents([
        createAuditEvent(
          "workspace-1",
          "user-1",
          "invite_member"
        ),
        createAuditEvent(
          "workspace-1",
          "user-2",
          "remove_member"
        )
      ]);

    const result =
      filterFeedByAction(
        feed,
        "invite_member"
      );

    expect(result).toHaveLength(1);
    expect(result[0].action)
      .toBe("invite_member");
  });
});