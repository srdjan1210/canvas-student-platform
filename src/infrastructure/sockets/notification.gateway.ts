import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { USER_REPOSITORY } from 'src/application/auth/auth.constants';
import { IUserRepository } from 'src/domain/auth/interfaces/user-repository.interface';
import { AnnouncementCreatedPayload } from '../../application/courses/events/internal/announcement-created-payload.dto';
import { SocketWithUser } from './socket-with-user.type';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export default class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;
  private connections: Map<number, Socket> = new Map();

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async handleConnection(client: SocketWithUser, ...args: any[]) {
    const userId = client.userId;
    const user = await this.userRepository.findById(userId);
    if (!user) {
      client.disconnect();
    }
    this.connections.set(userId, client);
  }

  handleDisconnect(client: SocketWithUser) {
    const userId = client.userId;
    this.connections.delete(userId);
  }

  afterInit(): void {
    console.log(`Websocket Gateway initialized.`);
  }

  @OnEvent('announcement.created')
  handleAnnouncementCreated({ ids, notification }: AnnouncementCreatedPayload) {
    // console.log(ids, notification);
    this.connections.forEach((socket: Socket, key: number) => {
      if (ids.includes(key))
        socket.emit('notification', {
          id: notification.id,
          body: notification.body,
          title: notification.title,
          professorName: notification?.professor?.name,
          professorSurname: notification?.professor?.surname,
          createdAt: notification?.createdAt,
          avatar: notification?.professor?.user?.avatar,
        });
    });
  }
}
