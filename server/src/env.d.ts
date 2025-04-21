declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DB_USER: string;
      DB_PASS: string;
      DB_NAME: string;
      DB_PORT: string;
      DB_HOST: string;
      COOKIE_SESSION_SECRET: string;
      CLIENT_URL: string;
      COOKIE_DOMAIN: string;
      REDIS_URL: string;
      OAUTH_PROOF_SECRET: string;
      PRIVATE_SERVER_KEY: string;
      HOAX_USER_PASSWORD: string;
    }
  }
}

export {}
