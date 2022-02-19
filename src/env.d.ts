/// <reference types="vite/client" />

interface ImportMetaEnv {
  MODE: string;
  BASE_URL: string;
  PROD: boolean;
  DEV: boolean;
  SSR: boolean;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_SUPABASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
