import type { WorkspaceRole } from "../types/workspace.types";
import { canCreateBoard, canDeleteBoard } from "./workspacePermissionService";

export interface WorkspaceBoard {
    workspaceId: string;
    boardId: string;
    createdBy: string;
    createdAt: string;
}

export function createWorkspaceBoardLink(
    workspaceId: string,
    boardId: string,
    userId: string,
    role: WorkspaceRole 
): WorkspaceBoard | null {
    if (!canCreateBoard(role)) return null;

    return {
        workspaceId,
        boardId,
        createdBy: userId,
        createdAt: new Date().toISOString()
    };
}

export function canRemoveWorkspaceBoard(
    role: WorkspaceRole
): boolean {
    return canDeleteBoard(role);
}