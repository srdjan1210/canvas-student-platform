import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { JWT_SERVICE } from 'src/application/auth/auth.constants';
import { JWTService } from '../auth/services/jwt.service';
import { SocketWithUser } from './socket-with-user.type';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const clientPort = parseInt(this.configService.get('CLIENT_PORT'));

    const cors = {
      origin: [`*`],
    };

    this.logger.log('Configuring SocketIO server with custom CORS options', {
      cors,
    });

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    const jwtService = this.app.get(JWT_SERVICE);
    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.use(createTokenMiddleware(jwtService, this.logger));

    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JWTService, logger: Logger) =>
  (socket: SocketWithUser, next) => {
    const token =
      socket.handshake.auth.token || socket.handshake.headers['authorization'];

    try {
      const payload = jwtService.verify(token?.split(' ')[1]);
      socket.userId = payload.id;
      next();
    } catch {
      next(new Error('FORBIDDEN'));
    }
  };
