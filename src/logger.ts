import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import 'winston-daily-rotate-file';
export const Logger = WinstonModule.createLogger({
  transports: [
    // let's log errors into its own file
    new transports.DailyRotateFile({
      filename: `logs/%DATE%-error.log`,
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json(),
      ),
    }),
    // logging all level
    new transports.DailyRotateFile({
      filename: `logs/%DATE%-combined.log`,
      datePattern: 'YYYY-MM-DD',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json(),
      ),
    }),
    // we also want to see logs in our console
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.errors({ stack: true }),
        format.cli(),
        format.splat(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.colorize({
          all: true,
        }),
        format.printf((info) => {
          return `${info.timestamp.toLocaleString()} [${info.level}] [${
            info.context
          }] ${info.message} ${info.stack ?? ''}`;
        }),
      ),
    }),
  ],
});
