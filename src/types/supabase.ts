export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      catalog: {
        Row: {
          created_at: string
          genre: boolean
          id: number
          imdbid: string | null
          img: string
          nfid: number
          on_Nflix: boolean
          rating: number | null
          runtime: number | null
          skip_count: number
          stream_count: number
          synopsis: string
          title: string
          titledate: string
          trailer: string | null
          vtype: string
          year: number
        }
        Insert: {
          created_at?: string
          genre?: boolean
          id?: number
          imdbid?: string | null
          img: string
          nfid: number
          on_Nflix?: boolean
          rating?: number | null
          runtime?: number | null
          skip_count?: number
          stream_count?: number
          synopsis: string
          title: string
          titledate: string
          trailer?: string | null
          vtype: string
          year: number
        }
        Update: {
          created_at?: string
          genre?: boolean
          id?: number
          imdbid?: string | null
          img?: string
          nfid?: number
          on_Nflix?: boolean
          rating?: number | null
          runtime?: number | null
          skip_count?: number
          stream_count?: number
          synopsis?: string
          title?: string
          titledate?: string
          trailer?: string | null
          vtype?: string
          year?: number
        }
        Relationships: []
      }
      catalog_genre: {
        Row: {
          catalog_genre_nfid: string | null
          catalog_nfid: number
          created_at: string | null
          genre: string | null
          genre_nfid: number | null
          id: number
        }
        Insert: {
          catalog_genre_nfid?: string | null
          catalog_nfid: number
          created_at?: string | null
          genre?: string | null
          genre_nfid?: number | null
          id?: number
        }
        Update: {
          catalog_genre_nfid?: string | null
          catalog_nfid?: number
          created_at?: string | null
          genre?: string | null
          genre_nfid?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "catalog_genre_catalog_nfid_fkey"
            columns: ["catalog_nfid"]
            isOneToOne: false
            referencedRelation: "catalog"
            referencedColumns: ["nfid"]
          }
        ]
      }
      genre: {
        Row: {
          created_at: string | null
          genre: string
          id: number
          movie: boolean
          series: boolean
        }
        Insert: {
          created_at?: string | null
          genre: string
          id?: number
          movie: boolean
          series: boolean
        }
        Update: {
          created_at?: string | null
          genre?: string
          id?: number
          movie?: boolean
          series?: boolean
        }
        Relationships: []
      }
      profile: {
        Row: {
          avatar_url: string | null
          email: string
          filter_rated: boolean
          filter_removed_content: boolean
          filter_saved: boolean
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          email: string
          filter_rated?: boolean
          filter_removed_content?: boolean
          filter_saved?: boolean
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string
          filter_rated?: boolean
          filter_removed_content?: boolean
          filter_saved?: boolean
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      rating: {
        Row: {
          catalog_item: number
          created_at: string | null
          id: number
          stream: boolean
          user_id: string
          user_item_key: string
        }
        Insert: {
          catalog_item: number
          created_at?: string | null
          id?: number
          stream: boolean
          user_id: string
          user_item_key: string
        }
        Update: {
          catalog_item?: number
          created_at?: string | null
          id?: number
          stream?: boolean
          user_id?: string
          user_item_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "rating_catalog_item_fkey"
            columns: ["catalog_item"]
            isOneToOne: false
            referencedRelation: "catalog"
            referencedColumns: ["nfid"]
          },
          {
            foreignKeyName: "rating_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      saved_list: {
        Row: {
          catalog_item: number
          created_at: string | null
          id: number
          user_id: string
          user_item_key: string
        }
        Insert: {
          catalog_item: number
          created_at?: string | null
          id?: number
          user_id: string
          user_item_key: string
        }
        Update: {
          catalog_item?: number
          created_at?: string | null
          id?: number
          user_id?: string
          user_item_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_list_catalog_item_fkey"
            columns: ["catalog_item"]
            isOneToOne: false
            referencedRelation: "catalog"
            referencedColumns: ["nfid"]
          },
          {
            foreignKeyName: "saved_list_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
