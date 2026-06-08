export interface WorkspaceAuditEvent {
    workspaceId: string;
    actorId: string;
    action: string;
    target?: string;
    createdAt: string;
}

export function createAuditEvent(
    workspaceId: string,
    actorId: string,
    action: string,
    target?: string
): WorkspaceAuditEvent {

    return {
        workspaceId,
        actorId,
        action,
        target,
        createdAt: new Date().toISOString()
    };
}

export function filterAuditEvents(
    event: WorkspaceAuditEvent[],
    action: string 
): WorkspaceAuditEvent[] {
    
    return event.filter(
        event => event.action === action
    );
}