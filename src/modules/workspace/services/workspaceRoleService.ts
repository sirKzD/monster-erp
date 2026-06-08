import type {
    WorkspaceMember,
    WorkspaceRole
} from "../types/workspace.types";

import { canManageWorkspace } from "./workspaceService";

export function canChangeMemberRole(
    actorRole: WorkspaceRole,
    targetRole: WorkspaceRole 
): boolean {
    if (!canManageWorkspace(actorRole)) return false;

    if (targetRole === "owner" && actorRole !== "owner") {
        return false;
    }

    return true;
}

export function changeWorkspaceMemberRole(
    actorRole: WorkspaceRole,
    member: WorkspaceMember,
    newRole: WorkspaceRole 
): WorkspaceMember | null {
    if (!canChangeMemberRole(actorRole, member.role)) {
        return null;
    }

    if (member.role === "owner" && newRole !== "owner") {
        return null;
    }

    return {
        ...member,
        role: newRole 
    };
}