import type {
    WorkspaceAuditEvent
} from "./workspaceAuditService";

export interface WorkspaceFeedItem {
    actorId: string;
    action: string;
    target?: string;
    createdAt: string;
}

export function createFeedFromAuditEvents(
    events: WorkspaceAuditEvent[]
): WorkspaceFeedItem[] {

    return [...events]
      .sort(
        (a, b) => 
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
      )
      .map(event => ({
        actorId: event.actorId,
        action: event.action,
        target: event.target,
        createdAt: event.createdAt
      }));
}

export function filterFeedByActor(
    feed: WorkspaceFeedItem[],
    actorId: string
): WorkspaceFeedItem[] {

    return feed.filter(
        item => item.actorId === actorId 
    );
}

export function filterFeedByAction(
    feed: WorkspaceFeedItem[],
    action: string
): WorkspaceFeedItem[] {

    return feed.filter(
        item => item.action === action
    );
}