interface CursorUser {
  email: string;
  cursorX: number;
  cursorY: number;
}

interface LiveCursorProps {
  user: CursorUser;
}


function LiveCursor({ user }: LiveCursorProps) {
  return (
    <div
      className="live-cursor"
      style={{
        position: "fixed",
        left: user.cursorX,
        top: user.cursorY,
        pointerEvents: "none",
        zIndex: 9999,
        transition: "all 0.05s linear"
      }}
    >
      <div style={{ fontSize: "20px" }}>👆</div>

      <div
        style={{
          background: "#111",
          color: "#fff",
          padding: "4px 8px",
          borderRadius: "8px",
          fontSize: "12px"
        }}
      >
        {user.email}
      </div>
    </div>
  );
}

export default LiveCursor;