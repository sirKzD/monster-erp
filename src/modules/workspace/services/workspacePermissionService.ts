import type { WorkspaceRole } from "../types/workspace.types";

export function canInviteMember(role: WorkspaceRole): boolean {
    return role === "owner" || role == "admin";
}

export function canRemoveMember(role: WorkspaceRole): boolean {
    return role === "owner" || role === "admin";
}

export function canCreateBoard(role: WorkspaceRole): boolean {
    return role === "owner" || role === "admin" || role === "member";
}

export function canDeleteBoard(role: WorkspaceRole): boolean {
    return role === "owner" || role === "admin";
}

export function canViewWorkspace(role: WorkspaceRole): boolean {
    return ["owner", "admin", "member", "viewer"].includes(role);
}

export function canManageBilling(role: WorkspaceRole): boolean {
    return role === "owner";
}