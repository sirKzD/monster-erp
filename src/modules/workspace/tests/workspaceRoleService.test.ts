import { describe, it, expect } from "vitest";

import {
  canChangeMemberRole,
  changeWorkspaceMemberRole
} from "../services/workspaceRoleService";

import type { WorkspaceMember } from "../types/workspace.types";

const member: WorkspaceMember = {
  workspaceId: "workspace-1",
  userId: "user-2",
  email: "member@test.com",
  role: "member",
  joinedAt: "2026-01-01T00:00:00.000Z"
};

const owner: WorkspaceMember = {
  workspaceId: "workspace-1",
  userId: "user-1",
  email: "owner@test.com",
  role: "owner",
  joinedAt: "2026-01-01T00:00:00.000Z"
};

describe("workspaceRoleService", () => {
  it("allows owner/admin to change member role", () => {
    expect(canChangeMemberRole("owner", "member")).toBe(true);
    expect(canChangeMemberRole("admin", "member")).toBe(true);
  });

  it("blocks member/viewer from changing roles", () => {
    expect(canChangeMemberRole("member", "viewer")).toBe(false);
    expect(canChangeMemberRole("viewer", "member")).toBe(false);
  });

  it("blocks admin from changing owner role", () => {
    expect(canChangeMemberRole("admin", "owner")).toBe(false);
  });

  it("changes member role", () => {
    const updated = changeWorkspaceMemberRole(
      "owner",
      member,
      "admin"
    );

    expect(updated?.role).toBe("admin");
    expect(updated?.userId).toBe("user-2");
  });

  it("blocks changing owner into another role", () => {
    const updated = changeWorkspaceMemberRole(
      "owner",
      owner,
      "admin"
    );

    expect(updated).toBeNull();
  });

  it("blocks unauthorized actor", () => {
    const updated = changeWorkspaceMemberRole(
      "member",
      member,
      "admin"
    );

    expect(updated).toBeNull();
  });
});