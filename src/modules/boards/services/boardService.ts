import { boardRepository } from "../repositories/boardRepository";
import type { SupabaseUser } from "../../../types";

export async function fetchUserBoards(
  user: SupabaseUser
): Promise<string[]> {

  const data = await boardRepository.findAll();

  return data
    .filter(b =>
      b.owner_email === user.email ||
      b.members?.includes(user.email ?? "")
    )
    .map(b => b.id);
}

export async function checkBoardAccess(
  boardId: string,
  user: SupabaseUser
): Promise<boolean> {

  const data = await boardRepository.findById(boardId);

  if (!data) return true;

  const isOwner = data.owner_email === user.email;
  const isMember = data.members?.includes(user.email ?? "") ?? false;

  return isOwner || isMember;
}


export async function createBoard(
  name: string,
  user: SupabaseUser
): Promise<string | null> {

  const result = await boardRepository.insert({
    id: name,
    owner_email: user.email ?? null,
    members: []
  });

  return result ? result.id : null;
}


export async function inviteMember(
  boardId: string,
  email: string,
  user: SupabaseUser
): Promise<"success" | "not_owner" | "already_invited" | "error"> {

  const data = await boardRepository.findById(boardId);

  if (!data) return "error";
  if (data.owner_email !== user.email) return "not_owner";

  const members = data.members ?? [];
  if (members.includes(email)) return "already_invited";

  const updated = await boardRepository.update(boardId, {
    members: [...members, email]
  });

  return updated ? "success" : "error";
}