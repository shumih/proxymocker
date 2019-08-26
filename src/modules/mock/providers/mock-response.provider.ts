import { Connection, Repository } from 'typeorm';
import { MockResponse } from '../entities/mock-reponse.entity';

export const mockReponseProviders = [
  {
    provide: 'MOCK_RESPONSE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(MockResponse),
    inject: ['DATABASE_CONNECTION'],
  },
];
