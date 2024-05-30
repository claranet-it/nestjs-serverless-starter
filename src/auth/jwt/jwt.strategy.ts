import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';
import { PayloadTokenDto } from '../dto/payload-token.dto';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 3,
        jwksUri: `https://cognito-idp.${configService.get(
          'REGION',
        )}.amazonaws.com/${configService.get(
          'user_pool_id',
        )}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get('client_id'),
      issuer: `https://cognito-idp.${configService.get(
        'REGION',
      )}.amazonaws.com/${configService.get('user_pool_id')}`,
      algorithms: ['RS256'],
    });
  }

  public async validate(payload: PayloadTokenDto): Promise<UserDto> {
    return {
      email: payload.email,
      firstName: payload.name,
      lastName: payload.family_name,
    };
  }
}
