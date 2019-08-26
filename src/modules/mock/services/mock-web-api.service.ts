import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as uuid from 'uuid/v5';

// models
import { AxiosResponse, ResponseType } from 'axios';
import { Request, Response } from 'express';
import { MockResponse } from '../entities/mock-reponse.entity';

// helpers
import { environment, readStreamAsBuffer } from '@core/helpers';

@Injectable()
export class MockWebApiService {
  private static getUUID(request: Request): string {
    return uuid(
      `${environment.get('WEB_API_SERVER')}-${request.method}-${request.originalUrl}-${Object.keys(
        request.headers,
      ).join(',')}`,
      uuid.URL,
    );
  }

  public static writeDataAccordingToResponseType(response: Response, model: MockResponse): void {
    switch (model.type) {
      case 'json': {
        response.write(JSON.stringify(model.data));
        break;
      }
      case 'blob':
      case 'stream':
      case 'arraybuffer': {
        response.write(model.binary);
        break;
      }
      case 'document':
      case 'text': {
        response.write(model.text);
        break;
      }
    }
  }

  private static async updateAccordingToResponseType(
    model: MockResponse,
    data: any,
    type: ResponseType,
  ): Promise<void> {
    switch (type) {
      case 'json': {
        model.data = data;
        break;
      }
      case 'arraybuffer': {
        model.binary = Buffer.from(data as ArrayBuffer);
        break;
      }
      case 'document': {
        model.text = data;
        break;
      }
      case 'text': {
        model.text = data;
        break;
      }
      case 'stream': {
        model.binary = await readStreamAsBuffer(data);
        break;
      }
    }
  }

  private static getResponseType({ config, headers }: AxiosResponse): ResponseType {
    if (config.responseType) {
      return config.responseType;
    }

    const contentType: string = headers['content-type'];
    switch (true) {
      case contentType.includes('application/json'): {
        return 'json';
      }
      case contentType.includes('text'): {
        return 'text';
      }
      case contentType.includes('application/octet-stream'): {
        return 'arraybuffer';
      }
      default: {
        return 'json';
      }
    }
  }

  constructor(
    private logger: Logger,
    @Inject('MOCK_RESPONSE_REPOSITORY') private mockResponseRepository: Repository<MockResponse>,
  ) {}

  public async retrieveFromPersistentStorage(request: Request): Promise<MockResponse> | never {
    try {
      return this.mockResponseRepository.findOneOrFail(MockWebApiService.getUUID(request));
    } catch (e) {
      if (e.name === 'EntityNotFound') {
        throw e;
      }

      this.logger.warn(e);
    }
  }

  public async saveToPersistentStorage(request: Request, response: AxiosResponse): Promise<void> {
    const { status, data, headers } = response;
    const id = MockWebApiService.getUUID(request);

    let model: MockResponse;
    try {
      model = await this.mockResponseRepository.findOneOrFail(id);
    } catch (e) {
      if (e.name !== 'EntityNotFound') {
        this.logger.warn(e);
      }

      model = new MockResponse();
    }

    const responseType = MockWebApiService.getResponseType(response);

    model.id = id;
    model.url = request.originalUrl;
    model.method = request.method;
    model.status = status;
    model.headers = headers;
    model.type = responseType;
    await MockWebApiService.updateAccordingToResponseType(model, data, responseType);

    await this.mockResponseRepository.save(model);
  }
}
