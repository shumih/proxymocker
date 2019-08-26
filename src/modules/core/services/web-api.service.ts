import { HttpService, Injectable } from '@nestjs/common';

// models
import { Request } from 'express';
import { AxiosResponse, Method } from 'axios';

// environment
import { environment } from '@core/helpers';

// helpers
import { omit } from 'lodash';

@Injectable()
export class WebApiService {
  constructor(private http: HttpService) {}

  public async redirectToWebApi({
    method,
    originalUrl,
    headers,
    body,
  }: Pick<Request, 'method' | 'originalUrl' | 'headers' | 'body'>): Promise<AxiosResponse<ArrayBuffer>> {
    const webApiUrl = `${environment.get('WEB_API_SERVER')}${originalUrl}`;

    const requestToWebApi = () =>
      this.http
        .request({
          url: webApiUrl,
          method: method as Method,
          headers,
          data: body,
          responseType: 'arraybuffer',
        })
        .toPromise()
        .catch(e => {
          if (e.response) {
            return e.response;
          }

          throw Error(e);
        });

    if (environment.get('FAKE_COOKIE')) {
      const cookie = `access-token=${environment.get('ACCESS_TOKEN')}; path=/; x-confirmation-token=${environment.get(
        'CONFIRMATION_TOKEN',
      )}; path=/; XSRF-TOKEN=${environment.get('XSRF_TOKEN')}; path=/;`;

      headers = {
        ...omit(headers, 'cookie', 'x-xsrf-token'),
        'x-xsrf-token': environment.get('XSRF_TOKEN'),
        cookie: cookie,
      };

      return await requestToWebApi().then(res => {
        if (res && res.headers['set-cookie']) {
          res.headers['set-cookie'] = cookie;
        }

        return res;
      });
    }

    return await requestToWebApi();
  }
}
