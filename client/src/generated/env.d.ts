declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BASE_URL: string;
      NEXT_PUBLIC_GRAPHQL_URL: string;
      GITHUB_SECRET: string;
      GITHUB_ID: string;
      OAUTH_PROOF_SECRET: string;
      NEXTAUTH_SECRET: string;
      GITLAB_ID: string;
      GITLAB_SECRET: string;
    }
  }
}

export {}
