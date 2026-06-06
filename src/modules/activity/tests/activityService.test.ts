import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchActivityLogs,
  createActivityLog
} from "../services/activityService";
import { activityRepository } from "../repositories/activityRepository";
import type { ActivityLogRow } from "../types/activity.types";
import type { SupabaseUser } from "../../../types";

vi.mock("../repositories/activityRepository", () => ({
  activityRepository: {
    findByBoard: vi.fn(),
    insert: vi.fn()
  }
}));

const mockLogs: ActivityLogRow[] = [
  {
    id: 1,
    board_id: "board-1",
    user_email: "test@example.com",
    text: "added task",
    created_at: "2025-01-01T00:00:00.000Z"
  }
];

const mockUser = {
  id: "user-1",
  email: "test@example.com"
} as SupabaseUser;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("fetchActivityLogs", () => {
  it("returns logs from repository", async () => {
    vi.mocked(activityRepository.findByBoard).mockResolvedValue(mockLogs);
    const result = await fetchActivityLogs("board-1");
    expect(activityRepository.findByBoard).toHaveBeenCalledWith("board-1");
    expect(result).toEqual(mockLogs);
  });

  it("returns empty array when no logs", async () => {
    vi.mocked(activityRepository.findByBoard).mockResolvedValue([]);
    const result = await fetchActivityLogs("board-empty");
    expect(result).toEqual([]);
  });
});

describe("createActivityLog", () => {
  it("inserts a new log entry", async () => {
    vi.mocked(activityRepository.insert).mockResolvedValue(mockLogs[0]);
    await createActivityLog("board-1", "added task", mockUser);
    expect(activityRepository.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        board_id: "board-1",
        user_email: "test@example.com",
        text: "added task"
      })
    );
  });

  it("does nothing when user is null", async () => {
    await createActivityLog("board-1", "some action", null);
    expect(activityRepository.insert).not.toHaveBeenCalled();
  });
});