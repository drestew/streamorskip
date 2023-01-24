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
      'catalog-genre': {
        Row: {
          'catalog-nfid': number;
          created_at: string | null;
          genre: string | null;
          'genre-nfid': number | null;
          id: number;
        };
        Insert: {
          'catalog-nfid': number;
          created_at?: string | null;
          genre?: string | null;
          'genre-nfid'?: number | null;
          id?: number;
        };
        Update: {
          'catalog-nfid'?: number;
          created_at?: string | null;
          genre?: string | null;
          'genre-nfid'?: number | null;
          id?: number;
        };
      };
      genres: {
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
