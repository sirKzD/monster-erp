import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createWorkspaceDraft,
  validateWorkspaceName,
  createOwnerMember,
  createInvitedMemberDraft,
  canManageWorkspace
} from "../services/workspaceService";

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "workspace-1"
  });
});

describe("workspaceService", () => {
  it("creates workspace draft", () => {
    const workspace = createWorkspaceDraft({
      name: " Monster ERP ",
      ownerId: "user-1"
    });

    expect(workspace.id).toBe("workspace-1");
    expect(workspace.name).toBe("Monster ERP");
    expect(workspace.ownerId).toBe("user-1");
    expect(workspace.createdAt).toBeTruthy();
  });

  it("validates workspace name", () => {
    expect(validateWorkspaceName("ERP")).toBe(true);
    expect(validateWorkspaceName("  ")).toBe(false);
    expect(validateWorkspaceName("ab")).toBe(false);
  });

  it("creates owner member", () => {
    const workspace = createWorkspaceDraft({
      name: "Monster ERP",
      ownerId: "user-1"
    });

    const member = createOwnerMember(
      workspace,
      "owner@test.com"
    );

    expect(member.workspaceId).toBe("workspace-1");
    expect(member.userId).toBe("user-1");
    expect(member.role).toBe("owner");
  });

  it("creates invited member draft", () => {
    const member = createInvitedMemberDraft({
      workspaceId: "workspace-1",
      email: " USER@TEST.COM ",
      role: "member"
    });

    expect(member.email).toBe("user@test.com");
    expect(member.role).toBe("member");
  });

  it("checks workspace manager permission", () => {
    expect(canManageWorkspace("owner")).toBe(true);
    expect(canManageWorkspace("admin")).toBe(true);
    expect(canManageWorkspace("member")).toBe(false);
    expect(canManageWorkspace("viewer")).toBe(false);
  });
});