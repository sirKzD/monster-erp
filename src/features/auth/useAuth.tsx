import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { getCurrentUser, initUserKeys } from "../../services/authService";
import type { SupabaseUser } from "../../types";


interface UseAuthReturn {
  user: SupabaseUser | null;
  loading: boolean;
}


export default function useAuth(): UseAuthReturn {

  const [user, setUser] =
    useState<SupabaseUser | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const init = async (): Promise<void> => {
      try {
        const currentUser = await getCurrentUser();

        if (!mounted) return;

        if (currentUser) {
          setUser(currentUser);
          await initUserKeys(currentUser);
        }

      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };

  }, []);

  return { user, loading };
}