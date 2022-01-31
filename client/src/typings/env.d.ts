/// <reference types="vite/client" />

// Extend env vars as provided by vite
// See https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript
interface ImportMetaEnv {
  readonly VITE_APP_ENV: 'dev' | 'prd';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
