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
          genre: boolean;
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
        };
        Insert: {
          created_at?: string;
          genre?: boolean;
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
        };
        Update: {
          created_at?: string;
          genre?: boolean;
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
          genre: string;
          id: number;
          movie: boolean;
          series: boolean;
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
      profile: {
        Row: {
          avatar_url: string | null;
          id: string;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
        };
      };
      rating: {
        Row: {
          catalog_item: number;
          created_at: string | null;
          id: number;
          stream: boolean;
          user_id: string;
          user_item_key: string;
        };
        Insert: {
          catalog_item: number;
          created_at?: string | null;
          id?: number;
          stream: boolean;
          user_id: string;
          user_item_key: string;
        };
        Update: {
          catalog_item?: number;
          created_at?: string | null;
          id?: number;
          stream?: boolean;
          user_id?: string;
          user_item_key?: string;
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
