import { useState, useEffect } from "react";
import type { SupabaseUser } from "../../types";

import {
  fetchUserBoards, 
  checkBoardAccess,
  createBoard,
  inviteMember
} from "../../services/boardService";

interface UseBoardsReturn {
  boards: string[];
  activeBoard: string;
  setActiveBoard: React.Dispatch<React.SetStateAction<string>>;
  allowed: boolean;
  addBoard: () => Promise<void>;
  invite: (email: string) => Promise<void>;
}

export default function useBoards(
  user: SupabaseUser | null
): UseBoardsReturn {

  const [boards, setBoards] =
    useState<string[]>(["Personal"]);

  const [activeBoard, setActiveBoard] =
    useState<string>("Personal");

  const [allowed, setAllowed] =
    useState<boolean>(false);

  useEffect(() => {
    if (!user) return;

    const loadBoards = async (): Promise<void> => {
      const myBoards = await fetchUserBoards(user);

      if (myBoards.length > 0) {
        setBoards(myBoards);
        setActiveBoard(myBoards[0]);
      }
    };

    loadBoards();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const checkAccess = async (): Promise<void> => {
      const hasAccess = await checkBoardAccess(activeBoard, user);
      setAllowed(hasAccess);
    };

    checkAccess();
  }, [user, activeBoard]);

  const addBoard = async (): Promise<void> => {
    const name = prompt("Nama board?");
    if (!name) return;

    if (boards.includes(name)) {
      alert("Board sudah ada!");
      return;
    }

    if (!user) return;

    await createBoard(name, user);
    setBoards(prev => [...prev, name]);
    setActiveBoard(name);
  };

  const invite = async (email: string): Promise<void> => {
    if (!email || !user) return;

    const result = await inviteMember(activeBoard, email, user);

    if (result === "not_owner") alert("Kamu bukan owner board ini!");
    if (result === "already_invited") alert("Email ini sudah diinvite!");
  };

  return {
    boards,
    activeBoard,
    setActiveBoard,
    allowed,
    addBoard,
    invite
  };
}