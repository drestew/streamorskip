declare namespace NodeJS {
  export interface ProcessEnv {
    readonly CATALOG_KEY: string;
    readonly CATALOG_HOST: string;
    readonly NEXT_PUBLIC_SUPABASE_URL: string;
    readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    readonly SUPABASE_KEY: string;
    readonly IMDB_KEY: string;
  }
}
