import { describe, it, expect } from "vitest";

import {
  canInviteMember,
  canRemoveMember,
  canCreateBoard,
  canDeleteBoard,
  canViewWorkspace,
  canManageBilling
} from "../services/workspacePermissionService";

describe("workspacePermissionService", () => {
  it("checks invite permission", () => {
    expect(canInviteMember("owner")).toBe(true);
    expect(canInviteMember("admin")).toBe(true);
    expect(canInviteMember("member")).toBe(false);
    expect(canInviteMember("viewer")).toBe(false);
  });

  it("checks remove member permission", () => {
    expect(canRemoveMember("owner")).toBe(true);
    expect(canRemoveMember("admin")).toBe(true);
    expect(canRemoveMember("member")).toBe(false);
    expect(canRemoveMember("viewer")).toBe(false);
  });

  it("checks create board permission", () => {
    expect(canCreateBoard("owner")).toBe(true);
    expect(canCreateBoard("admin")).toBe(true);
    expect(canCreateBoard("member")).toBe(true);
    expect(canCreateBoard("viewer")).toBe(false);
  });

  it("checks delete board permission", () => {
    expect(canDeleteBoard("owner")).toBe(true);
    expect(canDeleteBoard("admin")).toBe(true);
    expect(canDeleteBoard("member")).toBe(false);
    expect(canDeleteBoard("viewer")).toBe(false);
  });

  it("checks workspace view permission", () => {
    expect(canViewWorkspace("owner")).toBe(true);
    expect(canViewWorkspace("admin")).toBe(true);
    expect(canViewWorkspace("member")).toBe(true);
    expect(canViewWorkspace("viewer")).toBe(true);
  });

  it("checks billing permission", () => {
    expect(canManageBilling("owner")).toBe(true);
    expect(canManageBilling("admin")).toBe(false);
    expect(canManageBilling("member")).toBe(false);
    expect(canManageBilling("viewer")).toBe(false);
  });
});