import { Injectable, LoggerService } from '@nestjs/common';
import chalk from 'chalk';

@Injectable()
export class ConsoleLogger implements LoggerService {
  static time() {
    const date = new Date();

    return `${date.getHours()}:${date.getMinutes()}:${date.getMilliseconds()}`;
  }

  log(...messages: any[]) {
    // tslint:disable-next-line:no-console
    console.log(chalk.green(`log: [${ConsoleLogger.time()}]`), ...messages);
  }
  error(...messages: any[]) {
    // tslint:disable-next-line:no-console
    console.error(chalk.red(`error: [${ConsoleLogger.time()}]`), ...messages);
  }
  warn(...messages: any[]) {
    // tslint:disable-next-line:no-console
    console.warn(chalk.yellow(`warn: [${ConsoleLogger.time()}]`), ...messages);
  }
}
