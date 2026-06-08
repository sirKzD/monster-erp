import type {
  WorkspaceInvite,
  WorkspaceMember,
  WorkspaceRole
} from "../types/workspace.types";

import { canInviteMember } from "./workspacePermissionService";

export function isValidInviteEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function hasExistingMember(
  members: WorkspaceMember[],
  email: string
): boolean {
  const normalized = email.trim().toLowerCase();

  return members.some(
    member => member.email.toLowerCase() === normalized
  );
}

export function createWorkspaceInvite(
  workspaceId: string,
  email: string,
  role: WorkspaceRole,
  invitedBy: string,
  inviterRole: WorkspaceRole,
  existingMembers: WorkspaceMember[]
): WorkspaceInvite | null {
  if (!canInviteMember(inviterRole)) return null;
  if (!isValidInviteEmail(email)) return null;
  if (hasExistingMember(existingMembers, email)) return null;

  return {
    workspaceId,
    email: email.trim().toLowerCase(),
    role,
    invitedBy,
    createdAt: new Date().toISOString(),
    status: "pending"
  };
}