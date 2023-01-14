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
          created_at: string;
          title: string;
          synopsis: string;
          img: string;
          vtype: string;
          nfid: number;
          titledate: string;
          on_Nflix: boolean;
          year: number;
          runtime: number | null;
          imdbid: string | null;
          rating: number | null;
          trailer: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          title: string;
          synopsis: string;
          img: string;
          vtype: string;
          nfid: number;
          titledate: string;
          on_Nflix?: boolean;
          year: number;
          runtime?: number | null;
          imdbid?: string | null;
          rating?: number | null;
          trailer?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          title?: string;
          synopsis?: string;
          img?: string;
          vtype?: string;
          nfid?: number;
          titledate?: string;
          on_Nflix?: boolean;
          year?: number;
          runtime?: number | null;
          imdbid?: string | null;
          rating?: number | null;
          trailer?: string | null;
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
