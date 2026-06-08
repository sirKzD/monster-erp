import { describe, it, expect } from "vitest";

import {
  canTransferOwnership,
  transferWorkspaceOwnership
} from "../services/workspaceOwnershipService";

import type { WorkspaceMember } from "../types/workspace.types";

const owner: WorkspaceMember = {
  workspaceId: "workspace-1",
  userId: "owner-1",
  email: "owner@test.com",
  role: "owner",
  joinedAt: "2026-01-01T00:00:00.000Z"
};

const admin: WorkspaceMember = {
  workspaceId: "workspace-1",
  userId: "admin-1",
  email: "admin@test.com",
  role: "admin",
  joinedAt: "2026-01-01T00:00:00.000Z"
};

const member: WorkspaceMember = {
  workspaceId: "workspace-1",
  userId: "member-1",
  email: "member@test.com",
  role: "member",
  joinedAt: "2026-01-01T00:00:00.000Z"
};

const viewer: WorkspaceMember = {
  workspaceId: "workspace-1",
  userId: "viewer-1",
  email: "viewer@test.com",
  role: "viewer",
  joinedAt: "2026-01-01T00:00:00.000Z"
};

const members: WorkspaceMember[] = [
  owner,
  admin,
  member,
  viewer
];

describe("workspaceOwnershipService", () => {
  it("allows owner to transfer ownership to admin", () => {
    expect(canTransferOwnership(owner, admin)).toBe(true);
  });

  it("allows owner to transfer ownership to member", () => {
    expect(canTransferOwnership(owner, member)).toBe(true);
  });

  it("blocks non-owner from transferring ownership", () => {
    expect(canTransferOwnership(admin, member)).toBe(false);
    expect(canTransferOwnership(member, admin)).toBe(false);
  });

  it("blocks transfer to viewer", () => {
    expect(canTransferOwnership(owner, viewer)).toBe(false);
  });

  it("blocks transfer to self", () => {
    expect(canTransferOwnership(owner, owner)).toBe(false);
  });

  it("transfers ownership and demotes old owner to admin", () => {
    const result = transferWorkspaceOwnership(
      members,
      "owner-1",
      "member-1"
    );

    expect(result).not.toBeNull();

    const oldOwner = result?.find(m => m.userId === "owner-1");
    const newOwner = result?.find(m => m.userId === "member-1");

    expect(oldOwner?.role).toBe("admin");
    expect(newOwner?.role).toBe("owner");
  });

  it("returns null when actor is not owner", () => {
    const result = transferWorkspaceOwnership(
      members,
      "admin-1",
      "member-1"
    );

    expect(result).toBeNull();
  });

  it("returns null when target does not exist", () => {
    const result = transferWorkspaceOwnership(
      members,
      "owner-1",
      "missing-user"
    );

    expect(result).toBeNull();
  });
});