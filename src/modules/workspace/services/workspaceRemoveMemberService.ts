import type {
    WorkspaceMember,
    WorkspaceRole
} from "../types/workspace.types";

import { canRemoveMember } from "./workspacePermissionService";

export function canRemoveWorkspaceMember(
    actorRole: WorkspaceRole,
    targetMember: WorkspaceMember,
    actorUserId: string 
): boolean {
    if (!canRemoveMember(actorRole)) return false;

    if (
        targetMember.role === "owner" &&
        targetMember.userId === actorUserId 
    ) {
        return false;
    }

    if (
        actorRole === "admin" &&
        targetMember.role === "owner"
    ) {
        return false;
    }

    return true;
}

export function removeWorkspaceMember(
    members: WorkspaceMember[],
    targetUserId: string,
    actorUserId: string,
    actorRole: WorkspaceRole 
): WorkspaceMember[] | null {
    const target = members.find(
        member => member.userId === targetUserId  
    );

    if (!target) return null;

    if (!canRemoveWorkspaceMember(
        actorRole,
        target,
        actorUserId
    )) {
        return null;
    }

    return members.filter(
        member => member.userId !== targetUserId 
    );
}