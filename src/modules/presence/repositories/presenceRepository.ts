import { supabase } from "../../../utils/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { PresencePayload } from "../types/presence.types";

export function createPresenceChannel(
    boardId: string,
    userId: string 
): RealtimeChannel {
    return supabase.channel(`presence-${boardId}`, {
        config: {
            presence: {
                key: userId 
            }
        }
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