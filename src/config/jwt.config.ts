import { ConfigService, registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  const configService = new ConfigService();
  return {
    secret: configService.get<string>('JWT_SECRET'),
    audience: configService.get<string>('JWT_TOKEN_AUDIENCE'),
    issuer: configService.get<string>('JWT_TOKEN_ISSUER'),
    accessTokenTTL: configService.get<number>('JWT_ACCESS_TOKEN_TTL') ?? 3600,
  };
});
