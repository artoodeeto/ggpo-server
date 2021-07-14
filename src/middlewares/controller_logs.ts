import { Request, Response, NextFunction } from 'express';
import { logger } from '../../config/logger';

// TODO: fix this.
// password property should be removed
export const reqResLogger = (req: Request, res: Response, next: NextFunction): void => {
  logger.info(req, 'REQUEST SHIT:');
  next();
};
