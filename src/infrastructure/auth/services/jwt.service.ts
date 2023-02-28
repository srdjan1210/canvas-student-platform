import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { JwtService } from '@nestjs/jwt';
import { IJwtService } from '../../../application/auth/interfaces/jwt-service.interface';
import { TokenPayload } from '../../../domain/auth/token-payload';

@Injectable()
export class JWTService implements IJwtService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: TokenPayload) {
    return this.jwtService.sign(payload);
  }
}
