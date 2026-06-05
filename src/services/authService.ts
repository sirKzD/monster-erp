import { supabase } from "../utils/supabase";
import { generateRSAKeys } from "../crypto/rsa";
import type { SupabaseUser } from "../types";

export async function getCurrentUser(): Promise<SupabaseUser | null> {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        console.error(error);
        return null;
    }

    return data?.user ?? null;
}

export async function initUserKeys(
    user: SupabaseUser
): Promise<void> {

    try {
        const { data, error } = await supabase
          .from("user_keys")
          .select("public_key")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
            console.error(error);
            return;
        }

        if (data?.public_key) return;

        const keys = await generateRSAKeys();

        await supabase.from("user_keys").insert({
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

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    return error?.message ?? null;
}

export async function signUp(
    email: string,
    password: string
): Promise<string | null> {

    const { error } = await supabase.auth.signUp({
        email,
        password 
    });

    return error?.message ?? null;
}

export async function signOut(): Promise<void> {
    await supabase.auth.signOut();
}