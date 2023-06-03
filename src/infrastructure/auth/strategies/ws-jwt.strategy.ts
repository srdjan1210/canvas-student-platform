import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  JWT_SECRET,
  USER_REPOSITORY,
} from 'src/application/auth/auth.constants';
import { IUserRepository } from 'src/domain/auth/interfaces/user-repository.interface';

export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(JWT_SECRET),
    });
  }
}
