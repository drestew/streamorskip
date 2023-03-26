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
          created_at: string;
          id: number;
          imdbid: string | null;
          img: string;
          nfid: number;
          on_Nflix: boolean;
          rating: number | null;
          runtime: number | null;
          synopsis: string;
          title: string;
          titledate: string;
          trailer: string | null;
          vtype: string;
          year: number;
          genre: boolean;
        };
        Insert: {
          created_at?: string;
          id?: number;
          imdbid?: string | null;
          img: string;
          nfid: number;
          on_Nflix?: boolean;
          rating?: number | null;
          runtime?: number | null;
          synopsis: string;
          title: string;
          titledate: string;
          trailer?: string | null;
          vtype: string;
          year: number;
          genre?: boolean;
        };
        Update: {
          created_at?: string;
          id?: number;
          imdbid?: string | null;
          img?: string;
          nfid?: number;
          on_Nflix?: boolean;
          rating?: number | null;
          runtime?: number | null;
          synopsis?: string;
          title?: string;
          titledate?: string;
          trailer?: string | null;
          vtype?: string;
          year?: number;
          genre?: boolean;
        };
      };
      catalog_genre: {
        Row: {
          catalog_nfid: number;
          created_at: string | null;
          genre: string | null;
          genre_nfid: number | null;
          id: number;
        };
        Insert: {
          catalog_nfid: number;
          created_at?: string | null;
          genre?: string | null;
          genre_nfid?: number | null;
          id?: number;
        };
        Update: {
          catalog_nfid?: number;
          created_at?: string | null;
          genre?: string | null;
          genre_nfid?: number | null;
          id?: number;
        };
      };
      genre: {
        Row: {
          created_at: string | null;
          genre: string | null;
          id: number;
          movie: boolean | null;
          series: boolean | null;
        };
        Insert: {
          created_at?: string | null;
          genre?: string | null;
          id?: number;
          movie?: boolean | null;
          series?: boolean | null;
        };
        Update: {
          created_at?: string | null;
          genre?: string | null;
          id?: number;
          movie?: boolean | null;
          series?: boolean | null;
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
