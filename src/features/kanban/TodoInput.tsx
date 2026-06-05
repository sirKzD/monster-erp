import type { Dispatch, SetStateAction } from "react";

type Priority = "low" | "medium" | "high";

interface TodoInputProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  addTodo: () => void;
  priority: Priority;
  setPriority: Dispatch<SetStateAction<Priority>>;
  deadline: string;
  setDeadline: Dispatch<SetStateAction<string>>;
  onTyping?: () => void;
}

function TodoInput({
  input,
  setInput,
  addTodo,
  priority,
  setPriority,
  deadline,
  setDeadline,
  onTyping
}: TodoInputProps) {
  return (
    <div className="input-group">
      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          onTyping?.();
        }}
        placeholder="Tulis tugas..."
      />

      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value as Priority)
        }
      >
        <option value="low">🟢 Low</option>
        <option value="medium">🟡 Medium</option>
        <option value="high">🔴 High</option>
      </select>

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <button onClick={addTodo}>Tambah</button>
    </div>
  );
}

export default TodoInput;