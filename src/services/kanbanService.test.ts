import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  addColumn,
  deleteColumn,
  renameColumn,
  generateAITasks
} from "./kanbanService";

import type { KanbanColumns, SupabaseUser } from "../types";

const mockUser = {
  id: "user-1",
  email: "owner@test.com"
} as SupabaseUser;

const createColumns = (): KanbanColumns => ({
  todo: [
    {
      id: "1",
      text: "Task 1",
      done: false,
      priority: "medium",
      deadline: undefined,
      createdAt: 1
    }
  ],
  progress: [],
  done: []
});

function createSetColumnsMock(initial: KanbanColumns) {
  let state = initial;

  const setColumns = vi.fn((updater) => {
    state =
      typeof updater === "function"
        ? updater(state)
        : updater;
  });

  return {
    setColumns,
    getState: () => state
  };
}

describe("kanbanService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("addTodo adds a new task and calls addLog + onSuccess", () => {
    const { setColumns, getState } = createSetColumnsMock(createColumns());
    const addLog = vi.fn();
    const onSuccess = vi.fn();

    addTodo({
      input: "New Task",
      priority: "high",
      deadline: "2026-01-01",
      columns: getState(),
      setColumns,
      addLog,
      user: mockUser,
      onSuccess
    });

    expect(getState().todo).toHaveLength(2);
    expect(getState().todo[1].text).toBe("New Task");
    expect(getState().todo[1].priority).toBe("high");
    expect(addLog).toHaveBeenCalledWith(
      'added task "New Task"',
      mockUser
    );
    expect(onSuccess).toHaveBeenCalled();
  });

  it("addTodo does nothing when input is empty", () => {
    const { setColumns, getState } = createSetColumnsMock(createColumns());
    const addLog = vi.fn();
    const onSuccess = vi.fn();

    addTodo({
      input: "   ",
      priority: "medium",
      deadline: "",
      columns: getState(),
      setColumns,
      addLog,
      user: mockUser,
      onSuccess
    });

    expect(getState().todo).toHaveLength(1);
    expect(addLog).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("toggleTodo toggles done status", () => {
    const { setColumns, getState } = createSetColumnsMock(createColumns());

    toggleTodo("todo", "1", setColumns);

    expect(getState().todo[0].done).toBe(true);
  });

  it("deleteTodo removes task and logs action", () => {
    const columns = createColumns();
    const { setColumns, getState } = createSetColumnsMock(columns);
    const addLog = vi.fn();

    deleteTodo(
      "todo",
      "1",
      columns,
      setColumns,
      addLog,
      mockUser
    );

    expect(getState().todo).toHaveLength(0);
    expect(addLog).toHaveBeenCalledWith(
      'deleted task "Task 1"',
      mockUser
    );
  });

  it("editTodo updates task text and logs action", () => {
    const { setColumns, getState } = createSetColumnsMock(createColumns());
    const addLog = vi.fn();

    editTodo(
      "todo",
      "1",
      "Updated Task",
      setColumns,
      addLog,
      mockUser
    );

    expect(getState().todo[0].text).toBe("Updated Task");
    expect(addLog).toHaveBeenCalledWith(
      'edited task "Updated Task"',
      mockUser
    );
  });

  it("addColumn creates new column from prompt", () => {
    const { setColumns, getState } = createSetColumnsMock(createColumns());
    const addLog = vi.fn();

    vi.spyOn(window, "prompt").mockReturnValue("My Column");

    addColumn(setColumns, addLog, mockUser);

    expect(getState().my_column).toEqual([]);
    expect(addLog).toHaveBeenCalledWith(
      'created column "my_column"',
      mockUser
    );
  });

  it("addColumn does nothing when prompt is cancelled", () => {
    const { setColumns, getState } = createSetColumnsMock(createColumns());
    const addLog = vi.fn();

    vi.spyOn(window, "prompt").mockReturnValue(null);

    addColumn(setColumns, addLog, mockUser);

    expect(getState().todo).toHaveLength(1);
    expect(addLog).not.toHaveBeenCalled();
  });

  it("deleteColumn deletes selected column", () => {
    const columns: KanbanColumns = {
      ...createColumns(),
      testing: []
    };

    const { setColumns, getState } = createSetColumnsMock(columns);
    const addLog = vi.fn();

    deleteColumn(
      "testing",
      columns,
      setColumns,
      addLog,
      mockUser
    );

    expect(getState().testing).toBeUndefined();
    expect(addLog).toHaveBeenCalledWith(
      'deleted column "testing"',
      mockUser
    );
  });

  it("renameColumn renames column", () => {
    const columns: KanbanColumns = {
      ...createColumns(),
      old_column: []
    };

    const { setColumns, getState } = createSetColumnsMock(columns);
    const addLog = vi.fn();

    renameColumn(
      "old_column",
      "new_column",
      columns,
      setColumns,
      addLog,
      mockUser
    );

    expect(getState().old_column).toBeUndefined();
    expect(getState().new_column).toEqual([]);
    expect(addLog).toHaveBeenCalledWith(
      'renamed column "old_column" to "new_column"',
      mockUser
    );
  });

  it("renameColumn does nothing if new column already exists", () => {
    const columns: KanbanColumns = {
      ...createColumns(),
      old_column: [],
      new_column: []
    };

    const { setColumns, getState } = createSetColumnsMock(columns);
    const addLog = vi.fn();

    renameColumn(
      "old_column",
      "new_column",
      columns,
      setColumns,
      addLog,
      mockUser
    );

    expect(getState().old_column).toEqual([]);
    expect(addLog).not.toHaveBeenCalled();
  });

  it("generateAITasks creates 6 AI tasks", () => {
    const columns = createColumns();
    const { setColumns, getState } = createSetColumnsMock(columns);
    const addLog = vi.fn();

    generateAITasks(
      "React TypeScript",
      columns,
      setColumns,
      addLog,
      mockUser
    );

    expect(getState().todo).toHaveLength(7);
    expect(getState().todo[1].text).toContain("React TypeScript");
    expect(addLog).toHaveBeenCalledWith(
      'AI generated tasks for "React TypeScript"',
      mockUser
    );
  });
});