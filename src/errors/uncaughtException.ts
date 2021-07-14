import { logger } from '../../config/logger';

// sync errors, all 500 errors are here
export const uncaughtException = () => {
  process.on('uncaughtException', (error: Error): void => {
    logger.error({ error }, 'uncaughtException:');
    // process.exit(1);
  });
};
