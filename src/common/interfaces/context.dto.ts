import { Request } from 'express';

export interface CustomContext {
  req: Request;
}
