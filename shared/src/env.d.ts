declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OAUTH_PROOF_SECRET: string;
    }
  }
}

export {}
