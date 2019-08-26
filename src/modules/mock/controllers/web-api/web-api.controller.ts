import { Controller, All, Req, Res, HttpService, Logger } from '@nestjs/common';

// models
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';

// services
import { MockWebApiService } from '@core/modules/mock/services';
import { WebApiService } from '@core/modules/core/services';

// helpers
import { environment } from '@core/helpers';

@Controller('/api/*')
export class WebApiController {
  constructor(
    private http: HttpService,
    private mockWebApi: MockWebApiService,
    private webApi: WebApiService,
    private logger: Logger,
  ) {}

  @All()
  public async redirectAll(@Req() request: Request, @Res() response: Response): Promise<void> {
    if (environment.get('FAKE_BACKEND')) {
      try {
        const model = await this.mockWebApi.retrieveFromPersistentStorage(request);

        response.writeHead(model.status, model.headers);
        MockWebApiService.writeDataAccordingToResponseType(response, model);

        return;
      } catch (e) {
        this.logger.warn(`Forward request to web api..`);
      }
    }

    let webApiResponse: AxiosResponse<ArrayBuffer>;

    try {
      webApiResponse = await this.webApi.redirectToWebApi(request);
    } catch (e) {
      return this.logger.warn(e);
    }

    this.mockWebApi.saveToPersistentStorage(request, webApiResponse);

    try {
      response.writeHead(webApiResponse.status, webApiResponse.headers);
      response.write(webApiResponse.data);
    } catch (e) {
      debugger
    }
  }
}
