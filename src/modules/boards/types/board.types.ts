import type {
    Tables,
    TablesInsert,
    TablesUpdate
} from "../../../types/database.types";

export type BoardMetaRow = Tables<"board_meta">;
export type BoardMetaInsert = TablesInsert<"board_meta">;
export type BoardMetaUpdate = TablesUpdate<"board_meta">;