import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from '@core/helpers';
import { urlencoded, json } from 'body-parser';

declare const module: any;

bootstrap();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  await app.listen(environment.get('SERVER_PORT'));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
