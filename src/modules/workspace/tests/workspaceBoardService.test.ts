import { describe, it, expect } from "vitest";

import {
    createWorkspaceBoardLink,
    canRemoveWorkspaceBoard
} from "../services/workspaceBoardService";

describe("workspaceBoardService", () => {
    it("allows owner/admin/member to create board link", () => {
        expect(
            createWorkspaceBoardLink(
                "workspace-1",
                "board-1",
                "user-1",
                "owner"
            )
        ).not.toBeNull();

        expect(
            createWorkspaceBoardLink(
                "workspace-1",
                "board-1",
                "user-1",
                "admin"
            )
        ).not.toBeNull();
    });

    it("creates board link data", () => {
        const result = createWorkspaceBoardLink(
            "workspace-1",
            "board_id",
            "user-1",
            "owner"
        );

        expect(result?.createdAt).toBeTruthy();
    });

    it("check remove workspace board permission", () => { 
        expect(canRemoveWorkspaceBoard("owner")).toBe(true);
        expect(canRemoveWorkspaceBoard("admin")).toBe(true);
        expect(canRemoveWorkspaceBoard("member")).toBe(false);
        expect(canRemoveWorkspaceBoard("viewer")).toBe(false);
    });
});