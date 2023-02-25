import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { USER_REPOSITORY } from '../../../core/auth/application/auth.constants';
import { IUserRepository } from '../../../core/auth/domain/interfaces/user-repository.interface';
import { TokenPayload } from '../../../core/auth/domain/token-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ id }: TokenPayload) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
