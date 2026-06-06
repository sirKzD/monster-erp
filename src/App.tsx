import { useState, useEffect } from "react";
import { signOut } from "./services";
 

import AIPanel from "./features/ai/AIPanel";
import Auth from "./features/auth/Auth";

import useDarkMode from "./hooks/useDarkMode";
import useStats from "./features/stats/useStats";
import useAuth from "./features/auth/useAuth";
import useBoards from "./features/boards/useBoards";


import {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  addColumn,
  deleteColumn,
  renameColumn,
  generateAITasks
} from "./modules/kanban";
import { Board, TodoInput, useKanban } from "./modules/kanban"
import { LiveCursor, usePresence } from "./modules/presence"
import { ActivityLog, useActivity } from "./modules/activity";
import { exportData } from "./services/exportService";
import { testRSA } from "./services/rsaService";


declare global {
  interface Window {
    typingTimeout: ReturnType<typeof setTimeout>;
  }
}


type Priority = "low" | "medium" | "high";
type FilterType = "all" | "done" | "pending";


function App() {

  const { user, loading } = useAuth();
  const { darkMode, setDarkMode } = useDarkMode();

  const {
    boards,
    activeBoard,
    setActiveBoard,
    allowed,
    addBoard,
    invite
  } = useBoards(user);

  const {
    columns,
    setColumns,
    setDragging,
    saving
  } = useKanban(user, activeBoard);

  const {
    totalTask,
    doneTask,
    pendingTask,
    overdueTask
  } = useStats(columns);

  const {
    onlineUsers,
    trackTyping,
    trackCursor
  } = usePresence(user, activeBoard);

  const { logs, addLog } = useActivity(user, activeBoard);

  const [input, setInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [priority, setPriority] = useState<Priority>("medium");
  const [deadline, setDeadline] = useState<string>("");
  const [inviteEmail, setInviteEmail] = useState<string>("");


  useEffect(() => {
    const move = (e: MouseEvent): void => {
      trackCursor(e.clientX, e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [trackCursor]);


  const handleInvite = async (): Promise<void> => {
    if (!inviteEmail.trim()) return;
    await invite(inviteEmail);
    setInviteEmail("");
  };

  const handleTyping = (): void => {
    trackTyping(true);
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      trackTyping(false);
    }, 1000);
  };

  const resetForm = (): void => {
    setInput("");
    setPriority("medium");
    setDeadline("");
    trackTyping(false);
  };


  if (loading) return <h1>Loading...</h1>;
  if (!user) return <Auth />;

  if (!allowed) {
    return (
      <div className="container">
        <h1>❌ No Access</h1>
        <p>Tidak punya akses ke: <strong>{activeBoard}</strong></p>
        <button onClick={() => setActiveBoard("Personal")}>
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="container">

      <h1>Kanban Todo 🔥</h1>

      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      <button onClick={signOut}>Logout</button>

      <button onClick={testRSA}>
        🔐 Test RSA
      </button>

      <div className="board-switcher">
        <select
          value={activeBoard}
          onChange={(e) => setActiveBoard(e.target.value)}
        >
          {boards.map(board => (
            <option key={board} value={board}>{board}</option>
          ))}
        </select>
        <button onClick={addBoard}>+ Board</button>
      </div>

      <div className="invite-section">
        <input
          type="email"
          placeholder="Invite email..."
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
        <button onClick={handleInvite}>👥 Invite</button>
      </div>

      <div className="online-users">
        <h3>🟢 Online Users</h3>
        {onlineUsers.map(u => (
          <div key={u.id}>
            {u.email}
            {u.typing && u.id !== user.id && " ✍️ typing..."}
          </div>
        ))}
      </div>

      <div className="stats">
        <p>📋 Total: {totalTask}</p>
        <p>✅ Done: {doneTask}</p>
        <p>⏳ Pending: {pendingTask}</p>
        <p style={{ color: overdueTask > 0 ? "red" : "inherit" }}>
          ⚠️ Overdue: {overdueTask}
        </p>
      </div>

      <div className="save-status">
        {saving ? "💾 Saving..." : "✅ Saved"}
      </div>

      <button onClick={() => exportData(columns, activeBoard)}>
        💾 Export Backup
      </button>

      {/* Toolbar */}
      <div className="toolbar">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
        >
          <option value="all">All</option>
          <option value="done">Done</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <AIPanel
        onGenerate={(prompt) =>
          generateAITasks(prompt, columns, setColumns, addLog, user)
        }
      />

      <TodoInput
        input={input}
        setInput={setInput}
        addTodo={() =>
          addTodo({
            input,
            priority,
            deadline,
            columns,
            setColumns,
            addLog,
            user,
            onSuccess: resetForm
          })
        }
        priority={priority}
        setPriority={setPriority}
        deadline={deadline}
        setDeadline={setDeadline}
        onTyping={handleTyping}
      />

      <button onClick={() =>
        addColumn(setColumns, addLog, user)
      }>
        + Add Column
      </button>

      <Board
        columns={columns}
        setColumns={setColumns}
        toggleTodo={(colId, id) =>
          toggleTodo(colId, id, setColumns)
        }
        deleteTodo={(colId, id) =>
          deleteTodo(colId, id, columns, setColumns, addLog, user)
        }
        editTodo={(colId, id, newText) =>
          editTodo(colId, id, newText, setColumns, addLog, user)
        }
        deleteColumn={(colId) =>
          deleteColumn(colId, columns, setColumns, addLog, user)
        }
        renameColumn={(oldId, newId) =>
          renameColumn(oldId, newId, columns, setColumns, addLog, user)
        }
        search={search}
        filter={filter}
        setDragging={setDragging}
      />

      <ActivityLog logs={logs} />

      {onlineUsers
        .filter(u => u.id !== user.id)
        .map(u => (
          <LiveCursor key={u.id} user={u} />
        ))}

    </div>
  );
}

export default App;