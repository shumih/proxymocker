import { Controller, Post, Req, Res, Logger, UseInterceptors, UploadedFiles, Get } from '@nestjs/common';
import * as FormData from 'form-data';
import * as uuid5 from 'uuid/v5';

// models
import { FileUploadModel, FileUploadResponse } from '../models/file-upload-response';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';

// services
import { WebApiService } from '@core/modules/core/services';

// models
import { AxiosResponse } from 'axios';

@Controller('/ckfinder/*')
export class CKFinderController {
  constructor(private webApi: WebApiService, private logger: Logger) {}

  @Get()
  public async getFile(@Req() request: Request, @Res() response: Response): Promise<unknown> {
    let webApiResponse;
    try {
      webApiResponse = await this.webApi.redirectToWebApi(request);
    } catch (e) {
      return this.logger.warn(e);
    }

    Object.entries(webApiResponse.headers).forEach(([header, value]: [string, string]) => {
      response.setHeader(header, value);
    });

    response.status(webApiResponse.status).json(webApiResponse.data);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('upload'))
  public async saveFile(
    @UploadedFiles() data: FileUploadModel[],
    @Req() request: Request,
  ): Promise<FileUploadResponse> {
    const { originalname, buffer, size } = data[0];
    const requestId = uuid5(`${originalname}${size}`, uuid5.URL);
    const formData: FormData = new FormData();
    formData.append('uh', buffer, originalname);

    let webApiResponse: AxiosResponse<unknown>;
    try {
      webApiResponse = await this.webApi.redirectToWebApi({
        ...request,
        originalUrl: `/api/v1/attachments?object_type=tmp_storage&request_id=${requestId}`,
        body: formData,
      });
    } catch (e) {
      this.logger.warn(e);
    }

    return {
      error: {
        number: +webApiResponse.data,
        message: 'Created',
      },
      message: 'Created',
      number: 0,
      fileName: 'file.jpg',
      uploaded: 1,
      url: 'file.jpg',
    };
  }
}
