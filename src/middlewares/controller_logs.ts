import { Request, Response, NextFunction } from 'express';
import { logger } from '../../config/logger';

// TODO: fix this.
// password property should be removed because redaction from pino doesnt work
export const reqResLogger = (req: Request, res: Response, next: NextFunction): void => {
  // req.log.info(req.params, 'REQUEST PARAMS:');
  // req.log.info(req.query, 'REQUEST QUERY:');
  // // req.log.info(req.body);
  // req.log.info(req.body, 'REQUEST BODY:');

  // if ('password' in req.body) delete req.body.password; you can do this because itll remove the password prop from body thus resulting to error.
  logger.info(req.params, 'REQUEST PARAMS:');
  logger.info(req.query, 'REQUEST QUERY:');
  logger.info(req.body, 'REQUEST BODY:');
  logger.info(req.headers, 'REQUEST HEADERS:');

  next();
};
