import { createConnection } from 'typeorm';
import { environment } from '@core/helpers';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => await createConnection({
      type: 'postgres',
      host: environment.get('MOCK_DATABASE_HOST'),
      port: environment.get<number>('MOCK_DATABASE_PORT'),
      username: environment.get('MOCK_DATABASE_USER'),
      password: environment.get('MOCK_DATABASE_PASSWORD'),
      database: 'mock',
      entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
      ],
      synchronize: true,
    }),
  },
];
