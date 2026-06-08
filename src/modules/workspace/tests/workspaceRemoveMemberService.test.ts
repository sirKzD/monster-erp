import { describe, it, expect } from "vitest";

import {
    canRemoveWorkspaceMember,
    removeWorkspaceMember
} from "../services/workspaceRemoveMemberService";

import type { WorkspaceMember } from "../types/workspace.types";

const owner: WorkspaceMember = {
    workspaceId: "workspace-1",
    userId: "owner-1",
    email: "owner@test.com",
    role: "owner",
    joinedAt: "2026-01-01T00:00:00.000Z"
};

const admin: WorkspaceMember = {
    workspaceId: "workspace-1",
    userId: "admin-1",
    email: "admin@test.com",
    role: "admin",
    joinedAt: "2026-01-01T00:00:00.000Z"
};

const member: WorkspaceMember = {
    workspaceId: "workspace-1",
    userId: "member-1",
    email: "member@test.com",
    role: "member",
    joinedAt: "2026-01-01T00:00:00.000Z"
};

const viewer: WorkspaceMember = {
    workspaceId: "workspace-1",
    userId: "viewer-1",
    email: "viewer@test.com",
    role: "viewer",
    joinedAt: "2026-01-01T00:00:00.000Z"
};

const members: WorkspaceMember[] = [
    owner,
    admin,
    member,
    viewer 
];

describe("workspaceRemoveMemberService", () => {
    it("allows owner to remove member", () => {
        expect(
            canRemoveWorkspaceMember(
                "owner",
                member,
                "owner-1"
            )
        ).toBe(true);
    });

    it("allows admin to remove member", () => {
        expect(
            canRemoveWorkspaceMember(
                "admin",
                member,
                "admin-1"
            )
        ).toBe(true);
    });

    it("blocks member/viewer from removing users", () => {
        expect(
            canRemoveWorkspaceMember(
                "member",
                viewer,
                "member-1"
            )
        ).toBe(false);

        expect(
            canRemoveWorkspaceMember(
                "viewer",
                member,
                "viewer-1"
            )
        ).toBe(false);
    });

    it("block owner from removing themselves", () => {
        expect(
            canRemoveWorkspaceMember(
                "owner",
                owner,
                "owner-1"
            )
        ).toBe(false);
    });

    it("blocks admin from removing owner", () => {
        expect(
            canRemoveWorkspaceMember(
                "admin",
                owner,
                "admin-1"
            )
        ).toBe(false);
    });

    it("removes target member from list", () => {
        const result = removeWorkspaceMember(
            members,
            "member-1",
            "owner-1",
            "owner"
        );

        expect(result).not.toBeNull();
        expect(result).toHaveLength(3);
        expect(
            result?.some(m => m.userId === "member-1")
        ).toBe(false);
    });

    it("return null when target does not exist", () => {
        const result = removeWorkspaceMember(
            members,
            "missing-user",
            "owner-1",
            "owner"
        );

        expect(result).toBeNull();
    });

    it("return null when actor has no permission", () => {
        const result = removeWorkspaceMember(
            members,
            "admin-1",
            "member-1",
            "member"
        );

        expect(result).toBeNull();
    });
});