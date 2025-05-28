import { constants } from 'buffer';
import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
config({
  path: '.env',
});
// Check already have .env??
if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Not found file .env');
  process.exit(1);
}

class ConfigSchema {
  @IsString()
  DATABASE_URL: string;
  @IsString()
  ACCESS_TOKEN_SECRET: string;
  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string;
  @IsString()
  REFRESH_TOKEN_SECRET: string;
  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string;
  @IsString()
  SECRET_API_KEY: string;
}
const configServer = plainToInstance(ConfigSchema, process.env, {
  enableImplicitConversion: true,
});
const error = validateSync(configServer);
if (error.length > 0) {
  console.log('Cac gia tri khai bao trong .env khong hop le');
  const errors = error.map((eItem) => {
    return {
      property: eItem.property,
      constants: eItem.constraints,
      value: eItem.value,
    };
  });
  throw errors;
}
const envConfig = configServer;
export default envConfig;
