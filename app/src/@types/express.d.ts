/* eslint-disable */
import 'express';

declare module 'express' {
  export interface Request {
    user?: {
      id: number;
      nome: string;
      email: string;
    };
  }
}
