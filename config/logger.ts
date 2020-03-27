import pino from 'pino';
// import * as path from 'path';

// const dis = pino.destination(path.resolve(__dirname, '../logs/route.log')); <-- add this in production as a 2nd argument in pino instance
export const logger = pino({ enabled: !(process.env.NODE_ENV === 'test'), prettyPrint: { colorize: true } });
