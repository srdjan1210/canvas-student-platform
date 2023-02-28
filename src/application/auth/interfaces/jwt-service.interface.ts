import { TokenPayload } from '../../../domain/auth/token-payload';

export interface IJwtService {
  generateToken(payload: TokenPayload);
}
