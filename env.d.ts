declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB: D1Database;
      R2: R2Bucket;
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
      CLERK_SECRET_KEY: string;
      NEXT_PUBLIC_R2_PUBLIC_URL: string;
    }
  }
}

export {};
