import {
    useEffect,
    useState,
    useRef,
    useCallback
} from "react";

import {
    createPresenceChannel,
    parsePresenceState,
    trackPresence,
    removePresenceChannel,
    type PresenceUser
} from "../services/presenceService";

import type { RealtimeChannel } from "@supabase/supabase-js";

interface AuthUser {
    id: string;
    email?: string;
}

interface usePresenceReturn {
    onlineUsers: PresenceUser[];
    trackTyping: (isTyping: boolean) => Promise<void>;
    trackCursor: (x: number, y: number) => void;
}


export default function usePresence(
    user: AuthUser | null,
    activeBoard: string
): usePresenceReturn {

    const [onlineUsers, setOnlineUsers] =
        useState<PresenceUser[]>([]);

    const channelRef = 
        useRef<RealtimeChannel | null>(null);

    const cursorTimeout =
        useRef<number | null>(null);

    useEffect(() => {
        if (!user) return;

        const channel = createPresenceChannel(activeBoard, user.id);
        channelRef.current = channel;

        channel.on(
            "presence",
            { event: "sync" },
            () => {
                const state = channel.presenceState<Record<string, unknown>>();
                setOnlineUsers(parsePresenceState(state));
            }
        );

        channel.subscribe(async (status: string) => {
          if (status !== "SUBSCRIBED") return;

          await trackPresence(channel, {
            user_id: user.id,
            email: user.email || "",
            typing: false,
            cursorX: 0,
            cursorY: 0,
            online_at: new Date().toISOString()
          });
        });
            
        return () => {
          removePresenceChannel(channel);
          channelRef.current = null;
        };
      
      }, [user, activeBoard]);

    const trackTyping = useCallback(
        async (isTyping: boolean): Promise<void> => {
            if (!channelRef.current || !user) return;

            await trackPresence(channelRef.current, {
                user_id: user.id,
                email: user.email || "",
                typing: isTyping,
                cursorX: 0,
                cursorY: 0
            });
        },
        [user]
    );

    const trackCursor = useCallback(
        (x: number, y: number): void => {
            if (cursorTimeout.current) return;

            cursorTimeout.current = window.setTimeout(async () => {
                cursorTimeout.current = null;

                if (!channelRef.current || !user) return;

                await trackPresence(channelRef.current, {
                  user_id: user.id,
                  email: user.email || "",
                  typing: false,
                  cursorX: x,
                  cursorY: y
                });
            }, 50);
        },
        [user]
    );

    return {
        onlineUsers,
        trackTyping,
        trackCursor
    };
}