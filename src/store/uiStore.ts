import { create } from "zustand";

type Priority = "low" | "medium" | "high";
type FilterType = "all" | "done" | "pending";
type Theme = "light" | "dark";

interface UIStore {
  // Dark mode
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Search & filter
  search: string;
  filter: FilterType;
  setSearch: (search: string) => void;
  setFilter: (filter: FilterType) => void;

  // Input form
  input: string;
  priority: Priority;
  deadline: string;
  setInput: (input: string) => void;
  setPriority: (priority: Priority) => void;
  setDeadline: (deadline: string) => void;
  resetForm: () => void;

  // Invite
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Dark mode
  darkMode: localStorage.getItem("darkMode") === "true",
  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkMode;
      localStorage.setItem("darkMode", String(next));
      document.body.classList.toggle("dark", next);
      return { darkMode: next };
    }),

  // Search & filter
  search: "",
  filter: "all",
  setSearch: (search) => set({ search }),
  setFilter: (filter) => set({ filter }),

  // Input form
  input: "",
  priority: "medium",
  deadline: "",
  setInput: (input) => set({ input }),
  setPriority: (priority) => set({ priority }),
  setDeadline: (deadline) => set({ deadline }),
  resetForm: () =>
    set({ input: "", priority: "medium", deadline: "" }),

  // Invite
  inviteEmail: "",
  setInviteEmail: (inviteEmail) => set({ inviteEmail })
}));