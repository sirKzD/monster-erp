import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  fetchUserBoards,
  checkBoardAccess,
  createBoard,
  inviteMember
} from "./boardService";

import { boardRepository } from "../repositories";

import type { SupabaseUser } from "../types";

vi.mock("../repositories", () => ({
  boardRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    insert: vi.fn(),
    update: vi.fn()
  }
}));

const mockUser = {
  id: "user-1",
  email: "owner@test.com"
} as SupabaseUser;

describe("boardService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchUserBoards returns boards owned by user or where user is member", async () => {
    vi.mocked(boardRepository.findAll).mockResolvedValue([
      {
        id: "Personal",
        owner_email: "owner@test.com",
        members: []
      },
      {
        id: "Team",
        owner_email: "other@test.com",
        members: ["owner@test.com"]
      },
      {
        id: "Hidden",
        owner_email: "other@test.com",
        members: []
      }
    ]);

    const result = await fetchUserBoards(mockUser);

    expect(result).toEqual(["Personal", "Team"]);
  });

  it("checkBoardAccess returns true when board does not exist", async () => {
    vi.mocked(boardRepository.findById).mockResolvedValue(null);

    const result = await checkBoardAccess("Personal", mockUser);

    expect(result).toBe(true);
  });

  it("checkBoardAccess returns true for board owner", async () => {
    vi.mocked(boardRepository.findById).mockResolvedValue({
      id: "Personal",
      owner_email: "owner@test.com",
      members: []
    });

    const result = await checkBoardAccess("Personal", mockUser);

    expect(result).toBe(true);
  });

  it("checkBoardAccess returns true for board member", async () => {
    vi.mocked(boardRepository.findById).mockResolvedValue({
      id: "Team",
      owner_email: "other@test.com",
      members: ["owner@test.com"]
    });

    const result = await checkBoardAccess("Team", mockUser);

    expect(result).toBe(true);
  });

  it("checkBoardAccess returns false for non-member", async () => {
    vi.mocked(boardRepository.findById).mockResolvedValue({
      id: "Hidden",
      owner_email: "other@test.com",
      members: []
    });

    const result = await checkBoardAccess("Hidden", mockUser);

    expect(result).toBe(false);
  });

  it("createBoard returns board id when insert succeeds", async () => {
    vi.mocked(boardRepository.insert).mockResolvedValue({
      id: "NewBoard",
      owner_email: "owner@test.com",
      members: []
    });

    const result = await createBoard("NewBoard", mockUser);

    expect(result).toBe("NewBoard");
  });

  it("createBoard returns null when insert fails", async () => {
    vi.mocked(boardRepository.insert).mockResolvedValue(null);

    const result = await createBoard("NewBoard", mockUser);

    expect(result).toBe(null);
  });

  it("inviteMember returns not_owner when user is not owner", async () => {
    vi.mocked(boardRepository.findById).mockResolvedValue({
      id: "Team",
      owner_email: "other@test.com",
      members: []
    });

    const result = await inviteMember(
      "Team",
      "new@test.com",
      mockUser
    );

    expect(result).toBe("not_owner");
  });

  it("inviteMember returns already_invited when email already exists", async () => {
    vi.mocked(boardRepository.findById).mockResolvedValue({
      id: "Team",
      owner_email: "owner@test.com",
      members: ["new@test.com"]
    });

    const result = await inviteMember(
      "Team",
      "new@test.com",
      mockUser
    );

    expect(result).toBe("already_invited");
  });

  it("inviteMember returns success when update succeeds", async () => {
    vi.mocked(boardRepository.findById).mockResolvedValue({
      id: "Team",
      owner_email: "owner@test.com",
      members: []
    });

    vi.mocked(boardRepository.update).mockResolvedValue({
      id: "Team",
      owner_email: "owner@test.com",
      members: ["new@test.com"]
    });

    const result = await inviteMember(
      "Team",
      "new@test.com",
      mockUser
    );

    expect(result).toBe("success");
  });

  it("inviteMember returns error when update fails", async () => {
    vi.mocked(boardRepository.findById).mockResolvedValue({
      id: "Team",
      owner_email: "owner@test.com",
      members: []
    });

    vi.mocked(boardRepository.update).mockResolvedValue(null);

    const result = await inviteMember(
      "Team",
      "new@test.com",
      mockUser
    );

    expect(result).toBe("error");
  });
});