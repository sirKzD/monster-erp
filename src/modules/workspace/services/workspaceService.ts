import type {
  Workspace,
  WorkspaceMember,
  CreateWorkspaceInput,
  InviteWorkspaceMemberInput
} from "../types/workspace.types";

export function createWorkspaceDraft(
  input: CreateWorkspaceInput
): Workspace {
  return {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    ownerId: input.ownerId,
    createdAt: new Date().toISOString()
  };
}

export function validateWorkspaceName(name: string): boolean {
  return name.trim().length >= 3;
}

export function createOwnerMember(
  workspace: Workspace,
  email: string
): WorkspaceMember {
  return {
    workspaceId: workspace.id,
    userId: workspace.ownerId,
    email,
    role: "owner",
    joinedAt: new Date().toISOString()
  };
}

export function createInvitedMemberDraft(
  input: InviteWorkspaceMemberInput
): Omit<WorkspaceMember, "userId" | "joinedAt"> {
  return {
    workspaceId: input.workspaceId,
    email: input.email.trim().toLowerCase(),
    role: input.role
  };
}

export function canManageWorkspace(role: string): boolean {
  return role === "owner" || role === "admin";
}