import { generateRSAKeys } from "../../../crypto/rsa";
import type { SupabaseUser } from "../../../types";

import {
    getCurrentUserFromAuth,
    signInWithEmail,
    signUpWithEmail,
    signOutFromAuth
} from "../repositories/authRepository";

import {
    findUserPublicKey,
    insertUserPublicKey
} from "../repositories/userKeyRepository";

export async function getCurrentUser(): Promise<SupabaseUser | null> {
    return getCurrentUserFromAuth();
}

export async function initUserKeys(
    user: SupabaseUser
): Promise<void> {
    try {
        const data = await findUserPublicKey(user.id);

        if (data?.public_key) return;

        const keys = await generateRSAKeys();

        await insertUserPublicKey({
            user_id: user.id,
            user_email: user.email,
            public_key: keys.publicKey
        });

        localStorage.setItem("private-key", keys.privateKey);

    } catch (err) {
        console.error("INIT KEY ERROR:", err);
    }
}

export async function signIn(
    email: string,
    password: string
): Promise<string | null> {
    return signInWithEmail(email, password);
}

export async function signUp(
    email: string,
    password: string
): Promise<string | null> {
    return signUpWithEmail(email, password);
}

export async function signOut(): Promise<void> {
    await signOutFromAuth();
}