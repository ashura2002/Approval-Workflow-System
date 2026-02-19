import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

export const jwtConfigService = (config: ConfigService): JwtModuleOptions => ({
  secret: config.get<string>('JWT_SECRET'),
  signOptions: {
    expiresIn: config.get<string>(
      'JWT_EXPIRE_IN',
    ) as JwtSignOptions['expiresIn'],
  },
});
