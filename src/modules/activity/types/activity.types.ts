import type {
  Tables,
  TablesInsert
} from "../../../types/database.types";

export type ActivityLogRow    = Tables<"activity_logs">;
export type ActivityLogInsert = TablesInsert<"activity_logs">;