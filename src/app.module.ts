import { Module } from '@nestjs/common';

// modules
import { CKEditorApiModule } from './modules/ckeditor/ckeditor-api.module';
import { MockModule } from './modules/mock/mock.module';

@Module({
  imports: [MockModule, CKEditorApiModule],
})
export class AppModule {}
