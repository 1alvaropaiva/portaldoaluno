import 'express';

export interface JwtPayload {
  id: number;
  nome: string;
  email: string;
  jti?: string;
  exp?: number;
  iat?: number;
  sub?: number;
  role?: string;
}

declare module 'express' {
  export interface Request {
    user?: JwtPayload;
  }
}
