import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  fetchActivityLogs,
  createActivityLog
} from "./activityService";

import { activityRepository } from "../repositories";

import type { SupabaseUser } from "../types";

vi.mock("../repositories", () => ({
  activityRepository: {
    findByBoard: vi.fn(),
    insert: vi.fn()
  }
}));

const mockUser = {
  id: "user-1",
  email: "owner@test.com"
} as SupabaseUser;

describe("activityService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchActivityLogs returns logs from repository", async () => {
    vi.mocked(activityRepository.findByBoard).mockResolvedValue([
      {
        id: 1,
        board_id: "Personal",
        user_email: "owner@test.com",
        text: "added task",
        created_at: "2026-01-01T00:00:00.000Z"
      },
      {
        id: 2,
        board_id: "Personal",
        user_email: "owner@test.com",
        text: "deleted task",
        created_at: "2026-01-02T00:00:00.000Z"
      }
    ]);

    const result = await fetchActivityLogs("Personal");

    expect(activityRepository.findByBoard).toHaveBeenCalledWith("Personal");
    expect(result).toHaveLength(2);
    expect(result[0].text).toBe("added task");
  });

  it("createActivityLog does nothing when user is null", async () => {
    await createActivityLog(
      "Personal",
      "added task",
      null
    );

    expect(activityRepository.insert).not.toHaveBeenCalled();
  });

  it("createActivityLog inserts log when user exists", async () => {
    vi.mocked(activityRepository.insert).mockResolvedValue({
      id: 1,
      board_id: "Personal",
      user_email: "owner@test.com",
      text: "added task",
      created_at: "2026-01-01T00:00:00.000Z"
    });

    await createActivityLog(
      "Personal",
      "added task",
      mockUser
    );

    expect(activityRepository.insert).toHaveBeenCalledTimes(1);

    expect(activityRepository.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        board_id: "Personal",
        user_email: "owner@test.com",
        text: "added task"
      })
    );
  });

  it("createActivityLog uses empty email when user email is missing", async () => {
    const userWithoutEmail = {
      id: "user-2"
    } as SupabaseUser;

    vi.mocked(activityRepository.insert).mockResolvedValue({
      id: 2,
      board_id: "Personal",
      user_email: "",
      text: "edited task",
      created_at: "2026-01-01T00:00:00.000Z"
    });

    await createActivityLog(
      "Personal",
      "edited task",
      userWithoutEmail
    );

    expect(activityRepository.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        board_id: "Personal",
        user_email: "",
        text: "edited task"
      })
    );
  });
});