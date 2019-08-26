import { Module, HttpModule, Logger, Provider, Global } from '@nestjs/common';

// services
import { ConsoleLogger, WebApiService } from './services';

const LOGGER_TOKEN: Provider = {
  provide: Logger,
  useClass: ConsoleLogger,
};

@Global()
@Module({
  imports: [HttpModule],
  providers: [LOGGER_TOKEN, WebApiService],
  exports: [LOGGER_TOKEN, WebApiService],
})
export class CoreModule {}
