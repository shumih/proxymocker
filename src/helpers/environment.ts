import { existsSync, readFileSync, writeFileSync } from 'fs';

type EnvironmentCoercionFunctionMap = {
  [key in keyof Partial<NodeJS.ProcessEnv>]: (value: string) => any;
};

class Environment {
  private coercionMap: EnvironmentCoercionFunctionMap = {
    SERVER_PORT: parseInt,
    MOCK_DATABASE_PORT: parseInt,
    FAKE_BACKEND: value => value === 'true',
    FAKE_COOKIE: value => value === 'true',
  };

  constructor() {
    this.setupEnvironment();
  }

  public get<T = string>(name: string): T {
    const fn = this.coercionMap[name];

    return typeof fn === 'function' ? fn(process.env[name]) : process.env[name];
  }

  private setupEnvironment(): void {
    const pathToEnv = '.env';

    if (!existsSync(pathToEnv)) {
      writeFileSync(pathToEnv, readFileSync('.sample-env'));
    }

    readFileSync('.env')
      .toString()
      .split('\n')
      .forEach(line => {
        const indexOfEqualMark = line.indexOf('=');

        if (indexOfEqualMark === -1) {
          return;
        }

        const name = line.substring(0, indexOfEqualMark);
        const value = line.substring(indexOfEqualMark + 1);

        if (process.env[name] == null) {
          process.env[name] = value;
        }
      });
  }
}

export const environment = new Environment();
