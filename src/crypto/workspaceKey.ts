import { supabase } from "../utils/supabase";

import {
    encryptRSA,
    decryptRSA
} from "./rsa";

function generateAESKey(): string {

    const bytes =
        crypto.getRandomValues(
            new Uint8Array(32)
        );

    return btoa(
        String.fromCharCode(
            ...bytes
        )
    );
}

interface WorkspaceKeyRow {
    encrypted_key: string;
}

interface UserKeyRow {
    public_key: string;
}

export async function getWorkspaceKey(
    boardId: string,
    userId: string
): Promise<string | null> {

    try {

        const privateKey =
            localStorage.getItem(
                "private-key"
            );

        if (!privateKey) {

            console.warn(
                "Private key missing"
            );

            return null;
        }

        const {
            data,
            error
        } = await supabase
            .from("workspace_keys")
            .select("encrypted_key")
            .eq("board_id", boardId)
            .eq("user_id", userId)
            .maybeSingle<WorkspaceKeyRow>();

        if (error) {

            console.error(error);
            return null;
        }

        if (!data?.encrypted_key) {
            return null;
        }

        const workspaceKey =
            await decryptRSA(
                data.encrypted_key,
                privateKey
            );

        return workspaceKey;

    } catch (err) {

        console.error(
            "WORKSPACE KEY ERROR:",
            err
        );

        return null;
    }
}

export async function createWorkspaceKey(
    boardId: string,
    userId: string
): Promise<string | null> {

    try {

        const aesKey =
            generateAESKey();

        const {
            data,
            error
        } = await supabase
            .from("user_keys")
            .select("public_key")
            .eq("user_id", userId)
            .maybeSingle<UserKeyRow>();

        if (
            error ||
            !data?.public_key
        ) {

            console.error(error);

            return null;
        }

        const encryptedKey =
            await encryptRSA(
                aesKey,
                data.public_key
            );

        const {
            error: insertError
        } = await supabase
            .from("workspace_keys")
            .insert({
                board_id: boardId,
                user_id: userId,
                encrypted_key:
                    encryptedKey
            });

        if (insertError) {

            console.error(
                insertError
            );

            return null;
        }

        return aesKey;

    } catch (err) {

        console.error(
            "CREATE KEY ERROR:",
            err
        );

        return null;
    }
}