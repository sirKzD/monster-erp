import type {
    Workspace,
    WorkspaceMember
} from "../types/workspace.types";

export const workspaceRepository = {

    async createWorkspace(
        workspace: Workspace 
    ): Promise<Workspace | null> {
        return workspace;
    },

    async findWorkspaceById(
        workspaceId: string 
    ): Promise<Workspace | null> {
        return null;
    },

    async addMember(
        member: WorkspaceMember
    ): Promise<WorkspaceMember[]> {
        return [];
    },

    async listMembers(
        workspaceId: string
    ): Promise<WorkspaceMember[]> {
        return [];
    }
};