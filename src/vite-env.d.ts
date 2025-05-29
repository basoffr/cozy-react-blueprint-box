/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    // voeg hier meer VITE_... var's toe als je ze later nodig hebt
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  
