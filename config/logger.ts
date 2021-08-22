import pino from 'pino';
import * as path from 'path';
import os from 'os';
export const logger = pino(
  {
    level: 'info',
    enabled: !(process.env.NODE_ENV === 'test'),
    prettyPrint: { colorize: true },
    redact: ['res', 'req'], // this password redaction is not working. still showing password https://getpino.io/#/docs/redaction
    serializers: {
      // req: pino.stdSerializers.req,
      // res: pino.stdSerializers.res
    },
    base: { pid: process.pid, hostname: os.hostname, time: true }
  }
  // pino.destination(path.resolve(__dirname, '../logs/logs.log'))
);
