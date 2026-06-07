export type WorkspaceRole =
  | "owner"
  | "admin"
  | "member"
  | "viewer";

export interface Workspace {
    id: string;
    name: string;
    ownerId: string;
    createdAt: string;
}

export interface WorkspaceMember {
    workspaceId: string;
    userId: string;
    email: string;
    role: WorkspaceRole;
    joinedAt: string;
}

export interface CreateWorkspaceInput {
    name: string;
    ownerId: string;
}

export interface InviteWorkspaceMemberInput {
    workspaceId: string;
    email: string;
    role: WorkspaceRole;
}