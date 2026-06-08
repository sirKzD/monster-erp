import type {
    Workspace,
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

export function acceptWorkspaceInvite(
    invite: WorkspaceInvite,
    userId: string 
): WorkspaceMember | null {
    if (invite.status !== "pending") return null;

    return {
        workspaceId: invite.workspaceId,
        userId,
        email: invite.email,
        role: invite.role,
        joinedAt: new Date().toISOString()
    };
}

export function markInviteAccepted(
    invite: WorkspaceInvite
): WorkspaceInvite | null {
    if (invite.status !== "pending") return null;

    return {
        ...invite,
        status: "accepted"
    };
}

export function rejectWorkspaceInvite(
    invite: WorkspaceInvite
): WorkspaceInvite | null {
    if (invite.status !== "pending") return null;

    return {
        ...invite,
        status: "rejected"
    };
}