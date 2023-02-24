import { TokenPayload } from "../../domain/token-payload";


export interface IJwtService {
  generateToken(payload: TokenPayload)
}