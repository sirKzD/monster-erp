import { supabase } from "../utils/supabase";
import type { Tables, TablesInsert, TablesUpdate } from "../types/database.types";


export type BoardMetaRow    = Tables<"board_meta">;
export type BoardMetaInsert = TablesInsert<"board_meta">;
export type BoardMetaUpdate = TablesUpdate<"board_meta">;


export const boardRepository = {

  // Ambil semua boards
  async findAll(): Promise<BoardMetaRow[]> {

    const { data, error } = await supabase
      .from("board_meta")
      .select("*");

    if (error) {
      console.error("[boardRepository.findAll]", error);
      return [];
    }

    return data ?? [];
  },

  async findById(
    boardId: string
  ): Promise<BoardMetaRow | null> {

    const { data, error } = await supabase
      .from("board_meta")
      .select("*")
      .eq("id", boardId)
      .maybeSingle();

    if (error) {
      console.error("[boardRepository.findById]", error);
      return null;
    }

    return data;
  },

  async insert(
    payload: BoardMetaInsert
  ): Promise<BoardMetaRow | null> {

    const { data, error } = await supabase
      .from("board_meta")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("[boardRepository.insert]", error);
      return null;
    }

    return data;
  },

  async update(
    boardId: string,
    payload: BoardMetaUpdate
  ): Promise<BoardMetaRow | null> {

    const { data, error } = await supabase
      .from("board_meta")
      .update(payload)
      .eq("id", boardId)
      .select()
      .single();

    if (error) {
      console.error("[boardRepository.update]", error);
      return null;
    }

    return data;
  }
};