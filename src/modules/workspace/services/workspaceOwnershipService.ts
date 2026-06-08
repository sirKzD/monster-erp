import type { WorkspaceMember } from "../types/workspace.types";

export function canTransferOwnership(
  actor: WorkspaceMember,
  target: WorkspaceMember | undefined
): boolean {
  if (actor.role !== "owner") return false;
  if (!target) return false;
  if (actor.userId === target.userId) return false;
  if (target.role === "viewer") return false;

  return true;
}

export function transferWorkspaceOwnership(
  members: WorkspaceMember[],
  actorUserId: string,
  targetUserId: string
): WorkspaceMember[] | null {
  const actor = members.find(
    member => member.userId === actorUserId
  );

  const target = members.find(
    member => member.userId === targetUserId
  );

  if (!actor) return null;
  if (!canTransferOwnership(actor, target)) return null;

  return members.map(member => {
    if (member.userId === actorUserId) {
      return {
        ...member,
        role: "admin"
      };
    }

    if (member.userId === targetUserId) {
      return {
        ...member,
        role: "owner"
      };
    }

    return member;
  });
}