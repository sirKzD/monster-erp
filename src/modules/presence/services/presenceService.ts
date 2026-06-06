import {
  createPresenceChannel,
  trackPresence,
  removePresenceChannel
} from "../repositories/presenceRepository";

import type {
  PresenceUser,
  PresencePayload
} from "../types/presence.types";

export function parsePresenceState(
  state: Record<string, unknown[]>
): PresenceUser[] {
  return Object.values(state)
    .flat()
    .map((p) => {
      const payload = p as PresencePayload;

      return {
        id: payload.user_id,
        email: payload.email,
        typing: payload.typing ?? false,
        cursorX: payload.cursorX ?? 0,
        cursorY: payload.cursorY ?? 0
      };
    });
}

export {
  createPresenceChannel,
  trackPresence,
  removePresenceChannel
};

export type {
  PresenceUser,
  PresencePayload
};