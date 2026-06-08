import { describe, it, expect } from "vitest";

import {
  isValidInviteEmail,
  hasExistingMember,
  createWorkspaceInvite,
  acceptWorkspaceInvite,
  markInviteAccepted,
  rejectWorkspaceInvite
} from "../services/workspaceInviteService";

import type { WorkspaceMember } from "../types/workspace.types";

const members: WorkspaceMember[] = [
  {
    workspaceId: "workspace-1",
    userId: "user-1",
    email: "owner@test.com",
    role: "owner",
    joinedAt: "2026-01-01T00:00:00.000Z"
  }
];

describe("workspaceInviteService", () => {
  it("validates email", () => {
    expect(isValidInviteEmail("user@test.com")).toBe(true);
    expect(isValidInviteEmail("invalid-email")).toBe(false);
  });

  it("detects existing member", () => {
    expect(hasExistingMember(members, "OWNER@test.com")).toBe(true);
    expect(hasExistingMember(members, "new@test.com")).toBe(false);
  });

  it("creates invite when allowed", () => {
    const invite = createWorkspaceInvite(
      "workspace-1",
      " NEW@TEST.COM ",
      "member",
      "user-1",
      "owner",
      members
    );

    expect(invite).toMatchObject({
      workspaceId: "workspace-1",
      email: "new@test.com",
      role: "member",
      invitedBy: "user-1",
      status: "pending"
    });
  });

  it("blocks invite when inviter has no permission", () => {
    const invite = createWorkspaceInvite(
      "workspace-1",
      "new@test.com",
      "member",
      "user-1",
      "viewer",
      members
    );

    expect(invite).toBeNull();
  });

  it("blocks invalid email", () => {
    const invite = createWorkspaceInvite(
      "workspace-1",
      "bad-email",
      "member",
      "user-1",
      "owner",
      members
    );

    expect(invite).toBeNull();
  });

  it("blocks duplicate member invite", () => {
    const invite = createWorkspaceInvite(
      "workspace-1",
      "owner@test.com",
      "member",
      "user-1",
      "owner",
      members
    );

    expect(invite).toBeNull();
  });

    it("accept pending invite and creates workspace member", () => {
        const invite = createWorkspaceInvite(
            "workspace-1",
            "new@test.com",
            "member",
            "user-owner",
            "owner",
            members 
        );

        expect(invite).not.toBeNull();

        const member = acceptWorkspaceInvite(invite!, "user-2");

        expect(member).toMatchObject({
            workspaceId: "workspace-1",
            userId: "user-2",
            email: "new@test.com",
            role: "member"
        });

        expect(member?.joinedAt).toBeTruthy();
    });

    it("marks invite as accepted", () => {
        const invite = createWorkspaceInvite(
            "workspace-1",
            "new@test.com",
            "member",
            "user-owner",
            "owner",
            members 
        );

        const accepted = markInviteAccepted(invite!);

        expect(accepted?.status).toBe("accepted");
    });

    it("reject pending invite", () => {
        const invite = createWorkspaceInvite(
            "workspace-1",
            "new@test.com",
            "member",
            "user-owner",
            "owner",
            members 
        );

        const rejected = rejectWorkspaceInvite(invite!);

        expect(rejected?.status).toBe("rejected");
    });

    it("does not accept non-pending invite", () => {
        const invite = createWorkspaceInvite(
            "workspace-1",
            "new@test.com",
            "member",
            "user-owner",
            "owner",
            members 
        )!;

        const acceptedInvite = markInviteAccepted(invite)!;
        const member = acceptWorkspaceInvite(acceptedInvite, "user-2");

        expect(member).toBeNull();
    });
});