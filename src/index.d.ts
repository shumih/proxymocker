// tslint:disable-next-line:no-namespace
namespace NodeJS {
  interface ProcessEnv {
    SERVER_PORT: number;
    WEB_API_SERVER: string;
    MONGO_SERVER: string;
    MONGO_DATABASE: string;
    FAKE_BACKEND: boolean;
  }
}
