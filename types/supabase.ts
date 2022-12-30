export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      catalog: {
        Row: {
          id: number;
          created_at: string | null;
          title: string | null;
          synopsis: string | null;
          img: string | null;
          vtype: string | null;
          nfid: number;
          poster: string | null;
          titledate: string | null;
          on_Nflix: boolean | null;
          year: number | null;
          runtime: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          title?: string | null;
          synopsis?: string | null;
          img?: string | null;
          vtype?: string | null;
          nfid: number;
          poster?: string | null;
          titledate?: string | null;
          on_Nflix?: boolean | null;
          year?: number | null;
          runtime?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          title?: string | null;
          synopsis?: string | null;
          img?: string | null;
          vtype?: string | null;
          nfid?: number;
          poster?: string | null;
          titledate?: string | null;
          on_Nflix?: boolean | null;
          year?: number | null;
          runtime?: number | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
