export interface FileUploadResponse {
  error: FileUploadError;
  message: string;
  number: number;
  fileName: string;
  uploaded: number;
  url: string;
}

export interface FileUploadError {
  number: number;
  message: string;
}

export interface FileUploadModel {
  buffer: Buffer;
  encoding: '7bit';
  fieldname: string;
  mimetype: MimeType;
  originalname: string;
  size: number;
}
