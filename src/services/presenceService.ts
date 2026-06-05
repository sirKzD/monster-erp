import { supabase } from "../utils/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface PresenceUser {
    id: string;
    email: string
    typing: boolean;
    cursorX: number;
    cursorY: number;
}

export interface PresencePayload {
    user_id: string;
    email: string;
    typing: boolean;
    cursorX: number;
    cursorY: number;
    online_at?: string;
}

export function createPresenceChannel(
    boardId: string,
    userId: string
): RealtimeChannel {
    return supabase.channel(
        `presence-${boardId}`,
        {
            config: {
                presence: { key: userId }
            }
        }
    );
}


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

export async function trackPresence(
    channel: RealtimeChannel,
    payload: PresencePayload
): Promise<void> {
    await channel.track(payload);
}

export function removePresenceChannel(
    channel: RealtimeChannel 
): void {
    supabase.removeChannel(channel);
}