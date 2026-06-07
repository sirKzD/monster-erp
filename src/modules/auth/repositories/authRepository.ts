import { supabase } from "../../../utils/supabase";
import type { SupabaseUser } from "../../../types";

export async function getCurrentUserFromAuth(): Promise<SupabaseUser | null> {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        console.error(error);
        return null;
    }

    return data?.user ?? null;
}

export function onAuthStateChange(
    callback: (user: SupabaseUser | null) => void 
) {
    const {
        data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session?.user ?? null);
    });

    return subscription;
}

export async function signInWithEmail(
    email: string,
    password: string 
): Promise<string | null> {
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    return error?.message ?? null;
}

export async function signUpWithEmail(
    email: string,
    password: string
): Promise<string | null> {
    const { error } = await supabase.auth.signUp({
        email,
        password 
    });

    return error?.message ?? null;
}

export async function signOutFromAuth(): Promise<void> {
    await supabase.auth.signOut();
}