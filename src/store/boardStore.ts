import { create } from "zustand";

interface BoardStore {
  boards: string[];
  activeBoard: string;
  allowed: boolean;
  setBoards: (boards: string[]) => void;
  setActiveBoard: (board: string) => void;
  setAllowed: (allowed: boolean) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  boards: ["Personal"],
  activeBoard: "Personal",
  allowed: false,
  setBoards: (boards) => set({ boards }),
  setActiveBoard: (activeBoard) => set({ activeBoard }),
  setAllowed: (allowed) => set({ allowed })
}));