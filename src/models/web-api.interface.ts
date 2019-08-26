import { AxiosResponse } from 'axios';

export type WebApiErrorResponse = AxiosResponse<{
  code: string;
  description: string;
  error_message: string;
  guid?: string;
}>;
