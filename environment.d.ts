declare namespace NodeJS {
  export interface ProcessEnv {
    readonly MEDIA_KEY: string;
    readonly MEDIA_HOST: string;
    readonly NEXT_PUBLIC_SUPABASE_URL: string;
    readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  }
}
