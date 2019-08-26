import { Module, HttpModule } from '@nestjs/common';

// controllers
import { CKFinderController } from './controllers';

@Module({
  imports: [HttpModule],
  controllers: [CKFinderController],
})
export class CKEditorApiModule {}
