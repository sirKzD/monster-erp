import { useState } from "react";

import {
  createWorkspaceDraft,
  createOwnerMember
} from "../services/workspaceService";

import type {
  Workspace,
  WorkspaceMember
} from "../types/workspace.types";

interface UseWorkspaceReturn {
  workspace: Workspace | null;
  members: WorkspaceMember[];
  createWorkspace: (
    name: string,
    ownerId: string,
    email: string
  ) => void;
}

export default function useWorkspace(): UseWorkspaceReturn {

  const [workspace, setWorkspace] =
    useState<Workspace | null>(null);

  const [members, setMembers] =
    useState<WorkspaceMember[]>([]);

  const createWorkspace = (
    name: string,
    ownerId: string,
    email: string
  ): void => {

    const newWorkspace =
      createWorkspaceDraft({
        name,
        ownerId
      });

    const owner =
      createOwnerMember(
        newWorkspace,
        email
      );

    setWorkspace(newWorkspace);
    setMembers([owner]);
  };

  return {
    workspace,
    members,
    createWorkspace
  };
}
