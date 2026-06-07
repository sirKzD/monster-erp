import { supabase } from "../../../utils/supabase";

interface UserKeyRow {
  public_key: string;
}

interface InsertUserKeyPayload {
  user_id: string;
  user_email?: string | null;
  public_key: string;
}

export async function findUserPublicKey(
  userId: string
): Promise<UserKeyRow | null> {
  const { data, error } = await supabase
    .from("user_keys")
    .select("public_key")
    .eq("user_id", userId)
    .maybeSingle<UserKeyRow>();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function insertUserPublicKey(
  payload: InsertUserKeyPayload
): Promise<void> {
  const { error } = await supabase
    .from("user_keys")
    .insert(payload);

  if (error) {
    console.error(error);
  }
}