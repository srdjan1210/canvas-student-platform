import { AuthGuard } from '@nestjs/passport';

export class WsGuard extends AuthGuard('ws') {}
