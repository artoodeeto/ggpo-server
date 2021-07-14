import { logger } from '../../config/logger';

// async errors
export const unhandledRejection = () => {
  process.on('unhandledRejection', (error: {} | null | undefined, promise: Promise<any>): void => {
    logger.error({ error }, 'unhandledRejection:');
    // you can also throw to handle it as an exception
  });
};
