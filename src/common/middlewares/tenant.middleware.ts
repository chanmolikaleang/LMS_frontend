import {
  Injectable,
  NestMiddleware,
  NotAcceptableException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  tenantId?: string;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const host = req.headers.host;
    const tenantId = host.split('.')[0];
    if (!tenantId) {
      throw new NotAcceptableException('Tenant ID is required');
    }
    req.tenantId = tenantId;
    next();
  }
}
