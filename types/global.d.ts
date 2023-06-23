declare namespace NodeJS {
  interface ProcessEnv {
    OAUTH_GOOGLE_ID: string;
    OAUTH_GOOGLE_SECRET: string;
    OAUTH_GOOGLE_REDIRECT: string;
    APPLE_CLIENT_ID: string;
    APPLE_CALLBACK_URL: string;
    APPLE_KEY_ID: string;
    APPLE_KEY: string;
    NAVER_CLIENT_ID: string;
    NAVER_CLIENT_SECRET: string;
    NAVER_CALLBACK_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRE_IN: string;
    SESSION_SECRET: string;
    DOMAIN: string;
    DOMAIN_MYPAGE: string;
    TZ: string;
    NODE_ENV: string;
    PORT: string;
    DEFAULT_NAME: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_USER_NAME: string;
    DB_USER_PASSWORD: string;
    DB_SYNC: string;
    CACHE_TTL: string;
    R2_CLIENT_ID: string;
    R2_ACCESS_KEY_ID: string;
    R2_SECRET_ACCESS_KEY: string;
    R2_BUCKET_NAME: string;
  }
}
