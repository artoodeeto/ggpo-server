import { Response, Request, NextFunction } from 'express';
import { errorControllerHandler } from '../helpers/controller_error';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  const { statusCode, error, errorType } = errorControllerHandler(err);
  res.status(statusCode).json({
    errorType,
    error
  });
}
