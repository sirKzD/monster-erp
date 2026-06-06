import {
  useState,
  useEffect,
  useRef,
  useCallback
} from "react";

import { encryptData } from "../../../crypto/encrypt";
import { decryptData } from "../../../crypto/decrypt";

import {
  getWorkspaceKey,
  createWorkspaceKey
} from "../../../crypto/workspaceKey";

import { kanbanRepository } from "../repositories/kanbanRepository";

import type { KanbanTask, KanbanColumns } from "../types/kanban.types";

export type { KanbanTask as Task, KanbanColumns as Columns };

interface AuthUser {
  id: string;
  email?: string;
}

const defaultColumns: KanbanColumns = {
  todo: [],
  progress: [],
  done: []
};

export default function useKanban(
  user: AuthUser | null,
  activeBoard: string
) {
  const [columns, setColumns] =
    useState<KanbanColumns>(defaultColumns);

  const [saving, setSaving] =
    useState<boolean>(false);

  const isInitialized = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const saveTimeout = useRef<number | null>(null);
  const workspaceKeyRef = useRef<string | null>(null);

  const setDragging = useCallback(
    (value: boolean): void => {
      isDraggingRef.current = value;
    },
    []
  );

  useEffect(() => {
    if (!user) return;

    isInitialized.current = false;

    const fetchBoard = async (): Promise<void> => {
      let key = await getWorkspaceKey(activeBoard, user.id);

      if (!key) {
        key = await createWorkspaceKey(activeBoard, user.id);
      }

      if (!key) return;

      workspaceKeyRef.current = key;

      const board = await kanbanRepository.findById(activeBoard);

      if (board?.text) {
        const decrypted = await decryptData<KanbanColumns>(
          JSON.parse(board.text),
          key
        );

        setColumns(decrypted || defaultColumns);
      } else {
        const encrypted = await encryptData(defaultColumns, key);

        setColumns(defaultColumns);

        await kanbanRepository.insert({
          id: activeBoard,
          text: JSON.stringify(encrypted),
          updated_by: user.id
        });
      }

      isInitialized.current = true;
    };

    fetchBoard();
  }, [user, activeBoard]);

  useEffect(() => {
    if (!user) return;

    const channel = kanbanRepository.subscribeToUpdates(
      activeBoard,
      async (row) => {
        if (row.updated_by === user.id) return;
        if (isDraggingRef.current) return;
        if (row.id !== activeBoard) return;

        const key = workspaceKeyRef.current;

        if (!key || !row.text) return;

        const decrypted = await decryptData<KanbanColumns>(
          JSON.parse(row.text),
          key
        );

        setColumns(decrypted || defaultColumns);
      }
    );

    return () => {
      kanbanRepository.removeChannel(channel);
    };
  }, [user, activeBoard]);

  useEffect(() => {
    if (!user) return;
    if (!isInitialized.current) return;

    if (saveTimeout.current) {
      window.clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = window.setTimeout(async () => {
      if (isDraggingRef.current) return;

      const key = workspaceKeyRef.current;
      if (!key) return;

      setSaving(true);

      const encrypted = await encryptData(columns, key);

      await kanbanRepository.update(activeBoard, {
        text: JSON.stringify(encrypted),
        updated_by: user.id
      });

      setSaving(false);
    }, 400);

    return () => {
      if (saveTimeout.current) {
        window.clearTimeout(saveTimeout.current);
      }
    };
  }, [columns, activeBoard, user]);

  return {
    columns,
    setColumns,
    setDragging,
    saving
  };
}