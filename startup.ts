import { Logger } from '@overnightjs/logger';
import { AppServer } from './config/server';

const server = new AppServer();

/**
 * I did this because of docker it will fail because the server has not started yet
 * so we have to wait and call it every time it fails.
 * I don't like this solution but for now this is a work around
 */
function runner() {
  server.startDB().catch(async () => {
    const promiseTimer: NodeJS.Timer = await new Promise((res, rej) => {
      const timer = setTimeout(() => {
        res(timer);
      }, 10000);
    });
    clearTimeout(promiseTimer);
    runner();
    Logger.Info('still awaiting for database...');
  });
}
runner();
