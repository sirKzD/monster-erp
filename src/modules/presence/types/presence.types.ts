export interface PresenceUser {
    id: string;
    email: string;
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