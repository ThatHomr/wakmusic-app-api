export class AppleKeyResponseDto {
  keys: Array<AppleKey>;
}

export class AppleKey {
  kty: string;
  kid: string;
  use: string;
  alg: string;
  n: string;
  e: string;
}

export class AppleInfo {
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  nonce: string;
  nonce_supported: boolean;
  email: string;
  email_verified: boolean;
  is_private_email: boolean;
}
