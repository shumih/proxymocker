import { HttpModule, Module } from '@nestjs/common';

// modules
import { CoreModule } from '@core/modules/core/core-module';
import { DatabaseModule } from '@core/modules/database/database.module';

// services
import { MockWebApiService } from './services';

// controllers
import { WebApiController } from './controllers';

// providers
import { mockReponseProviders } from './providers/mock-response.provider';

@Module({
  imports: [HttpModule, CoreModule, DatabaseModule],
  providers: [...mockReponseProviders, MockWebApiService],
  controllers: [WebApiController],
})
export class MockModule {}
